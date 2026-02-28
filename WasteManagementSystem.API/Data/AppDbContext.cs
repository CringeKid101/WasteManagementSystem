using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WasteManagementSystem.API.Models;

namespace WasteManagementSystem.API.Data
{
    public class AppDbContext: IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<WasteReport> WasteReports { get; set; }
        public DbSet<EventAttendance> EventAttendances { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<WasteReport>()
                .HasOne(w => w.User)
                .WithMany(u => u.WasteReports)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<WasteReport>()
                .HasOne(w => w.ApprovedBy)
                .WithMany()
                .HasForeignKey(w => w.ApprovedById)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<EventAttendance>()
                .HasOne(ea => ea.Event)
                .WithMany(e => e.Attendances)
                .HasForeignKey(ea => ea.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<EventAttendance>()
                .HasOne(ea => ea.User)
                .WithMany(u => u.EventAttendances)
                .HasForeignKey(ea => ea.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrganizerRequest>()
                .HasOne(or => or.User)
                .WithMany(u => u.OrganizerRequests)
                .HasForeignKey(ea => ea.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<OrganizerRequest>()
                .HasOne(or => or.ReviewedByAdmin)
                .WithMany()
                .HasForeignKey(ea => ea.ReviewedByAdminId)
                .OnDelete(DeleteBehavior.NoAction);
        }

    }
}
