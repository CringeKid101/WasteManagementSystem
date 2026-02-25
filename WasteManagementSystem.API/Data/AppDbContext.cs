using Microsoft.EntityFrameworkCore;
using WasteManagementSystem.API.Models;

namespace WasteManagementSystem.API.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
    }
}
