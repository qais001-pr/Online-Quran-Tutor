using System;
using System.Collections.Generic;
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
    }
    public class ClassesController : ApiController, IClass
    {
        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
        public DateTime GetNextDateForDay(DayOfWeek day)
        {
            DateTime today = DateTime.Today;
            int daysUntil = ((int)day - (int)today.DayOfWeek + 7) % 7;
            if (daysUntil == 0) daysUntil = 7;
            return today.AddDays(daysUntil);
        }
        [HttpPost]
        public HttpResponseMessage CreateClassesWeeklySimple(AcceptRequestDTO request)
        {
            try
            {
                var student = _context.Users.FirstOrDefault(s => s.userID == request.studentID);
                var tutor = _context.Users.FirstOrDefault(t => t.userID == request.tutorID);
                var subject = _context.Subjects.FirstOrDefault(s => s.subjectID == request.subjectID);
                var studentRequest = _context.StudentTutorRequests.FirstOrDefault(r => r.RequestID == request.requestID);
                var lessonPlans = _context.Lessons
                    .Where(l => l.surah.Id == request.surahID && l.Subject.subjectID == request.subjectID)
                    .Select(l => l.LessonPlan)
                    .Distinct()
                    .OrderBy(lp => lp.lessonPlanID)
                    .ToList();

                if (!lessonPlans.Any())
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "No lesson plans found for this Surah" });
                }

                var matchingSlots = (
                    from ts in _context.TutorSlots
                    join ss in _context.StudentSlots
                    on new { ts.Slot.slotID, ts.Day.dayID } equals new { ss.Slot.slotID, ss.Day.dayID }
                    where ts.User.userID == request.tutorID
                          && ss.User.userID == request.studentID
                          && ts.status == "available"
                    select ts
                ).ToList();

                if (!matchingSlots.Any())
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "No matching slots available" });
                }
                var slotStartDates = new List<DateTime>();
                foreach (var slot in matchingSlots)
                {
                    if (!Enum.TryParse(slot.Day.dayName, true, out DayOfWeek dayOfWeek))
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest,
                            new { message = $"Invalid day name: {slot.Day.dayName}" });
                    }

                    slotStartDates.Add(GetNextDateForDay(dayOfWeek));
                }

                var slotWeekCounters = Enumerable.Repeat(0, matchingSlots.Count).ToList();
                int slotIndex = 0;
                foreach (var lessonPlan in lessonPlans)
                {
                    int currentSlotIndex = slotIndex % matchingSlots.Count;
                    var slot = matchingSlots[currentSlotIndex];
                    DateTime classDate = slotStartDates[currentSlotIndex].AddDays(slotWeekCounters[currentSlotIndex] * 7).Date;
                    string Day = classDate.DayOfWeek.ToString();
                    bool conflictExists = _context.Classes.Any(c =>
                        c.ClassDate == classDate &&
                        c.Slot.slotID == slot.Slot.slotID &&
                        (c.User1.userID == tutor.userID || c.User.userID == student.userID)
                    );

                    if (conflictExists)
                    {
                        return Request.CreateResponse(HttpStatusCode.Conflict,
                            new { message = $"Scheduling conflict on {classDate:dd-MMM-yyyy}" });
                    }
                    Class clas = new Class
                    {
                        User = student,
                        User1 = tutor,
                        Subject = subject,
                        Slot = slot.Slot,
                        Day = _context.Days.Where(d => d.dayName == Day).FirstOrDefault(),
                        LessonPlan = lessonPlan,
                        StudentTutorRequest = studentRequest,
                        Status = "pending",
                        Corrections = "0",
                        ClassDate = classDate,
                        CreatedAt = DateTime.Now
                    };

                    _context.Classes.Add(clas);
                    slotWeekCounters[currentSlotIndex]++;
                    slotIndex++;
                }
                studentRequest.status = "Accepted";
                var tutorSlotIds = (from ts in _context.TutorSlots where ts.User.userID == tutor.userID select new { ts.classStatus }).ToList();

                _context.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    message = "Classes created successfully",
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError,
                    new { message = "Something went wrong", error = ex.Message });
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
                          where c.User1.userID == studentID || c.User.userID == studentID
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