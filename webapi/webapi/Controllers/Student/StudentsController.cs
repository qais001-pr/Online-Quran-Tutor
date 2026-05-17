using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using webapi.Models.Student;

namespace webapi.Controllers.Student
{
    public interface IStudentsController
    {
        HttpResponseMessage addStudent();
        HttpResponseMessage getAvailableTutorByStudentID(int studentID);
        HttpResponseMessage getTutorData(int userID);

        HttpResponseMessage getHistoryData(int userID);


    }

    public class StudentsController : ApiController
    {

        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
        [HttpPost]
        public HttpResponseMessage addStudent()
        {
            try
            {
                var request = HttpContext.Current.Request;
                var jsonChild = request.Form["data"];
                if (string.IsNullOrEmpty(jsonChild))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        success = false,
                        message = "Student data is required"
                    });
                }

                StudentDTO child = JsonConvert.DeserializeObject<StudentDTO>(jsonChild);
                var postedFile = request.Files["image"];
                string imagePath = null;


                var checkedEmail = _context.Users.Where(u => u.email == child.email).FirstOrDefault();
                if (checkedEmail != null)
                {
                    return Request.CreateResponse(HttpStatusCode.Conflict, new
                    {
                        success = false,
                        message = "Email already exists"
                    });
                }

                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    string extension = Path.GetExtension(postedFile.FileName);
                    string fileName = postedFile.FileName.ToString();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Images/");

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    imagePath = Path.Combine(folderPath, child.email + fileName);
                    postedFile.SaveAs(imagePath);
                    child.profile = "/Images/" + child.email + fileName.ToString();
                }

                _context.Users.Add(new User()
                {
                    name = child.name,
                    email = child.email,
                    password = child.password,
                    gender = child.gender,
                    dateOfBirth = child.dateOfBirth,
                    userType = child.userType,
                    country = child.country,
                    city = child.city,
                    timezone = child.timezone,
                    preferred_tutor = child.preferred_tutor,
                    profile = child.profile,
                    Subject = _context.Subjects.Where(s => s.subjectName == child.subject).FirstOrDefault(),
                });
                _context.SaveChanges();
                child.userID = _context.Users.OrderByDescending(u => u.userID).FirstOrDefault().userID;
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    message = "Student added successfully!",
                    data = child
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

        [HttpGet]
        public HttpResponseMessage getAvailableTutorByStudentID(int studentID)
        {
            if (studentID <= 0)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest,
                    new { success = false, message = "Invalid student ID." });
            }

            // Get student info (subject + gender preference)
            var student = _context.Users
                .Where(u => u.userID == studentID)
                .Select(s => new
                {
                    subjectID = s.Subject.subjectID,
                    preferredGender = s.preferred_tutor
                })
                .FirstOrDefault();

            if (student == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound,
                    new { success = false, message = "Student not found." });
            }

            var genderPref = (student.preferredGender ?? "").Trim().ToLower();

            // Total booked slots of student
            var studentSlotCount = _context.StudentSlots
                .Count(ss => ss.User.userID == studentID && ss.Status == "booked");

            // Tutors matching ALL slots + subject + gender
            var tutors = (
                from ts in _context.TutorSlots
                join ss in _context.StudentSlots
                    on new { ts.Slot.slotID, ts.Day.dayID }
                    equals new { ss.Slot.slotID, ss.Day.dayID }
                join u in _context.Users
                    on ts.User.userID equals u.userID
                where ss.User.userID == studentID
                      && ts.classStatus == "pending"
                      && ss.Status == "booked"
                      && ts.status == "booked"

                      // ✅ Gender filter
                      && (
                            genderPref == "male" ? u.gender.ToLower() == "male" :
                            genderPref == "female" ? u.gender.ToLower() == "female" :
                            true
                         )

                      // ✅ Subject filter
                      && _context.TutorSubjects.Any(tsub =>
                             tsub.User.userID == u.userID &&
                             tsub.Subject.subjectID == student.subjectID
                         )

                group u by new
                {
                    u.userID,
                    u.name,
                    u.email,
                    u.profile,
                    u.about,
                    u.city,
                    u.country
                } into g

                //let matchedSlotCount = g.Count()

                // ✅ Must match ALL booked slots
                //where matchedSlotCount == studentSlotCount

                select g.Key
            ).ToList();

            var res = tutors.Select(u => new
            {
                u.userID,
                u.name,
                u.email,
                u.profile,
                u.about,
                u.city,
                u.country,
                rating = _context.TimeTables
        .Where(c => c.Enrollment.User1.userID == u.userID)
        .Join(_context.Reviews, c => c.TimeTableid, r => r.TimeTable.TimeTableid, (c, r) => r.Rating)
        .Average(rating => (double?)rating) ?? 0.0,
                totalRatings = _context.TimeTables
        .Where(c => c.Enrollment.User1.userID == u.userID)
        .Join(_context.Reviews, c => c.TimeTableid, r => r.TimeTable.TimeTableid,
              (c, r) => r)
        .Count(),
                subjects = _context.TutorSubjects
                    .Where(s => s.User.userID == u.userID)
                    .Select(s => new
                    {
                        s.Subject.subjectID,
                        s.Subject.subjectName
                    }).ToList(),
            }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, res);

        }
        [HttpGet]
        public HttpResponseMessage GetTutorData(int userID)
        {
            if (userID <= 0)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new
                {
                    success = false,
                    message = "Invalid user ID."
                });
            }

            var tutorData = _context.Users
                .Where(u => u.userID == userID)
                .Select(t => new
                {
                    t.userID,
                    t.name,
                    t.gender,
                    t.dateOfBirth,
                    t.country,
                    t.city,
                    t.timezone,
                    t.profile,
                    t.about,
                    TutorSubjects = t.TutorSubjects
                })
                .FirstOrDefault();

            if (tutorData == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, new
                {
                    success = false,
                    message = "Tutor not found."
                });
            }
            var result = new
            {
                tutorData.userID,
                tutorData.name,
                tutorData.gender,
                tutorData.dateOfBirth,
                tutorData.country,
                tutorData.city,
                tutorData.timezone,
                tutorData.profile,
                tutorData.about,
                Subjects = tutorData.TutorSubjects
                    .Select(ts => new
                    {
                        ts.Subject.subjectID,
                        ts.Subject.subjectName
                    })
                    .ToList()
            };

            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                tutor = result
            });
        }


        [HttpGet]
        public HttpResponseMessage getHistoryData(int userID)
        {
            var currentMonth = DateTime.Now.Month;

            var Scores = (from e in _context.Enrollments
                                join t in _context.TimeTables on e.enrollmentid equals t.Enrollment.enrollmentid
                                join p in _context.Progresses on t.TimeTableid equals p.TimeTable.TimeTableid
                                where e.User.userID == userID && t.Status == "completed"
                                select p.score).ToList();
            var average = Scores.Average();

            var result = (
                from tt in _context.TimeTables
                where tt.Enrollment.User.userID == userID && tt.Status == "completed" && tt.ClassDate.Month == currentMonth
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
                    badge = (from r in _context.Progresses
                             where r.TimeTable.TimeTableid == tt.TimeTableid
                             select r.badge).FirstOrDefault(),
                    Score = (from r in _context.Progresses
                             where r.TimeTable.TimeTableid == tt.TimeTableid
                             select r.score).FirstOrDefault(),
                })
                .ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                message = "History data retrieved successfully.",
                data = result,
                avaerageScore = average,
                totalClasses = result.Count(),
            });
        }
    }
}