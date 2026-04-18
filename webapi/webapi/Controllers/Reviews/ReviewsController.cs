using System.Linq;
using System.Net;
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
                TimeTable = _context.TimeTables.Where(c => c.ClassID == review.classID).FirstOrDefault()
            };
            var classData = _context.TimeTables.Where(c => c.ClassID == review.classID).FirstOrDefault();
            classData.Status = "completed";
            int slotID = classData.Slot.slotID;
            int dayID = classData.Day.dayID;
            var turorID = classData.User1.userID;
            var tutorSlot = _context.TutorSlots.Where(c => c.Slot.slotID == slotID && c.Day.dayID == dayID && c.User.userID == turorID).FirstOrDefault();
            if (tutorSlot == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "TutorSlot not found");
            }

            tutorSlot.classStatus = "pending";
            _context.Reviews.Add(re);
            _context.SaveChanges();
            return Request.CreateResponse(System.Net.HttpStatusCode.OK, new { slotID, dayID });
        }
    }

}
