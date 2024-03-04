using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bank.Models
{
    public class GoogleChartBarViewModel
    { 
        [Column(TypeName = "decimal(18,4)")]
        public double Value { get; set; }
        public string Name { get; set; }
        public string Sirname { get; set; }
    }
}
