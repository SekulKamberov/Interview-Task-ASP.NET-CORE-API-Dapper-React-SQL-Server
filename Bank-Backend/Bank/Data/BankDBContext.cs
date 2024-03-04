namespace Bank.Data
{
    using Microsoft.EntityFrameworkCore;
    public class BankDBContext : DbContext
    {
        public BankDBContext(DbContextOptions<BankDBContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<TimeLog> TimeLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
