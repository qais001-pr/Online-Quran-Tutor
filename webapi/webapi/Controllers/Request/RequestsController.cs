using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using webapi.Models.Request;

namespace webapi.Controllers.Request
{
    public interface IRequestsController
    {
        HttpResponseMessage requestToTutor(RequestDTO data);
    }

    public class RequestsController : ApiController, IRequestsController
    {
        private readonly onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();

        [HttpPost]
        public HttpResponseMessage requestToTutor(RequestDTO data)
        {
            if (data == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest,
                    new { success = false, message = "Invalid request data." });
            }

            var user = _context.Users.Where(u => u.email == data.email).FirstOrDefault();

            var checkRequest = _context.StudentTutorRequests.Where(r => r.User.userID == data.studentId && r.User1.userID == data.tutorId && r.surah.Id == data.surahID && r.status == "pending").FirstOrDefault();
            if (checkRequest != null)
            {
                return Request.CreateResponse(HttpStatusCode.Conflict,
                new { success = false, message = "Request Already Sent to this Tutor" });
            }
            if (user == null || user.Subject == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest,
                    new { success = false, message = "User or subject not found." });
            }

            var SubjectID = user.Subject.subjectID;
            var newRequest = new StudentTutorRequest
            {
                User = _context.Users.Where(u => u.userID == data.studentId).FirstOrDefault(),
                User1 = _context.Users.Where(u => u.userID == data.tutorId).FirstOrDefault(),
                Subject = _context.Subjects.Where(s => s.subjectID == SubjectID).FirstOrDefault(),
                surah = _context.surahs.Where(s => s.Id == data.surahID).FirstOrDefault(),
                status = "pending"
            };

            _context.StudentTutorRequests.Add(newRequest);
            _context.SaveChanges();

            return Request.CreateResponse(HttpStatusCode.OK,
                new { success = true, message = "Request sent successfully." });
        }
    }
}
