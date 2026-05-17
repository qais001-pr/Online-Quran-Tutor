using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using webapi.Models.Progress;

namespace webapi.Controllers.Progresses
{
    public class ProgressController : ApiController
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
        public HttpResponseMessage CompleteClass(ProgressDTO progress)
        {
            try
            {
                var currentClass = _context.TimeTables.Where(c => c.TimeTableid == progress.ClassID).FirstOrDefault();

                if (currentClass == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        message = "Class not found"
                    });
                }

                currentClass.Status = "completed";
                var enrollment = currentClass.Enrollment;
                var tutorid = enrollment.User1.userID;
                var slotid = currentClass.Slot.slotID;
                var dayid = currentClass.Day.dayID;
                var tutorSlot = _context.TutorSlots.Where(ts => ts.User.userID == tutorid
                                                                && ts.Slot.slotID == slotid
                                                                && ts.Day.dayID == dayid).FirstOrDefault();
                tutorSlot.classStatus = "pending";
                enrollment.currentayat = progress.endAyat;
                currentClass.Corrections = progress.corrections;
                var newProgress = new Progress
                {
                    TimeTable = currentClass,
                    endAyat = progress.endAyat,
                    startAyat = progress.startAyat,
                    notes = progress.notes,
                    badge = progress.badge,
                    score = progress.score,
                };
                _context.Progresses.Add(newProgress);
                _context.SaveChanges();
                if (enrollment == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        message = "Enrollment not found"
                    });
                }

                var pendingClasses = _context.TimeTables
                    .Where(c => c.Enrollment.enrollmentid == enrollment.enrollmentid
                             && c.Status == "pending")
                    .ToList();

                if (pendingClasses.Any())
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new
                    {
                        message = "Pending classes already exist",
                        pendingCount = pendingClasses.Count
                    });
                }

                var totalVerses = _context.Qurans
                    .Where(q => q.surah.Id == enrollment.surah.Id)
                    .Max(q => q.VerseID);

                int currentStart = currentClass.endIndex + 1;

                if (currentStart > totalVerses)
                {
                    enrollment.enrollment_status = "Completed";
                    _context.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, new
                    {
                        message = "All lessons completed"
                    });
                }

                var matchingSlots = (
                    from ts in _context.TutorSlots
                    join ss in _context.StudentSlots
                    on new { ts.Slot.slotID, ts.Day.dayID }
                    equals new { ss.Slot.slotID, ss.Day.dayID }
                    where ts.User.userID == enrollment.User1.userID
                          && ss.User.userID == enrollment.User.userID
                          && ts.status == "booked"
                          && ss.Status == "booked"
                          && ts.classStatus == "pending"
                    select new { ts.Day.dayID, ts.Slot.slotID }
                ).Distinct().ToList();

                if (!matchingSlots.Any())
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        message = "No available slots"
                    });
                }

                int slotsPerWeek = matchingSlots.Count;
                DateTime startDate = GetWeekStart(DateTime.Today);
                int ayahPerClass = enrollment.Subject.subjectID == 1 ? 10 :
                                   enrollment.Subject.subjectID == 2 ? 15 : 20;

                var newClasses = new List<object>();

                for (int i = 0; currentStart <= totalVerses; i++)
                {
                    int weekIndex = i / slotsPerWeek;
                    int slotIndex = i % slotsPerWeek;

                    var slot = matchingSlots[slotIndex];

                    DateTime classDate = GetClassDate(startDate, weekIndex, slot.dayID);

                    int endIndex = currentStart + ayahPerClass - 1;

                    if (endIndex > totalVerses)
                        endIndex = totalVerses;

                    var newClass = new TimeTable
                    {
                        Day = _context.Days.FirstOrDefault(d => d.dayID == slot.dayID),
                        Slot = _context.Slots.FirstOrDefault(s => s.slotID == slot.slotID),
                        ClassDate = classDate,
                        startIndex = currentStart,
                        endIndex = endIndex,
                        Status = "pending",
                        Corrections = "0",
                        Enrollment = enrollment
                    };

                    _context.TimeTables.Add(newClass);

                    newClasses.Add(new
                    {
                        dayID = slot.dayID,
                        slotID = slot.slotID,
                        classDate,
                        startIndex = currentStart,
                        endIndex
                    });

                    currentStart = endIndex + 1;
                }

                _context.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    message = "New classes generated successfully",
                    createdClasses = newClasses
                });
            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                    message = "Error while generating classes",
                    error = ex.Message
                });
            }
        }
    }
}
