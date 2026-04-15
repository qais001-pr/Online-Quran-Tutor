using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace webapi.Controllers.Dashboard
{
    public interface IStudentController
    {
        HttpResponseMessage getDataofStudent(int Student);
    }
    public class StudentDashboardController : ApiController
    {
        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
        [HttpGet]
        public HttpResponseMessage GetDataOfStudent(int studentId)
        {
            try
            {
                // Validate input
                if (studentId <= 0)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        success = false,
                        message = "Invalid student ID"
                    });
                }

                // Check if student exists
                var student = _context.Users.FirstOrDefault(u => u.userID == studentId);
                if (student == null)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, new
                    {
                        success = false,
                        message = "Student not found"
                    });
                }

                // Get class statistics
                var studentClasses = _context.TimeTables.Where(c => c.User.userID == studentId).ToList();

                var currentSurahs = (from c in _context.TimeTables
                                     join lp in _context.TimeTables on c.LessonPlan.lessonPlanID equals lp.LessonPlan.lessonPlanID
                                     join l in _context.Lessons on lp.LessonPlan.lessonPlanID equals l.LessonPlan.lessonPlanID
                                     where c.User.userID == studentId
                                     select new { surahID = l.surah.Id }).FirstOrDefault();

                var totalAyats = _context.Qurans.Where(q => q.surah.Id == currentSurahs.surahID).Count();

                var completedAyats = (from c in _context.TimeTables
                                  join lp in _context.LessonPlans on c.LessonPlan.lessonPlanID equals lp.lessonPlanID
                                  join Lesson in _context.Lessons on lp.lessonPlanID equals Lesson.LessonPlan.lessonPlanID
                                      where c.User.userID == studentId && c.Status.ToLower() == "completed"
                                  select Lesson.Quran.AyahText).Distinct().Count();
                // ✅ Count pending classes for those surahs
                var penClass = (from c in _context.TimeTables
                                join lp in _context.LessonPlans on c.LessonPlan.lessonPlanID equals lp.lessonPlanID
                                join l in _context.Lessons on lp.lessonPlanID equals l.LessonPlan.lessonPlanID
                                where c.User.userID == studentId && c.Status.ToLower() == "pending" && l.surah.Id == currentSurahs.surahID
                                select c.ClassID)
                                .Distinct()
                                .Count();

                var comClass = (from c in _context.TimeTables
                                join lp in _context.LessonPlans on c.LessonPlan.lessonPlanID equals lp.lessonPlanID
                                join l in _context.Lessons on lp.lessonPlanID equals l.LessonPlan.lessonPlanID
                                where c.User.userID == studentId && c.Status.ToLower() == "completed" && l.surah.Id == currentSurahs.surahID
                                select c.ClassID)
                                .Distinct()
                                .Count();

                var canClass = (from c in _context.TimeTables
                                join lp in _context.LessonPlans on c.LessonPlan.lessonPlanID equals lp.lessonPlanID
                                join l in _context.Lessons on lp.lessonPlanID equals l.LessonPlan.lessonPlanID
                                where c.User.userID == studentId && c.Status.ToLower() == "cancelled" && l.surah.Id == currentSurahs.surahID
                                select c.ClassID)
                                .Distinct()
                                .Count();
                var TotalClass = (from c in _context.TimeTables
                                  join lp in _context.LessonPlans on c.LessonPlan.lessonPlanID equals lp.lessonPlanID
                                  join l in _context.Lessons on lp.lessonPlanID equals l.LessonPlan.lessonPlanID
                                  where c.User.userID == studentId && l.surah.Id == currentSurahs.surahID
                                  select c.ClassID)
                               .Distinct()
                               .Count();
                var progress = TotalClass > 0 ? Math.Round((decimal)comClass / TotalClass * 100, 2) : 0;

                var upcomingClass = studentClasses
                    .Where(c => c.ClassDate > DateTime.Now && c.Status.ToLower() != "completed")
                    .OrderBy(c => c.ClassDate)
                    .Select(c => new
                    {
                        classId = c.ClassID,
                        scheduledDate = c.ClassDate.ToLongDateString(),
                        instructorName = c.User1.name,
                        instructorProfile = c.User1.profile,
                        instructorLocation = c.User1.country,
                        status = c.Status
                    })
                    .FirstOrDefault();
                var upcomingclassdata = (from lp in _context.LessonPlans
                                         join c in _context.TimeTables on lp.lessonPlanID equals c.LessonPlan.lessonPlanID
                                         join l in _context.Lessons on lp.lessonPlanID equals l.LessonPlan.lessonPlanID
                                         join sl in _context.Slots on c.Slot.slotID equals sl.slotID
                                         where c.ClassID == upcomingClass.classId
                                         select new
                                         {
                                             lp.lessonName,
                                             l.surah.surah_Urdu_Names,
                                             startTime = sl.startTime,
                                             endTime = sl.endTime,
                                         }).FirstOrDefault();
                // Build response object
                var responseData = new
                {
                    success = true,
                    data = new
                    {
                        classStatistics = new
                        {
                            totalClasses = TotalClass,
                            completedClasses = comClass,
                            pendingClasses = penClass,
                            cancelledClasses = canClass,
                            progressPercentage = progress
                        },
                        upcomingClasses = new
                        {
                            classs = upcomingClass,
                            data = upcomingclassdata,
                        },
                        surahAyat = new
                        {
                            totalAyats = totalAyats,
                            completedAyats = completedAyats
                        }
                    }
                };

                return Request.CreateResponse(HttpStatusCode.OK, responseData);
            }
            catch (Exception ex)
            {
                // Log exception (implement your logging here)
                System.Diagnostics.Debug.WriteLine($"Error in GetDataOfStudent: {ex.Message}");

                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                    success = false,
                    message = "An error occurred while retrieving student data",
                    error = ex.Message // Remove in production
                });
            }
        }
    }
}
