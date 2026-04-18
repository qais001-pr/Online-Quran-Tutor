using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace webapi.Controllers.Profile
{
    public interface IProfileController
    {
        HttpRequestMessage UpdateProfilePicture(int UserId);
    }
    public class ProfileController : ApiController
    {
        private readonly onlineQuranTutorEntities4 db = new onlineQuranTutorEntities4();
        public HttpResponseMessage UpdateProfilePicture(int UserId, string oldPath)
        {
            var request = HttpContext.Current.Request;
            var user = db.Users.Where(u => u.userID == UserId).FirstOrDefault();
            if (user == null)
                return Request.CreateResponse(HttpStatusCode.NotFound, "User not found");

            if (!string.IsNullOrEmpty(oldPath))
            {
                var oldPhysical = HttpContext.Current.Server.MapPath(oldPath);
                if (File.Exists(oldPhysical))
                    File.Delete(oldPhysical);
            }

            var postedFile = request.Files["updatedProfilePicture"];
            string imagePath = null;

            if (postedFile != null && postedFile.ContentLength > 0)
            {
                string extension = Path.GetExtension(postedFile.FileName);
                string fileName = postedFile.FileName.ToString();
                string folderPath = HttpContext.Current.Server.MapPath("~/Images/");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                imagePath = Path.Combine(folderPath, user.email + fileName);
                postedFile.SaveAs(imagePath);
                user.profile = "/Images/" + user.email + fileName.ToString();
            }
            db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK,new { statusCode = HttpStatusCode.OK, message = "Image Updated Successfuly"});
        }
    }
}
