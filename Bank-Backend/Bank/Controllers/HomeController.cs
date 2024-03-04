using Bank.Data;
using Bank.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Bank.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class HomeController : ControllerBase
    {
        private readonly BankDBContext context;
        private readonly string connectionString; 

        public HomeController(BankDBContext _context, IConfiguration _config)
        {
            context = _context; 
            connectionString = _config.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public async Task<bool> DBInit()
        { 
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var result = await connection.QuerySingleOrDefaultAsync<int>("uspBankInit", commandType: CommandType.StoredProcedure);
                return result == 1;
            } 
        }

        [HttpGet("{2}/{20}")]
        public async Task<UserResult> GetUsers(
            int? page,
            int? limit)
        {
            var connection = new SqlConnection(connectionString);
            using var multi = await connection.QueryMultipleAsync(
                "uspGetUsers",
                new { page, limit },
                commandType: CommandType.StoredProcedure
            );
            var users = await multi.ReadAsync<User>();
            var paginationData = await multi.ReadFirstAsync<PaginationData>();
            return new UserResult { Users = users, PaginationData = paginationData };
        }

        [HttpGet]
        public async Task<List<UserViewModel>> GetInit() 
        {    
            List<UserViewModel> results;

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = @"SELECT t.*, u.*, p.*
                                FROM TimeLogs t
                                LEFT JOIN Users u ON t.UserId = u.Id
                                LEFT JOIN Projects p ON t.ProjectId = p.Id;";

                results = connection.Query<TimeLog, User, Project, UserViewModel>(query,
                    (t, u, p) => new UserViewModel
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Sirname = u.Sirname,
                        Email = u.Email,
                        Project = p.Name,
                        Created = t.Created
                    }
                    ).ToList();
                return results;
            } 
        }

        [HttpGet]
        public async Task<List<GoogleChartBarViewModel>> GetTopTenUsers()
        { 
            List<GoogleChartBarViewModel> results;

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = @"SELECT Top(10) t.*, u.*
                                FROM TimeLogs t
                                LEFT JOIN Users u ON t.UserId = u.Id ORDER BY t.Hours DESC";

                results = connection.Query<TimeLog, User, GoogleChartBarViewModel>(query,
                    (t, u) => new GoogleChartBarViewModel
                    {
                        Name = u.Name,
                        Sirname = u.Sirname,  
                        Value = t.Hours
                    }
                    ).ToList();
                return results;
            }

        } 

        [HttpGet("{id}")] 
        public async Task<List<UserHoursViewModel>> GetUserHours(int id)
        { 
            List<UserHoursViewModel> results;

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();  
                var parameters = new DynamicParameters();
                parameters.Add("@Id", id, System.Data.DbType.Int32);
                var query = @"SELECT t.*, u.*
                                FROM TimeLogs t
                                LEFT JOIN Users u ON t.UserId = u.Id WHERE u.Id = @Id ORDER BY t.Hours DESC"; 

                results = connection.Query<TimeLog, User, UserHoursViewModel>(query, 
                    (t, u) => new UserHoursViewModel
                    {
                        Name = u.Name,
                        Hours = t.Hours
                    },
                    parameters 
                    ).ToList();
                return results;
            }
        } 
    }
}
