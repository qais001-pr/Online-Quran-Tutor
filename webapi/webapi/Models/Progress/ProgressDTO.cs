namespace webapi.Models.Progress
{
    public class ProgressDTO
    {
        public int ClassID { get; set; }
        public string corrections { get; set; }
        public string notes { get; set; }
        public int startAyat { get; set; }
        public int endAyat { get; set; }
    }
}