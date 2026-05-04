using System.Linq;
using System.Net.Http;
using System.Web.Http;
using webapi.Models.Reviews;

namespace webapi.Controllers.Reviews
{
    public class ReviewsController : ApiController
    {
        onlineQuranTutorEntities4 _context = new onlineQuranTutorEntities4();
        [HttpPost]
        public HttpResponseMessage addReview(ReviewDTO review)
        {
            if (review == null)
            {
                return Request.CreateResponse(System.Net.HttpStatusCode.BadRequest, "Invalid Review Data");
            }
            Review re = new Review()
            {
                Comment = review.comment,
                Rating = review.Rating,
                CreatedAt = System.DateTime.Now,
                TimeTable = _context.TimeTables.Where(c => c.TimeTableid == review.classID).FirstOrDefault()
            };
            var classData = _context.TimeTables.Where(c => c.TimeTableid == review.classID).FirstOrDefault();
            classData.Status = "completed";
            _context.Reviews.Add(re);
            _context.SaveChanges();
            return Request.CreateResponse(System.Net.HttpStatusCode.OK, "Review Submit Successfully");
        }
    }
}