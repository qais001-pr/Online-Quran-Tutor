using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TimeZoneConverter;
using System.Data.Entity; // Include for better LINQ support

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
                // 1. Basic Validation
                if (studentId <= 0)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { success = false, message = "Invalid student ID" });
                }

                var student = _context.Users.FirstOrDefault(u => u.userID == studentId);
                if (student == null)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, new { success = false, message = "Student not found" });
                }

                // 2. Current Surah/Lesson Logic
                // Hum wo latest lesson utha rahe hain jo pending ya completed ho
                var currentSurahData = (from c in _context.TimeTables
                                        where c.Enrollment.User.userID == studentId && (c.Status == "pending" || c.Status == "completed")
                                        orderby c.ClassDate descending
                                        select new { surahID = c.Enrollment.surah.Id, surahName = c.Enrollment.surah.surah_Urdu_Names }).FirstOrDefault();

                if (currentSurahData == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { success = true, message = "No classes found for this student", data = (object)null });
                }

                // 3. Class Statistics (Optimization: Ek hi baar filter karke counts lein)
                var studentClassesInSurah = (from c in _context.TimeTables
                                             where c.Enrollment.User.userID == studentId && c.Enrollment.surah.Id == currentSurahData.surahID
                                             select new { c.TimeTableid, c.Status }).Distinct().ToList();

                int totalClass = studentClassesInSurah.Count;
                int comClass = studentClassesInSurah.Count(x => x.Status.ToLower() == "completed");
                int penClass = studentClassesInSurah.Count(x => x.Status.ToLower() == "pending");
                int canClass = studentClassesInSurah.Count(x => x.Status.ToLower() == "cancelled");

                // Progress Calculation
                decimal progress = totalClass > 0 ? Math.Round((decimal)comClass / totalClass * 100, 2) : 0;

                // 4. Ayat Progress
                var totalAyats = _context.Qurans.Count(q => q.surah.Id == currentSurahData.surahID);
                var completedAyats = (from c in _context.TimeTables
                                          //join lp in _context.LessonPlans on c.LessonPlan.lessonPlanID equals lp.lessonPlanID
                                          //join l in _context.Lessons on lp.lessonPlanID equals l.LessonPlan.lessonPlanID
                                      join q in _context.Qurans on c.Enrollment.surah.Id equals q.surah.Id
                                      where c.Enrollment.User.userID == studentId && c.Status.ToLower() == "completed" && c.Enrollment.surah.Id == currentSurahData.surahID
                                      select new { q.ID, q.AyahText }).Distinct().Count();

                // 5. TimeZone & Upcoming Class Logic
                TimeZoneInfo userTimeZone;
                try { userTimeZone = TZConvert.GetTimeZoneInfo(student.timezone ?? "UTC"); }
                catch { userTimeZone = TimeZoneInfo.Utc; }

                DateTime nowInUserZone = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, userTimeZone);

                var upcomingClassRaw = _context.TimeTables
                    .Where(c => c.Enrollment.User.userID == studentId && c.Status.ToLower() != "completed")
                    .OrderBy(c => c.ClassDate)
                    .ThenBy(c => c.Slot.startTime)
                    .ToList()
                    .FirstOrDefault(c =>
                    {
                        DateTime classEndUtc = c.ClassDate.Date.Add(c.Slot.endTime);
                        DateTime classEndInUserZone = TimeZoneInfo.ConvertTimeFromUtc(classEndUtc, userTimeZone);
                        return classEndInUserZone >= nowInUserZone;
                    });

                object formattedUpcomingClass = null;
                if (upcomingClassRaw != null)
                {
                    formattedUpcomingClass = new
                    {
                        classId = upcomingClassRaw.TimeTableid,
                        lessonName = upcomingClassRaw.Enrollment.surah.surah_Urdu_Names,
                        surahName = currentSurahData.surahName,
                        scheduledDate = upcomingClassRaw.ClassDate.ToString("yyyy-MM-dd"),
                        startTime = upcomingClassRaw.Slot.startTime.ToString(),
                        endTime = upcomingClassRaw.Slot.endTime.ToString(),
                        instructorName = upcomingClassRaw.Enrollment.User1.userID,
                        instructorProfile = upcomingClassRaw.Enrollment.User1.profile,
                        status = upcomingClassRaw.Status
                    };
                }

                // 6. Final Response
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    data = new
                    {
                        currentSurah = currentSurahData.surahName,
                        classStatistics = new
                        {
                            totalClasses = totalClass,
                            completedClasses = comClass,
                            pendingClasses = penClass,
                            cancelledClasses = canClass,
                            progressPercentage = progress
                        },
                        surahAyat = new
                        {
                            totalAyats = totalAyats,
                            completedAyats = completedAyats,
                            ayatProgress = totalAyats > 0 ? Math.Round((decimal)completedAyats / totalAyats * 100, 2) : 0
                        },
                        upcomingClass = formattedUpcomingClass
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