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
        HttpResponseMessage rejectRequest(int requestID);
        HttpResponseMessage getClasses(int tutorID);
        HttpResponseMessage getClassesByStudent(int studentID);
        HttpResponseMessage getClassDataByUsingClassID(int ClassID);
        HttpResponseMessage createClassesAndAcceptRequests(AcceptRequestDTO request);
        HttpResponseMessage getLessons(int ClassID);
    }
    public class ClassesController : ApiController, IClass
    {
        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();


        [HttpPost]
        public HttpResponseMessage createClassesAndAcceptRequests(AcceptRequestDTO request)
        {
            try
            {
                var student = _context.Users.FirstOrDefault(u => u.userID == request.studentID);
                var tutor = _context.Users.FirstOrDefault(u => u.userID == request.tutorID);
                var subject = _context.Subjects.FirstOrDefault(s => s.subjectID == request.subjectID);
                var studentRequest = _context.StudentTutorRequests.FirstOrDefault(r => r.RequestID == request.requestID);

                if (student == null || tutor == null || subject == null || studentRequest == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        message = "Invalid student, tutor, subject, or request."
                    });
                }

                var lessonPlans = _context.Lessons
                    .Where(l => l.Subject.subjectID == request.subjectID && l.surah.Id == request.surahID)
                    .Select(l => new
                    {
                        l.LessonPlan.lessonPlanID,
                        l.LessonPlan.lessonName
                    })
                    .Distinct()
                    .OrderBy(lp => lp.lessonPlanID)
                    .ToList();

                var totalLessonPlans = lessonPlans.Count;

                var matchingSlots = (from ts in _context.TutorSlots
                                     join ss in _context.StudentSlots on new { ts.Slot.slotID, ts.Day.dayID } equals new { ss.Slot.slotID, ss.Day.dayID }
                                     where ts.User.userID == request.tutorID && ss.User.userID == request.studentID && ts.status == "booked" && ss.Status == "booked" && ts.classStatus == "pending"
                                     select new { ts.Day.dayID, ts.Slot.slotID, }).Distinct().OrderBy(s => s.dayID).ThenBy(s => s.slotID).ToList();

                var totalMatchingSlots = matchingSlots.Count;
                //List<TimeTableResponseDTO> list = new List<TimeTableResponseDTO>();

                int slotsPerWeek = matchingSlots.Count;

                DateTime startDate = GetWeekStart(DateTime.Today);

                for (int i = 0; i < lessonPlans.Count; i++)
                {
                    var lessonPlanID = lessonPlans[i].lessonPlanID;
                    int weekIndex = i / slotsPerWeek;
                    int slotIndex = i % slotsPerWeek;
                    var slot = matchingSlots[slotIndex];
                    DateTime classDate = GetClassDate(startDate, weekIndex, slot.dayID);
                    var newClass = new TimeTable
                    {
                        User = student,
                        User1 = tutor,
                        Day = _context.Days.FirstOrDefault(d => d.dayID == slot.dayID),
                        Slot = _context.Slots.FirstOrDefault(s => s.slotID == slot.slotID),
                        LessonPlan = _context.LessonPlans.FirstOrDefault(lp => lp.lessonPlanID == lessonPlanID),
                        StudentTutorRequest = studentRequest,
                        Subject = subject,
                        Surahid = request.surahID,
                        CreatedAt = DateTime.Now,
                        Corrections = "0",
                        Status = "pending",
                        ClassDate = classDate,
                    };
                    _context.TimeTables.Add(newClass);
            
                    var tutorSlot = _context.TutorSlots.FirstOrDefault(ts => ts.User.userID == request.tutorID && ts.Day.dayID == slot.dayID && ts.Slot.slotID == slot.slotID);
                    tutorSlot.classStatus = "Booked";
                }

                studentRequest.status = "Accepted";

                // Reject other requests
                var otherRequests = (
                    from ts in _context.TutorSlots
                    join ss in _context.StudentSlots
                        on new { ts.Slot.slotID, ts.Day.dayID } equals new { ss.Slot.slotID, ss.Day.dayID }
                    join stR in _context.StudentTutorRequests
                        on ts.User.userID equals stR.User1.userID
                    where stR.User.userID != request.studentID
                          && ts.User.userID == request.tutorID
                          && stR.surah.Id == request.surahID
                    select stR
                ).Distinct().ToList();

                foreach (var item in otherRequests)
                    item.status = "Rejected";

                _context.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    statusCode = HttpStatusCode.OK,
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
        private DateTime GetClassDate(DateTime startDate, int weekIndex, int dayId)
        {
            int dayOffset = dayId - 1;
            return startDate
                .AddDays(weekIndex * 7)
                .AddDays(dayOffset + 7);
        }
        private DateTime GetWeekStart(DateTime date)
        {
            int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-diff).Date;
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
            var result = (from c in _context.TimeTables
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
            var result = (from c in _context.TimeTables
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
            var lessonPlanID = _context.TimeTables
                .Where(c => c.ClassID == ClassID)
                .Select(c => c.LessonPlan.lessonPlanID)
                .FirstOrDefault();
            var lesson = (from lp in _context.LessonPlans
                          join l in _context.Lessons on lp.lessonPlanID equals l.LessonPlan.lessonPlanID
                          join q in _context.Qurans on l.Quran.ID equals q.ID
                          where lp.lessonPlanID == lessonPlanID
                          select new { q.ID, q.AyahText }).ToList();
            var surahData = (from c in _context.TimeTables
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
            var lessonPlanID = _context.TimeTables
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