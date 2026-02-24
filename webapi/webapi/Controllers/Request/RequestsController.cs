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

            var user = _context.Users.FirstOrDefault(u => u.email == data.email);
            if (user == null || user.Subject == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest,
                    new { success = false, message = "User or subject not found." });
            }

            var student = _context.Users.FirstOrDefault(u => u.userID == data.studentId);
            var tutor = _context.Users.FirstOrDefault(u => u.userID == data.tutorId);
            var surah = _context.surahs.FirstOrDefault(s => s.Id == data.surahID);

            if (student == null || tutor == null || surah == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest,
                    new { success = false, message = "Invalid student, tutor, or surah." });
            }

            var newRequest = new StudentTutorRequest
            {
                User = student,
                User1 = tutor,
                Subject = user.Subject,
                surah = surah,
                status = "Pending"
            };

            //_context.StudentTutorRequests.Add(newRequest);
            //_context.SaveChanges();

            return Request.CreateResponse(HttpStatusCode.OK,
                new { success = true, message = "Request sent successfully.", newRequest });
        }
    }
}
