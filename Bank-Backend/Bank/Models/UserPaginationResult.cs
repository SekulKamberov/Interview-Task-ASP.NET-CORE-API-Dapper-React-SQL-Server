using Bank.Data;

namespace Bank.Models
{
    public class UserResult
    {
        public IEnumerable<User> Users { get; set; }
        public PaginationData PaginationData { get; set; }
    }
    public record PaginationData(int TotalRecords, int TotalPages);
}
