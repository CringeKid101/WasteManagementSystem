using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WasteManagementSystem.API.Models;

namespace WasteManagementSystem.API.Data
{
    public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Event> Events { get; set; }
        public DbSet<WasteReport> WasteReports { get; set; }
        public DbSet<EventAttendance> EventAttendances { get; set; }
        public DbSet<OrganizerRequest> OrganizerRequests { get; set; }
        public DbSet<PasswordResetOtp> PasswordResetOtps { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder
                .Entity<WasteReport>()
                .HasOne(w => w.User)
                .WithMany(u => u.WasteReports)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<WasteReport>()
                .HasOne(w => w.ApprovedBy)
                .WithMany()
                .HasForeignKey(w => w.ApprovedById)
                .OnDelete(DeleteBehavior.Restrict);
            builder
                .Entity<WasteReport>()
                .HasOne(w => w.Event)
                .WithMany(e => e.WasteReports)
                .HasForeignKey(w => w.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<EventAttendance>()
                .HasOne(ea => ea.Event)
                .WithMany(e => e.Attendances)
                .HasForeignKey(ea => ea.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<EventAttendance>()
                .HasOne(ea => ea.User)
                .WithMany(u => u.EventAttendances)
                .HasForeignKey(ea => ea.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<OrganizerRequest>()
                .HasOne(or => or.User)
                .WithMany(u => u.OrganizerRequests)
                .HasForeignKey(or => or.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .Entity<OrganizerRequest>()
                .HasOne(or => or.ReviewedByAdmin)
                .WithMany()
                .HasForeignKey(or => or.ReviewedByAdminId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
            builder.Entity<Event>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<WasteReport>().HasQueryFilter(w => !w.IsDeleted);
            builder.Entity<OrganizerRequest>().HasQueryFilter(o => !o.IsDeleted);
            builder.Entity<EventAttendance>().HasQueryFilter(ea => !ea.Event.IsDeleted);
        }
    }
}
