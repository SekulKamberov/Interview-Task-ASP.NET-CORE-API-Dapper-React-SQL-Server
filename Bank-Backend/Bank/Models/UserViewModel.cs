namespace Bank.Models
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Sirname { get; set; }
        public string Email { get; set; }
        public string Project { get; set; }

        public double Hours { get; set; }
        public DateTime Created { get; set; }
    }
}
