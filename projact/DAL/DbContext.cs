using Microsoft.EntityFrameworkCore;
using projact.models;
using System;

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

            // קשר: תורם → מתנות
            modelBuilder.Entity<Gift>()
                .HasOne(g => g.Donator)
                .WithMany(d => d.Gifts)
                .HasForeignKey(g => g.DonatorId);

            // קשר: רכישה → לקוח
            modelBuilder.Entity<Purchases>()
                .HasOne(p => p.Customer)
                .WithMany(c => c.Purchases)
                .HasForeignKey(p => p.CustomerId);

            // קשר: רכישה → מתנה
            modelBuilder.Entity<Purchases>()
                .HasOne(p => p.Gift)
                .WithMany(g => g.Purchases)
                .HasForeignKey(p => p.GiftId);
        }
    }
}
