namespace Bank.Data
{
    public class TimeLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public DateTime Created { get; set; }
        public double Hours { get; set; } 
    }
}
