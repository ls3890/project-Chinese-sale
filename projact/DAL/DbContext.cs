using Microsoft.EntityFrameworkCore;
using projact.models;

namespace projact.DAL
{
    public class ProjectDbContext : DbContext
    {
        public ProjectDbContext(DbContextOptions<ProjectDbContext> options)
            : base(options)
        {
        }

        public DbSet<Gift> Gifts { get; set; }
        public DbSet<Purchases> Purchases { get; set; }
        public DbSet<User> Customers { get; set; }
        public DbSet<Donator> Donators { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Gift>()
                .HasOne(g => g.Donator)
                .WithMany(d => d.Gifts)
                .HasForeignKey(g => g.DonatorId);

            modelBuilder.Entity<Purchases>()
                .HasOne(p => p.Customer)
                .WithMany(c => c.Purchases)
                .HasForeignKey(p => p.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Purchases>()
                .HasOne(p => p.Gift)
                .WithMany(g => g.Purchases)
                .HasForeignKey(p => p.GiftId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
