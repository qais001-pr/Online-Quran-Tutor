using System;
using System.Linq;
using System.Net.Http;
using System.Web.Http;

namespace webapi.Controllers.Dashboard
{
    public interface IDashboardController
    {
        HttpResponseMessage getTutorUpcomingClass(int UserId);
    }
    public class DashboardController : ApiController, IDashboardController
    {
        onlineQuranTutorEntities4 context = new onlineQuranTutorEntities4();
        [HttpGet]
        public HttpResponseMessage getTutorUpcomingClass(int UserId)
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var result = context.Classes
                .Where(c => c.ClassDate >= today
                         && c.ClassDate < tomorrow
                         && c.Status == "Pending"
                         && c.User1.userID == UserId)
                .OrderBy(c => c.ClassDate)
                .Select(c => new
                {
                    Student = new
                    {
                        c.User.userID,
                        c.User.name,
                        c.User.profile,
                        c.User.Subject.subjectName,
                        c.User.country
                    },
                    Slot = new
                    {
                        c.Slot.slotID,
                        c.Slot.startTime,
                        c.Slot.endTime
                    },
                    Day = new
                    {
                        c.Day.dayID,
                        c.Day.dayName
                    }
                })
                .Take(1)
                .ToList();
            return Request.CreateResponse(System.Net.HttpStatusCode.OK, result);
        }
    }
}
