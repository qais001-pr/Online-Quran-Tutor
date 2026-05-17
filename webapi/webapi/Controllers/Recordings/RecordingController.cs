using System;
using System.IO;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace webapi.Controllers.Recordings
{
    public class RecordingController : ApiController
    {
        onlineQuranTutorEntities4 _Context = new onlineQuranTutorEntities4();
        [HttpPost]
        public HttpResponseMessage UploadRecording()
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    return Request.CreateResponse();
                }

                var httpRequest = HttpContext.Current.Request;

                var file = httpRequest.Files["file"];

                if (file == null || file.ContentLength == 0)
                {
                    return Request.CreateResponse();
                }
                var classId = httpRequest.Form["classId"];
                var slotId = httpRequest.Form["slotId"];
                var uploadPath = HttpContext.Current.Server.MapPath("~/Recordings");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }
                var fileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                var fullPath = Path.Combine(uploadPath, fileName);
                file.SaveAs(fullPath);
                var fileUrl = "/Recordings/" + fileName;
                _Context.Recordings.Add(new Recording
                {
                    FilePath = fileUrl,
                    ClassId = classId,
                    SlotId = int.Parse(slotId)
                });
                _Context.SaveChanges();
                return Request.CreateResponse(System.Net.HttpStatusCode.OK, new
                {
                    message = "Uploaded Successfully",
                    url = fileUrl
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(System.Net.HttpStatusCode.InternalServerError,ex);
            }
        }
    }
}
