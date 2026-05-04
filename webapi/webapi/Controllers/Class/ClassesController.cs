using System;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TimeZoneConverter;
using webapi.Models.Class;
namespace webapi.Controllers.Classes
{
    public interface IClass
    {
        HttpResponseMessage rejectRequest(int requestID);
        HttpResponseMessage getClasses(int tutorID);
        HttpResponseMessage getClassesByStudent(int studentID);
        HttpResponseMessage getClassDataByUsingClassID(int ClassID);
    }
    public class ClassesController : ApiController, IClass
    {
        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
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

            DateTime today = DateTime.Now.Date;
            DateTime SevenDaysFromNow = DateTime.Now.Date.AddDays(7);
            var result = (from c in _context.TimeTables
                          join d in _context.Days on c.Day.dayID equals d.dayID
                          join s in _context.Slots on c.Slot.slotID equals s.slotID
                          join sb in _context.Subjects on c.Enrollment.Subject.subjectID equals sb.subjectID
                          join tutoruser in _context.Users on c.Enrollment.User1.userID equals tutoruser.userID
                          join studentuser in _context.Users on c.Enrollment.User.userID equals studentuser.userID
                          //join lp in _context.LessonPlans on c.Enrollment.LessonPlan.lessonPlanID equals lp.lessonPlanID
                          where c.Enrollment.User1.userID == tutorID && c.Status.ToLower() == "pending" && c.ClassDate >= today && c.ClassDate <= SevenDaysFromNow
                          select new
                          {
                              c.TimeTableid,
                              studentname = studentuser.name,
                              studentProfileImage = studentuser.profile,
                              tutorName = tutoruser.name,
                              sb.subjectName,
                              d.dayName,
                              s.startTime,
                              s.endTime,
                              c.ClassDate,
                              c.Status
                          })
                          .ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                data = result,
                totalClasses = result.Count(),
                message = "Data Collected successfully",
            });
        }

        [HttpGet]
        public HttpResponseMessage getClassesByStudent(int studentID)
        {
            var TimeZone = _context.Users.Where(u => u.userID == studentID).Select(u => u.timezone).FirstOrDefault();
            TimeZoneInfo userTimeZone;
            try
            {
                userTimeZone = TZConvert.GetTimeZoneInfo(TimeZone);
            }
            catch (Exception)
            {
                userTimeZone = TimeZoneInfo.Utc;
            }
            DateTime today = DateTime.Now.Date;
            DateTime SevenDaysFromNow = DateTime.Now.Date.AddDays(7);
            var result = (from c in _context.TimeTables
                          join d in _context.Days on c.Day.dayID equals d.dayID
                          join s in _context.Slots on c.Slot.slotID equals s.slotID
                          join sb in _context.Subjects on c.Enrollment.Subject.subjectID equals sb.subjectID
                          join tutoruser in _context.Users on c.Enrollment.User1.userID equals tutoruser.userID
                          join studentuser in _context.Users on c.Enrollment.User.userID equals studentuser.userID
                          where (c.Enrollment.User1.userID == studentID || c.Enrollment.User.userID == studentID) && c.Status.ToLower() == "pending" && c.ClassDate >= today && c.ClassDate <= SevenDaysFromNow
                          select new
                          {
                              c.TimeTableid,
                              studentname = studentuser.name,
                              tutorProfileImage = tutoruser.profile,
                              tutorName = tutoruser.name,
                              sb.subjectName,
                              d.dayName,
                              s.startTime,
                              s.endTime,
                              c.ClassDate,
                              c.Status
                          })
                          .ToList();
            var filteredData = result.Where(t =>
            {
                DateTime utcStart = DateTime.SpecifyKind(t.ClassDate.Date.Add(t.startTime), DateTimeKind.Utc);
                DateTime utcEnd = DateTime.SpecifyKind(t.ClassDate.Date.Add(t.endTime), DateTimeKind.Utc);

                DateTime localStart = TimeZoneInfo.ConvertTimeFromUtc(utcStart, userTimeZone);
                DateTime localEnd = TimeZoneInfo.ConvertTimeFromUtc(utcEnd, userTimeZone);
                DateTime localNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, userTimeZone);
                DateTime localLimit = localNow.AddDays(7);
                return localEnd > localNow && localStart <= localLimit;
            }).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                data = filteredData,
                totalClasses = filteredData.Count(),
                message = "Data Collected successfully",
            });
        }



        [HttpGet]
        public HttpResponseMessage getClassDataByUsingClassID(int ClassID)
        {
            var TimeTable = _context.TimeTables.Where(t => t.TimeTableid == ClassID).FirstOrDefault();
            var enrollmentID = TimeTable.Enrollment.enrollmentid;
            var Enrollment = _context.Enrollments.Where(e => e.enrollmentid == enrollmentID).FirstOrDefault();
            var currentAyat = Enrollment.currentayat;
            var surahName = _context.surahs.Where(s => s.Id == Enrollment.surah.Id).Select(s => s.surah_Urdu_Names).FirstOrDefault();
            var lesson = _context.Qurans.Where(q => q.surah.Id == Enrollment.surah.Id && q.VerseID >= currentAyat && q.VerseID <= TimeTable.endIndex).Select(q => new
            {
                q.VerseID,
                q.AyahText,
            })
                .Take(10)
                .ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                data = new
                {
                    surahName = surahName,
                    lessondata = lesson
                },
                message = "Data Collected successfully",
            });
        }









    }
}