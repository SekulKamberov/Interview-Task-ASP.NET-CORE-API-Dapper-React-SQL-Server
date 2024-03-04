using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bank.Models
{
    public class UserHoursViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [Column(TypeName = "decimal(18,4)")]
        public double Hours { get; set; }
    }
}
