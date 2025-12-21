using Microsoft.EntityFrameworkCore;
using projact.models;
using System;

namespace projact.DAL
{

    public class ProjectDbContext : DbContext
    {
        public ProjectDbContext(DbContextOptions<ProjectDbContext> options) : base(options) { }

        public DbSet <Gift> Gifts { get; set; }
        public DbSet <Purchases> Purchases { get; set; }
        public DbSet <Customer> Customers { get; set; }
        public DbSet<Donator> Donators { get; set; }

    }

}
