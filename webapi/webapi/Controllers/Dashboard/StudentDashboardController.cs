using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TimeZoneConverter;

namespace webapi.Controllers.Dashboard
{
    public interface IStudentController
    {
        HttpResponseMessage GetDataOfStudent(int studentId);
    }

    public class StudentDashboardController : ApiController
    {
        private readonly onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();

        [HttpGet]
        public HttpResponseMessage GetDataOfStudent(int studentId)
        {
            try
            {
                var enrollment = _context.Enrollments.Where(e => e.User.userID == studentId && e.enrollment_status == "Active").FirstOrDefault();
                var SurahID = enrollment.surah.Id;
                var totalAyats = _context.Qurans.Where(q => q.surah.Id == SurahID).Count();
                var completedAyats = _context.Qurans.Where(q => q.VerseID < enrollment.currentayat && q.surah.Id == SurahID).Count();
                var progressPercentage = totalAyats > 0 ? (double)completedAyats / totalAyats * 100 : 0;

                var timeZone = _context.Users.Where(u => u.userID == studentId).Select(u => u.timezone).FirstOrDefault();
                TimeZoneInfo userTimeZone;
                try
                {
                    userTimeZone = TZConvert.GetTimeZoneInfo(timeZone);
                }
                catch (Exception)
                {
                    userTimeZone = TimeZoneInfo.Utc;
                }
                var TutorClasses = _context.TimeTables.Where(c => c.Enrollment.User.userID == studentId && c.Status.ToLower() != "completed").ToList();

                DateTime Now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, userTimeZone);
                DateTime Today = Now.Date;
                TimeSpan CurrentTime = Now.TimeOfDay;
                DateTime nowInUserZone = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, userTimeZone);
                DateTime todayInUserZone = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, userTimeZone).Date;
                DateTime MonthInUserZone = todayInUserZone.AddMonths(1);
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
                                         tutorName = c.Enrollment.User1.name,
                                         tutorProfile = c.Enrollment.User1.profile,
                                         studentLocation = c.Enrollment.User.country,
                                         subject = c.Enrollment.User.Subject.subjectName,
                                         startTime = c.Slot.startTime,
                                         endTime = c.Slot.endTime,
                                         ClassDate = c.ClassDate,
                                         classDate = c.ClassDate.ToLongDateString(),
                                         status = c.Status,
                                     }).Take(1)
                                        .AsEnumerable()
                                        .ToList();
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    data = new
                    {
                        surahAyat = new
                        {
                            enrollment.surah.surah_Urdu_Names,
                            totalAyats = totalAyats,
                            completedAyats = completedAyats,
                            ayatProgress = totalAyats > 0 ? Math.Round((decimal)completedAyats / totalAyats * 100, 2) : 0
                        },
                        upcomingClass = todaysClasses,
                    }
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new { success = false, message = "Error: " + ex.Message });
            }
        }
    }
}