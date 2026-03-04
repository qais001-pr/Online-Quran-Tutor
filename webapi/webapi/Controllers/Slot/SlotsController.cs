using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TimeZoneConverter;
using webapi.Models.Slot;

namespace webapi.Controllers.Slot
{
    public interface ISlotsController
    {
        HttpResponseMessage GetSlotsWithDay(int userid);
        HttpResponseMessage UpdateStatusStudentsBooked(UpdateSlot data);
        HttpResponseMessage UpdateStatusStudentsAvailable(UpdateSlot data);
        HttpResponseMessage UpdateStatusTutor(UpdateSlot data);
    }
    public class SlotsController : ApiController, ISlotsController
    {
        onlineQuranTutorEntities4 db = new onlineQuranTutorEntities4();
        [HttpGet]
        [Route("api/slots/GetSlotsWithDay")]
        public HttpResponseMessage GetSlotsWithDay(int userid)
        {
            try
            {
                using (var db = new onlineQuranTutorEntities4())
                {
                    var user = db.Users
                        .Where(u => u.userID == userid)
                        .Select(u => new { u.userID, u.timezone, u.userType })
                        .FirstOrDefault();

                    if (user == null)
                        return Request.CreateResponse(HttpStatusCode.NotFound, "User not found");

                    TimeZoneInfo userTimeZone;
                    try
                    {
                        userTimeZone = TZConvert.GetTimeZoneInfo(user.timezone);
                    }
                    catch (Exception)
                    {
                        userTimeZone = TimeZoneInfo.Utc;
                    }

                    var days = db.Days.ToList();
                    var allSlots = db.Slots.ToList();
                    var existingBookings = new List<dynamic>();

                    if (user.userType == "Student" || user.userType == "Child")
                    {
                        existingBookings = db.StudentSlots
                            .Where(ss => ss.User.userID == userid)
                            .Select(ss => new { SlotID = ss.Slot.slotID, DayID = ss.Day.dayID, Status = ss.Status })
                            .ToList<dynamic>();
                    }
                    else
                    {
                        existingBookings = db.TutorSlots
                            .Where(ts => ts.User.userID == userid)
                            .Select(ts => new { SlotID = ts.Slot.slotID, DayID = ts.Day.dayID, Status = ts.status })
                            .ToList<dynamic>();
                    }

                    var response = new List<DaySlotsDto>();

                    foreach (var day in days)
                    {
                        var slotList = allSlots.Select(slot =>
                        {
                            DateTime today = DateTime.Today;
                            DateTime utcStart = DateTime.SpecifyKind(today.Add(slot.startTime), DateTimeKind.Utc);
                            DateTime utcEnd = DateTime.SpecifyKind(today.Add(slot.endTime), DateTimeKind.Utc);
                            DateTime localStart = TimeZoneInfo.ConvertTimeFromUtc(utcStart, userTimeZone);
                            DateTime localEnd = TimeZoneInfo.ConvertTimeFromUtc(utcEnd, userTimeZone);

                            var booking = existingBookings.FirstOrDefault(b => b.SlotID == slot.slotID && b.DayID == day.dayID);

                            return new SlotDto
                            {
                                DayID = day.dayID,
                                SlotID = slot.slotID,
                                StartTime = localStart.ToString("HH:mm"),
                                EndTime = localEnd.ToString("HH:mm"),
                                Status = booking?.Status,
                            };
                        })
                        .OrderBy(s => s.StartTime)
                        .ToList();

                        response.Add(new DaySlotsDto
                        {
                            DayID = day.dayID,
                            DayName = day.dayName,
                            Slots = slotList
                        });
                    }

                    return Request.CreateResponse(HttpStatusCode.OK, response);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("api/slots/bookedstudentslot")]
        public HttpResponseMessage UpdateStatusStudentsBooked(UpdateSlot data)
        {
            try
            {
                using (var db = new onlineQuranTutorEntities4())
                {
                    var Student = db.StudentSlots.Where(s => s.Slot.slotID == data.SlotId && s.Day.dayID == data.DayId && s.User.userID == data.UserId).FirstOrDefault();
                    Student.Status = "booked";
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Student slot statuses updated successfully.");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("api/slots/availablestudentslot")]
        public HttpResponseMessage UpdateStatusStudentsAvailable(UpdateSlot data)
        {
            try
            {
                using (var db = new onlineQuranTutorEntities4())
                {
                    var Student = db.StudentSlots.Where(s => s.Slot.slotID == data.SlotId && s.Day.dayID == data.DayId && s.User.userID == data.UserId).FirstOrDefault();
                    Student.Status = "available";
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Student slot statuses updated successfully.");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }




        [HttpPost]
        [Route("api/slots/UpdateStatusTutorBooked")]
        public HttpResponseMessage UpdateStatusTutor(UpdateSlot data)
        {
            try
            {
                using (var db = new onlineQuranTutorEntities4())
                {
                    var Student = db.TutorSlots.Where(s => s.Slot.slotID == data.SlotId && s.Day.dayID == data.DayId && s.User.userID == data.UserId).FirstOrDefault();
                    if (Student.status == "available")
                    {
                    Student.status = "booked";
                    }
                    else
                    {
                        Student.status = "available";
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Tutor slot updated successfully.");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [HttpPost]
        [Route("api/slots/UpdateStatusTutorAvailable")]
        public HttpResponseMessage UpdateStatusTutorAvailable(UpdateSlot data)
        {
            try
            {
                using (var db = new onlineQuranTutorEntities4())
                {
                    var Student = db.TutorSlots.Where(s => s.Slot.slotID == data.SlotId && s.Day.dayID == data.DayId && s.User.userID == data.UserId).FirstOrDefault();
                    Student.status = "available";
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Tutor slot updated successfully.");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

    }
}
