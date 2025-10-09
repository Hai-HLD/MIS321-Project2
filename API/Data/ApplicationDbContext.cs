using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Models;

namespace MinigamesAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Student table
            modelBuilder.Entity<Student>(entity =>
            {
                entity.ToTable("Student");
                entity.HasKey(e => e.StudentID);
                entity.Property(e => e.StudentName).IsRequired();
                entity.Property(e => e.StudentPassword).IsRequired();
                entity.HasIndex(e => e.StudentName);
            });

            // Configure Teacher table
            modelBuilder.Entity<Teacher>(entity =>
            {
                entity.ToTable("Teacher");
                entity.HasKey(e => e.TeacherID);
                entity.Property(e => e.TeacherName).IsRequired();
                entity.Property(e => e.TeacherPassword).IsRequired();
                entity.HasIndex(e => e.TeacherName);
            });
        }
    }
}

