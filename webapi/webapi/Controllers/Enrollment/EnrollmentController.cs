using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Xml;

namespace webapi.Controllers.Enrollments
{
    public interface IEnrollments
    {
        DateTime GetClassDate(DateTime startDate, int weekIndex, int dayId);
        DateTime GetWeekStart(DateTime date);
        HttpResponseMessage AcceptRequestAndEnrolled(int requestID);
    }
    public class EnrollmentsController : ApiController
    {
        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
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
        public HttpResponseMessage AcceptRequestAndEnrolled(int requestID)
        {
            try
            {
                var request = _context.StudentTutorRequests
                    .Include("User")
                    .Include("User1")
                    .Include("Subject")
                    .Include("surah")
                    .FirstOrDefault(s => s.RequestID == requestID);

                if (request == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        message = "Invalid Request ID"
                    });
                }

                var startVerse = _context.Qurans
                    .FirstOrDefault(q => q.surah.Id == request.surah.Id);

                if (startVerse == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        message = "No verses found for this Surah"
                    });
                }
                var enrollment = new Enrollment
                {
                    User = request.User,
                    User1 = request.User1,
                    Subject = request.Subject,
                    surah = request.surah,
                    enrollment_status = "Active",
                    StudentTutorRequest = request,
                    currentayat = startVerse.VerseID
                };
                _context.Enrollments.Add(enrollment);
                request.status = "Accepted";
                _context.SaveChanges();

                var classLessonData = _context.Qurans
                    .Where(q => q.surah.Id == request.surah.Id && q.VerseID >= startVerse.VerseID)
                    .Select(q => new
                    {
                        q.VerseID,
                        q.AyahText
                    })
                    .Take(10)
                    .ToList();

                var lessonPlans = _context.Lessons
                    .Where(l => l.Subject.subjectID == request.Subject.subjectID && l.surah.Id == request.surah.Id)
                    .Select(l => new
                    {
                        l.LessonPlan.lessonPlanID,
                        l.LessonPlan.lessonName
                    })
                    .Distinct()
                    .OrderBy(l => l.lessonPlanID)
                    .ToList();

                var matchingSlots = (
                    from ts in _context.TutorSlots
                    join ss in _context.StudentSlots
                    on new { ts.Slot.slotID, ts.Day.dayID }
                    equals new { ss.Slot.slotID, ss.Day.dayID }
                    where ts.User.userID == request.User1.userID
                          && ss.User.userID == request.User.userID
                          && ts.status == "booked"
                          && ss.Status == "booked"
                          && ts.classStatus == "pending"
                    select new { ts.Day.dayID, ts.Slot.slotID }
                ).Distinct().OrderBy(s => s.dayID).ThenBy(s => s.slotID).ToList();

                if (matchingSlots.Count == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        message = "No matching slots found"
                    });
                }

                int slotsPerWeek = matchingSlots.Count;
                DateTime startDate = GetWeekStart(DateTime.Today);

                var totalVerses = _context.Qurans.Where(q => q.surah.Id == request.surah.Id).Max(q => q.VerseID);
                int currentStart = startVerse.VerseID;
                int ayahPerClass = 0;
                if (request.Subject.subjectID == 1)
                {
                    ayahPerClass = 10;
                }
                if (request.Subject.subjectID == 2)
                {
                    ayahPerClass = 15;
                }
                if (request.Subject.subjectID == 3)
                {
                    ayahPerClass = 20;
                }
                for (int i = 0; i < lessonPlans.Count; i++)
                {
                    int weekIndex = i / slotsPerWeek;
                    int slotIndex = i % slotsPerWeek;
                    var slot = matchingSlots[slotIndex];

                    DateTime classDate = GetClassDate(startDate, weekIndex, slot.dayID);

                    int endIndex = currentStart + ayahPerClass - 1;
                    if (endIndex > totalVerses)
                        endIndex = totalVerses;

                    var timetable = new TimeTable
                    {
                        Day = _context.Days.FirstOrDefault(d => d.dayID == slot.dayID),
                        Slot = _context.Slots.FirstOrDefault(s => s.slotID == slot.slotID),
                        ClassDate = classDate,
                        startIndex = currentStart,
                        endIndex = endIndex,
                        Status = "pending",
                        Corrections = "0",
                        Enrollment = _context.Enrollments.FirstOrDefault(e => e.StudentTutorRequest.RequestID == request.RequestID),
                    };
                    _context.TimeTables.Add(timetable);
                    currentStart = endIndex + 1;

                    if (currentStart > totalVerses)
                        break;
                }
                var rejectedRequests = _context.StudentTutorRequests
                    .Where(r => r.User1.userID == request.User1.userID
                             && r.surah.Id == request.surah.Id
                             && r.RequestID != requestID)
                    .Select(r => new
                    {
                        r.RequestID,
                        student = r.User.name
                    })
                    .ToList();
                _context.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    message = "Student Enrolled with this Teacher and Classes are created Successfully",
                    success = true,
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                    message = "Internal Error Server",
                    error = ex.Message
                });
            }
        }
    }
}