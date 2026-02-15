using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
namespace webapi.Controllers.Quran
{
    public class QuransController : ApiController
    {

        private readonly onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();

        [HttpGet]
        public HttpResponseMessage GetallJuz()
        {
            var juz = _context.Juzs.ToList().Select(s => new { s.Juz_ID, s.Arbabic_Start_Word,s });
            return Request.CreateResponse(HttpStatusCode.OK, juz);

        }
    }
}
