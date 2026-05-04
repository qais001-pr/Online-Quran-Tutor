using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using TimeZoneConverter;

namespace webapi.Controllers.Dashboard
{
    public interface IDashboardController
    {
        HttpResponseMessage getTutorUpcomingClass(int UserId);
    }
    public class DashboardController : ApiController
    {
        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
        [HttpGet]
        [Route("api/Dashboard/getTutorUpcomingClass")]
        public HttpResponseMessage getTutorUpcomingClass(int UserId)
        {
            var Student = _context.TimeTables.Where(ss => ss.Enrollment.User1.userID == UserId).GroupBy(s => s.Enrollment.User.userID);
            var studentList = new List<object>();
            foreach (var student in Student)
            {

                var studentId = student.Key;
                var studentName = _context.Users.Where(u => u.userID == studentId).Select(u => u.name).FirstOrDefault();
                var studentProfile = _context.Users.Where(u => u.userID == studentId).Select(u => u.profile).FirstOrDefault();
                var studentLocation = _context.Users.Where(u => u.userID == studentId).Select(u => u.country).FirstOrDefault();
                var Image = _context.Users.Where(u => u.userID == studentId).Select(u => u.profile).FirstOrDefault();
                studentList.Add(new
                {
                    studentId,
                    studentName,
                    studentProfile,
                    studentLocation,
                    Image
                });

            }
            var timeZone = _context.Users.Where(u => u.userID == UserId).Select(u => u.timezone).FirstOrDefault();
            TimeZoneInfo userTimeZone;
            try
            {
                userTimeZone = TZConvert.GetTimeZoneInfo(timeZone);
            }
            catch (Exception)
            {
                userTimeZone = TimeZoneInfo.Utc;
            }
            var TutorClasses = _context.TimeTables.Where(c => c.Enrollment.User1.userID == UserId).ToList();

            DateTime Now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, userTimeZone);
            DateTime Today = Now.Date;
            TimeSpan CurrentTime = Now.TimeOfDay;
            DateTime nowInUserZone = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, userTimeZone);
            DateTime todayInUserZone = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, userTimeZone).Date;
            DateTime MonthInUserZone = todayInUserZone.AddMonths(1);

            var pendingClasses = (from c in TutorClasses
                                  where c.Status.ToLower() == "pending"
                                  where c.ClassDate.Month == todayInUserZone.Month
                                  orderby c.ClassDate, c.Slot.startTime
                                  select new
                                  {
                                      classId = c.TimeTableid,
                                  }).Count();
            var completedClasses = (from c in TutorClasses
                                    where c.Status.ToLower() == "completed"
                                    where c.ClassDate.Month == todayInUserZone.Month
                                    orderby c.ClassDate, c.Slot.startTime
                                    select new
                                    {
                                        classId = c.TimeTableid,
                                    }).Count();
            var MissedClasses = (from c in TutorClasses
                                 where c.Status.ToLower() == "missed"
                                 where c.ClassDate.Month == todayInUserZone.Month
                                 orderby c.ClassDate, c.Slot.startTime
                                 select new
                                 {
                                     classId = c.TimeTableid,
                                 }).Count();
            var totalClasses = (from c in TutorClasses
                                where c.ClassDate.Month == todayInUserZone.Month
                                orderby c.ClassDate, c.Slot.startTime
                                select new
                                {
                                    classId = c.TimeTableid,
                                }).Count();
            decimal progress = totalClasses > 0 ? Math.Round((decimal)completedClasses / totalClasses * 100, 2) : 0;
            var todaysClasses = (from c in TutorClasses
                                 where c.Status.ToLower() != "completed"
                                 where c.ClassDate.Date == todayInUserZone
                                 let classEndUtc = c.ClassDate.Date.Add(c.Slot.endTime)
                                 let classEndInUserZone = TimeZoneInfo.ConvertTimeFromUtc(classEndUtc, userTimeZone)
                                 where classEndInUserZone >= nowInUserZone
                                 orderby c.Slot.startTime
                                 select new
                                 {
                                     classId = c.TimeTableid,
                                     scheduledDate = c.ClassDate.ToLongDateString(),
                                     surahName = (from tt in _context.TimeTables
                                                  join s in _context.Enrollments on tt.Enrollment.enrollmentid equals s.enrollmentid
                                                  join surah in _context.surahs on s.surah.Id equals surah.Id
                                                  where tt.TimeTableid == c.TimeTableid
                                                  select surah.surah_Urdu_Names).FirstOrDefault(),
                                     studentName = c.Enrollment.User.name,
                                     studentProfile = c.Enrollment.User.profile,
                                     studentLocation = c.Enrollment.User.country,
                                     startTime = c.Slot.startTime,
                                     endTime = c.Slot.endTime,
                                     ClassDate = c.ClassDate,
                                     classDate = c.ClassDate.ToLongDateString(),
                                     status = c.Status,
                                 })
                                    .AsEnumerable()
                                    .ToList();


            return Request.CreateResponse(System.Net.HttpStatusCode.OK, new
            {
                todaysClasses = todaysClasses,
                students = studentList,
                monthlyStatistics = new
                {
                    pendingClasses,
                    completedClasses,
                    MissedClasses,
                    progress
                },
                TotalStudents = Student.Count()
            });
        }
    }
}
