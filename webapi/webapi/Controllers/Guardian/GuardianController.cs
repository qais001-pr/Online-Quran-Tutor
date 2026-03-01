using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using webapi.Models.Guardian;
using webapi.Models.Tutor;

namespace webapi.Controllers.Guardian
{
    public interface IGuardianController
    {
        HttpResponseMessage addGuardian();
        HttpResponseMessage getChildren(int guardianId);
    }
    public class GuardianController : ApiController, IGuardianController
    {

        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
        [HttpPost]
        public HttpResponseMessage addGuardian()
        {
            try
            {
                var request = HttpContext.Current.Request;
                var jsonGuardian = request.Form["data"];
                if (string.IsNullOrEmpty(jsonGuardian))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new
                    {
                        success = false,
                        message = "Guardian data is required"
                    });
                }

                GuardianDTO guardian = JsonConvert.DeserializeObject<GuardianDTO>(jsonGuardian);
                if (string.IsNullOrEmpty(guardian.name.Trim()) ||
                    string.IsNullOrEmpty(guardian.email.Trim()) ||
                    string.IsNullOrEmpty(guardian.password.Trim()) ||
                    string.IsNullOrEmpty(guardian.gender.Trim()) ||
                    string.IsNullOrEmpty(guardian.dateOfBirth.ToString()) ||
                    string.IsNullOrEmpty(guardian.userType.Trim()) ||
                    string.IsNullOrEmpty(guardian.country.Trim()) ||
                    string.IsNullOrEmpty(guardian.city.Trim()) ||
                    string.IsNullOrEmpty(guardian.timezone.Trim()))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Guardian Data Invalid" });
                }
                var checkedEmail = _context.Users.Where(u => u.email == guardian.email).FirstOrDefault();
                if (checkedEmail != null)
                {
                    return Request.CreateResponse(HttpStatusCode.Conflict, new
                    {
                        success = false,
                        message = "Email already exists"
                    });
                }
                var postedFile = request.Files["image"];
                string imagePath = null;

                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    string extension = Path.GetExtension(postedFile.FileName);
                    string fileName = postedFile.FileName.ToString();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Images/");

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    imagePath = Path.Combine(folderPath, guardian.email + fileName);
                    postedFile.SaveAs(imagePath);
                    guardian.profile = "/Images/" + guardian.email + fileName.ToString();
                }

                _context.Users.Add(new User()
                {
                    name = guardian.name,
                    email = guardian.email,
                    password = guardian.password,
                    gender = guardian.gender,
                    dateOfBirth = guardian.dateOfBirth,
                    userType = guardian.userType,
                    country = guardian.country,
                    city = guardian.city,
                    timezone = guardian.timezone,
                    profile = guardian.profile,
                });
                _context.SaveChanges();
                guardian.userID = _context.Users.OrderByDescending(u => u.userID).FirstOrDefault().userID;
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    message = "Guardian added successfully!",
                    data = guardian
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
        public HttpResponseMessage getChildren(int guardianId)
        {
            var childrens = from user in _context.Users
                            join child in _context.children on user.userID equals child.User1.userID
                            join guardian in _context.Users on child.User.userID equals guardian.userID
                            where user.userID == guardianId
                            select new
                            {
                                child.childrenID,
                                child.User.name,
                                child.User.email,
                                child.User.profile,
                                child.User.dateOfBirth,
                            };
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                success = true,
                data = childrens
            });
        }
    }
}
