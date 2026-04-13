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
            var juz = _context.Juzs.ToList().Select(s => new { s.Juz_ID, s.Arbabic_Start_Word });
            return Request.CreateResponse(HttpStatusCode.OK, juz);

        }

        [HttpGet]
        public HttpResponseMessage GetSurah()
        {
            var surah = _context.surahs.ToList().Select(s => new { s.Id, s.surah_names, s.surah_Urdu_Names });
            return Request.CreateResponse(HttpStatusCode.OK, surah);
        }

        [HttpGet]
        public HttpResponseMessage GetQuranAyatsFromJuzs(int Juzid)
        {
            var result = (from j in _context.Juzs
                          join s in _context.surahs on j.surah.Id equals s.Id
                          join q in _context.Qurans on s.Id equals q.surah.Id
                          where j.Juz_ID == Juzid
                          select new
                          {
                              q.ID,
                              q.VerseID,
                              q.AyahText
                          }
                         ).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpGet]
        public HttpResponseMessage getQuranAyatsFromSurahID(int surahsID)
        {
            var result = (from q in _context.Qurans
                          join s in _context.surahs on q.surah.Id equals s.Id
                          where s.Id == surahsID
                          select new
                          {
                              q.ID,
                              q.AyahText
                          }).ToList();
            return Request.CreateResponse(HttpStatusCode.OK,result);
        }
        [HttpGet]
        public HttpResponseMessage getQuranAyats()
        {
            var result = _context.Qurans.ToList().Select(s => new { s.ID, s.AyahText });
            return Request.CreateResponse(HttpStatusCode.OK,result);
        }
    }
}
