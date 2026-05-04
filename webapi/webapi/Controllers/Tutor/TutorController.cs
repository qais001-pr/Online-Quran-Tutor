using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using webapi.Models.Tutor;

namespace webapi.Controllers.Tutor
{

    public interface ITutorController
    {
        HttpResponseMessage addTutor();
        HttpResponseMessage addTutorSlots(TutorSlots tutorSlot);
        HttpResponseMessage removeTutorSlots(TutorSlots tutorSlot);
        IHttpActionResult getRequests(int tutorID);
        HttpResponseMessage getHistoryData(int userID);
    }


    public class TutorController : ApiController
    {
        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
        [HttpPost]
        public HttpResponseMessage addTutor()
        {
            try
            {
                var request = HttpContext.Current.Request;
                var jsonTutor = request.Form["tutor"];
                if (string.IsNullOrEmpty(jsonTutor))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        success = false,
                        message = "Tutor data is required"
                    });
                }

                TutorDTO tutor = JsonConvert.DeserializeObject<TutorDTO>(jsonTutor);
                if (string.IsNullOrEmpty(tutor.name.Trim()) ||
                    string.IsNullOrEmpty(tutor.email.Trim()) ||
                    string.IsNullOrEmpty(tutor.password.Trim()) ||
                    string.IsNullOrEmpty(tutor.gender.Trim()) ||
                    string.IsNullOrEmpty(tutor.dateOfBirth.ToString()) ||
                    string.IsNullOrEmpty(tutor.userType.Trim()) ||
                    string.IsNullOrEmpty(tutor.country.Trim()) ||
                    string.IsNullOrEmpty(tutor.city.Trim()) ||
                    string.IsNullOrEmpty(tutor.timezone.Trim()) ||
                    tutor.subjectList == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Tutor Data Invalid" });
                }

                var checkTutor = _context.Users.Where(u => u.email.ToLower() == tutor.email.ToLower()).FirstOrDefault();
                if (checkTutor != null)
                {
                    return Request.CreateResponse(HttpStatusCode.Conflict, new
                    {
                        success = false,
                        message = "Email Already Exists"
                    });
                }
                var postedFile = request.Files["tutorImage"];
                string imagePath = null;

                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    string extension = Path.GetExtension(postedFile.FileName);
                    string fileName = postedFile.FileName.ToString();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Images/");

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    imagePath = Path.Combine(folderPath, tutor.email + fileName);
                    postedFile.SaveAs(imagePath);
                    tutor.profile = "/Images/" + tutor.email + fileName.ToString();
                }

                _context.Users.Add(new User()
                {
                    name = tutor.name,
                    email = tutor.email,
                    password = tutor.password,
                    gender = tutor.gender,
                    dateOfBirth = tutor.dateOfBirth,
                    userType = tutor.userType,
                    country = tutor.country,
                    city = tutor.city,
                    timezone = tutor.timezone,
                    profile = tutor.profile,
                });
                _context.SaveChanges();

                foreach (var item in tutor.subjectList)
                {
                    _context.TutorSubjects.Add(new TutorSubject()
                    {
                        Subject = _context.Subjects.Where(s => s.subjectName == item.name).FirstOrDefault(),
                        User = _context.Users.Where(u => u.email.ToLower() == tutor.email.ToLower()).FirstOrDefault(),
                    });
                }
                _context.SaveChanges();
                tutor.userID = _context.Users.Where(u => u.email.ToLower() == tutor.email.ToLower()).FirstOrDefault().userID;
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    message = "Tutor added successfully!",
                    data = tutor
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                    success = false,
                    message = "Something went wrong",
                    error = ex.Message
                });
            }
        }



        [HttpPost]
        public HttpResponseMessage addTutorSlots(TutorSlots tutorSlot)
        {
            if (tutorSlot == null)
            {
                return Request.CreateResponse();
            }
            _context.TutorSlots.Add(new TutorSlot()
            {
                Day = _context.Days.Where(d => d.dayID == tutorSlot.dayid).FirstOrDefault(),
                Slot = _context.Slots.Where(s => s.slotID == tutorSlot.slotid).FirstOrDefault(),
                User = _context.Users.Where(u => u.userID == tutorSlot.tutorid).FirstOrDefault(),
                status = "available",
            });
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, new { message = "Slot Saved Successfully" });
        }

        [HttpDelete]
        public HttpResponseMessage removeTutorSlots(TutorSlots tutorSlot)
        {
            if (tutorSlot == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            var StudentSlots = _context.StudentSlots.Where(s => s.Slot.slotID == tutorSlot.slotid && s.Day.dayID == tutorSlot.dayid &&
            s.User.userID == tutorSlot.tutorid).FirstOrDefault();
            if (StudentSlots == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Invalid Request" });
            }

            _context.StudentSlots.Remove(StudentSlots);
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, new { message = "Slot Saved Successfully" });
        }

        [HttpGet]
        public IHttpActionResult getRequests(int tutorID)
        {
            if (tutorID <= 0)
                return BadRequest("Invalid tutor ID.");

            var requests = _context.StudentTutorRequests
      .Where(r => r.User1.userID == tutorID && r.status == "pending")
      .Select(r => new
      {
          r.RequestID,
          StudentID = r.User.userID,
          StudentName = r.User.name,
          StudentEmail = r.User.email,
          SubjectID = r.Subject.subjectID,
          SubjectName = r.Subject.subjectName,
          SurahID = r.surah.Id,
          SurahName = r.surah.surah_Urdu_Names,
          profileImage = r.User.profile,
          r.status
      })
      .ToList();

            var studentIds = requests.Select(r => r.StudentID).ToList();

            var slots = _context.StudentSlots
                .Where(s => studentIds.Contains(s.User.userID) && s.Status == "booked")
                .ToList();

            var result = requests.Select(r => new
            {
                r.RequestID,
                r.StudentID,
                r.StudentName,
                r.StudentEmail,
                r.SubjectID,
                r.SubjectName,
                r.profileImage,
                r.SurahID,
                r.SurahName,
                r.status,

                Schedule = slots
                    .Where(s => s.User.userID == r.StudentID)
                    .GroupBy(s => s.Day.dayName)
                    .Select(g => new
                    {
                        DayName = g.Key,
                        Slots = g.Select(x => new
                        {
                            x.Slot.slotID,
                            x.Slot.startTime,
                            x.Slot.endTime
                        }).ToList()
                    }).ToList()
            }).ToList();

            return Ok(new
            {
                success = true,
                message = "Requests retrieved successfully",
                data = result
            });
        }

        [HttpGet]
        public HttpResponseMessage getHistoryData(int userID)
        {
            var currentMonth = DateTime.Now.Month;
            var result = (
                from tt in _context.TimeTables
                where tt.Enrollment.User1.userID == userID && tt.Status == "completed" && tt.ClassDate.Month == currentMonth
                select new
                {
                    ClassID = tt.TimeTableid,
                    StudentID = tt.Enrollment.User.userID,
                    Subject = tt.Enrollment.User.Subject.subjectName,
                    StudentName = tt.Enrollment.User.name,
                    TutorName = tt.Enrollment.User1.name,
                    TutorImage = tt.Enrollment.User1.profile,
                    StudentImage = tt.Enrollment.User.profile,
                    ClassDate = tt.ClassDate,
                    SlotID = tt.Slot.slotID,
                    DayName = tt.Day.dayName,
                    DayID = tt.Day.dayID,
                    StartTime = tt.Slot.startTime,
                    EndTime = tt.Slot.endTime,
                    Status = tt.Status,
                    startAyat = (from p in _context.Progresses
                                 where p.TimeTable.TimeTableid == tt.TimeTableid
                                 select p.startAyat).FirstOrDefault(),
                    endAyat = (from p in _context.Progresses
                               where p.TimeTable.TimeTableid == tt.TimeTableid
                               select p.endAyat).FirstOrDefault(),
                    notes = (from p in _context.Progresses
                             where p.TimeTable.TimeTableid == tt.TimeTableid
                             select p.notes).FirstOrDefault(),
                    StudentFeedback = (from r in _context.Reviews
                                       where r.TimeTable.TimeTableid == tt.TimeTableid
                                       select r.Comment).FirstOrDefault(),
                    Rating = (from r in _context.Reviews
                              where r.TimeTable.TimeTableid == tt.TimeTableid
                              select r.Rating).FirstOrDefault(),
                })
                .ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                message = "History data retrieved successfully.",
                data = result,
                totalClasses = result.Count(),
            });
        }
    }
}
