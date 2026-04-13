using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using webapi.Models.Class;
namespace webapi.Controllers.Classes
{
    public interface IClass
    {
        DateTime GetNextDateForDay(DayOfWeek day);
        HttpResponseMessage CreateClassesWeeklySimple(AcceptRequestDTO request);
        HttpResponseMessage rejectRequest(int requestID);
        HttpResponseMessage getClasses(int tutorID);
        HttpResponseMessage getClassesByStudent(int studentID);
        HttpResponseMessage getLessons(int ClassID);
    }
    public class ClassesController : ApiController, IClass
    {
        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
        public DateTime GetNextDateForDay(DayOfWeek day)
        {
            DateTime today = DateTime.Today;
            int daysUntil = ((int)day - (int)today.DayOfWeek + 7) % 7;
            //if (daysUntil == 0) daysUntil = 7;
            return today.AddDays(daysUntil);
        }
        [HttpPost]
        public HttpResponseMessage CreateClassesWeeklySimple(AcceptRequestDTO request)
        {
            try
            {
                // Fetch necessary data
                var student = _context.Users.FirstOrDefault(s => s.userID == request.studentID);
                var tutor = _context.Users.FirstOrDefault(t => t.userID == request.tutorID);
                var subject = _context.Subjects.FirstOrDefault(s => s.subjectID == request.subjectID);
                var studentRequest = _context.StudentTutorRequests.FirstOrDefault(r => r.RequestID == request.requestID);

                if (student == null || tutor == null || subject == null || studentRequest == null)
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Invalid student, tutor, subject, or request." });

                // Fetch lesson plans for the given Surah and subject
                var lessonPlans = _context.Lessons
                    .Where(l => l.surah.Id == request.surahID && l.Subject.subjectID == request.subjectID)
                    .Select(l => l.LessonPlan)
                    .Distinct()
                    .OrderBy(lp => lp.lessonPlanID)
                    .ToList();

                if (!lessonPlans.Any())
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "No lesson plans found for this Surah." });

                // Fetch student-selected slots that are available for the tutor
                var studentSelectedSlots = (
                    from ts in _context.TutorSlots
                    join ss in _context.StudentSlots
                        on new { ts.Slot.slotID, ts.Day.dayID } equals new { ss.Slot.slotID, ss.Day.dayID }
                    where ts.User.userID == request.tutorID
                          && ss.User.userID == request.studentID
                          && ts.classStatus == "available"
                          && ts.status == "booked"
                          && ss.Status == "booked"
                    select ts
                ).OrderBy(s => s.Slot.slotID).ToList();

                if (!studentSelectedSlots.Any())
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "No matching slots available." });

                // Track weekly repetition per Slot+Day
                var slotWeekCounters = studentSelectedSlots
                    .GroupBy(s => new { s.Slot.slotID, s.Day.dayID })
                    .ToDictionary(g => $"{g.Key.slotID}_{g.Key.dayID}", g => 0);

                int lessonIndex = 0;

                // Helper to get the next date for a specific DayOfWeek
                DateTime GetNextDateForSlotDay(DayOfWeek day)
                {
                    DateTime today = DateTime.Today;
                    int daysUntil = ((int)day - (int)today.DayOfWeek + 7) % 7;
                    return today.AddDays(daysUntil + 7);
                }

                // Schedule each lesson plan
                foreach (var lessonPlan in lessonPlans)
                {
                    var slot = studentSelectedSlots[lessonIndex % studentSelectedSlots.Count];

                    if (!Enum.TryParse(slot.Day.dayName, true, out DayOfWeek slotDayOfWeek))
                        return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = $"Invalid day name: {slot.Day.dayName}" });

                    // Composite key for this slot + day
                    var key = $"{slot.Slot.slotID}_{slot.Day.dayID}";
                    var tutorSlotForThisDay = _context.TutorSlots
       .FirstOrDefault(ts =>
           ts.User.userID == request.tutorID &&
           ts.Day.dayID == slot.Day.dayID &&
           ts.Slot.slotID == slot.Slot.slotID);

                    if (tutorSlotForThisDay != null)
                    {
                        tutorSlotForThisDay.classStatus = "Booked";
                    }
                    // Calculate the class date (weekly repetition)
                    DateTime classDate = GetNextDateForSlotDay(slotDayOfWeek)
                        .AddDays(slotWeekCounters[key] * 7);

                    // Conflict check for this exact slot
                    bool conflictExists = _context.Classes.Any(c =>
                        c.ClassDate == classDate &&
                        c.Slot.slotID == slot.Slot.slotID &&
                        (c.User1.userID == request.tutorID || c.User.userID == request.studentID)
                    );

                    if (conflictExists)
                        return Request.CreateResponse(HttpStatusCode.Conflict, new { message = $"Scheduling conflict on {classDate:dd-MMM-yyyy}" });

                    // Create the class
                    var clas = new Class
                    {
                        User = student,
                        User1 = tutor,
                        Subject = subject,
                        Slot = slot.Slot,
                        Day = slot.Day,
                        LessonPlan = lessonPlan,
                        StudentTutorRequest = studentRequest,
                        Status = "pending",
                        Corrections = "0",
                        ClassDate = classDate,
                        Surahid = request.surahID,
                        CreatedAt = DateTime.Now
                    };

                    _context.Classes.Add(clas);

                    // Increment weekly counter for this slot + day
                    slotWeekCounters[key]++;

                    lessonIndex++;
                }

                // Update student request status
                studentRequest.status = "Accepted";

                // Reject other requests with same tutor + Surah
                var otherRequests = (
                    from ts in _context.TutorSlots
                    join ss in _context.StudentSlots
                        on new { ts.Slot.slotID, ts.Day.dayID } equals new { ss.Slot.slotID, ss.Day.dayID }
                    join stR in _context.StudentTutorRequests
                        on ts.User.userID equals stR.User1.userID
                    where stR.User.userID != request.studentID
                          && ts.User.userID == request.tutorID
                          && stR.User.userID != ss.User.userID
                          && stR.surah.Id == request.surahID
                    select stR
                ).Distinct().ToList();

                foreach (var item in otherRequests)
                    item.status = "Rejected";

                // Mark tutor slots as booked for these student-selected slots
                //foreach (var ts in studentSelectedSlots)
                //    ts.classStatus = "Booked";

                // Save all changes
                _context.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    message = "Classes created successfully"
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                    message = "Something went wrong",
                    error = ex.Message
                });
            }
        }
        [HttpPost]
        public HttpResponseMessage rejectRequest(int requestID)
        {
            var request = _context.StudentTutorRequests.FirstOrDefault(r => r.RequestID == requestID);
            request.status = "Rejected";
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                message = "Request Reject Successfully"
            });
        }

        [HttpGet]
        public HttpResponseMessage getClasses(int tutorID)
        {
            var result = (from c in _context.Classes
                          join d in _context.Days on c.Day.dayID equals d.dayID
                          join s in _context.Slots on c.Slot.slotID equals s.slotID
                          join sb in _context.Subjects on c.Subject.subjectID equals sb.subjectID
                          join tutoruser in _context.Users on c.User1.userID equals tutoruser.userID
                          join studentuser in _context.Users on c.User.userID equals studentuser.userID
                          join lp in _context.LessonPlans on c.LessonPlan.lessonPlanID equals lp.lessonPlanID
                          where c.User1.userID == tutorID || c.User.userID == tutorID
                          select new
                          {
                              c.ClassID,
                              studentname = studentuser.name,
                              studentProfileImage = studentuser.profile,
                              tutorName = tutoruser.name,
                              sb.subjectName,
                              d.dayName,
                              s.startTime,
                              s.endTime,
                              lp.lessonName,
                              c.ClassDate,
                              c.Status
                          }).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                data = result,
                message = "Data Collected successfully",
            });
        }

        [HttpGet]
        public HttpResponseMessage getClassesByStudent(int studentID)
        {
            var result = (from c in _context.Classes
                          join d in _context.Days on c.Day.dayID equals d.dayID
                          join s in _context.Slots on c.Slot.slotID equals s.slotID
                          join sb in _context.Subjects on c.Subject.subjectID equals sb.subjectID
                          join tutoruser in _context.Users on c.User1.userID equals tutoruser.userID
                          join studentuser in _context.Users on c.User.userID equals studentuser.userID
                          join lp in _context.LessonPlans on c.LessonPlan.lessonPlanID equals lp.lessonPlanID
                          where c.User1.userID == studentID || c.User.userID == studentID && c.Status.ToLower() == "pending"
                          select new
                          {
                              c.ClassID,
                              studentname = studentuser.name,
                              tutorProfileImage = tutoruser.profile,
                              tutorName = tutoruser.name,
                              sb.subjectName,
                              d.dayName,
                              s.startTime,
                              s.endTime,
                              lp.lessonName,
                              c.ClassDate,
                              c.Status
                          }).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                data = result,
                message = "Data Collected successfully",
            });
        }


        [HttpGet]
        public HttpResponseMessage getClassDataByUsingClassID(int ClassID)
        {
            var lessonPlanID = _context.Classes
                .Where(c => c.ClassID == ClassID)
                .Select(c => c.LessonPlan.lessonPlanID)
                .FirstOrDefault();
            var lesson = (from lp in _context.LessonPlans
                          join l in _context.Lessons on lp.lessonPlanID equals l.LessonPlan.lessonPlanID
                          join q in _context.Qurans on l.Quran.ID equals q.ID
                          where lp.lessonPlanID == lessonPlanID
                          select new { q.ID, q.AyahText }).ToList();
            var surahData = (from c in _context.Classes
                             join s in _context.surahs on c.Surahid equals s.Id
                             where c.ClassID == ClassID
                             select new { surahId = c.Surahid, surahName = s.surah_Urdu_Names, surahEnglishName = s.surah_names }).FirstOrDefault();
            var lessonName = (from lp in _context.LessonPlans
                              join l in _context.Lessons on lp.lessonPlanID equals l.LessonPlan.lessonPlanID
                              join q in _context.Qurans on l.Quran.ID equals q.ID
                              where lp.lessonPlanID == lessonPlanID
                              select l.LessonPlan.lessonName).FirstOrDefault();

            var result = new
            {
                lessonName = lessonName,
                surahData = surahData,
                lessondata = lesson
            };
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        public HttpResponseMessage getLessons(int ClassID)
        {
            var lessonPlanID = _context.Classes
                .Where(c => c.ClassID == ClassID)
                .Select(c => c.LessonPlan.lessonPlanID)
                .FirstOrDefault();

            if (lessonPlanID == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, new
                {
                    success = false,
                    message = "Lesson plan not found"
                });
            }

            // Step 1: Get lessons + surah info first
            var lessons = _context.Lessons
                .Where(l => l.LessonPlan.lessonPlanID == lessonPlanID)
                .Select(l => new
                {
                    lessonPlanID = l.LessonPlan.lessonPlanID,
                    lessonName = l.LessonPlan.lessonName,
                    surahId = l.surah.Id,
                    surahName = l.surah.surah_names
                }).Distinct()
                .ToList();

            var result = lessons.Select(l => new
            {
                l.lessonPlanID,
                l.lessonName,
                l.surahName,
                ayats = _context.Qurans
                    .Where(q => q.surah.Id == l.surahId)
                    .Select(q => new
                    {
                        ayatId = q.ID,
                        ayat = q.AyahText
                    }).Distinct()
                    .ToList()
            }).Distinct().ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                data = result,
                message = "Data Collected successfully"
            });
        }

    }
}