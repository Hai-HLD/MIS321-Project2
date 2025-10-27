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
        public DbSet<StudentScores> StudentScores { get; set; }
        public DbSet<StudentProgress> StudentProgress { get; set; }
        public DbSet<InClass> InClasses { get; set; }

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
                entity.Property(e => e.ClassID).IsRequired();
                entity.HasIndex(e => e.TeacherName);
                entity.HasIndex(e => e.ClassID);
            });

            // Configure StudentScores table
            modelBuilder.Entity<StudentScores>(entity =>
            {
                entity.ToTable("StudentScores");
                entity.HasKey(e => e.StudentID);
                entity.Property(e => e.Game1Score).HasDefaultValue(0);
                entity.Property(e => e.Game2Score).HasDefaultValue(0);
                entity.Property(e => e.Game3Score).HasDefaultValue(0);
                entity.Property(e => e.Game4Score).HasDefaultValue(0);
                entity.Property(e => e.Game5Score).HasDefaultValue(0);
                
                // Configure one-to-one relationship with Student
                entity.HasOne(s => s.Student)
                      .WithOne(st => st.StudentScores)
                      .HasForeignKey<StudentScores>(s => s.StudentID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure StudentProgress table
            modelBuilder.Entity<StudentProgress>(entity =>
            {
                entity.ToTable("StudentProgress");
                entity.HasKey(e => new { e.TeacherID, e.StudentID });
                
                // Configure many-to-one relationship with Teacher
                entity.HasOne(sp => sp.Teacher)
                      .WithMany()
                      .HasForeignKey(sp => sp.TeacherID)
                      .OnDelete(DeleteBehavior.Cascade);
                
                // Configure many-to-one relationship with Student
                entity.HasOne(sp => sp.Student)
                      .WithMany()
                      .HasForeignKey(sp => sp.StudentID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure InClass table
            modelBuilder.Entity<InClass>(entity =>
            {
                entity.ToTable("InClass");
                entity.HasKey(e => new { e.StudentID, e.TeacherID });
                
                // Configure many-to-one relationship with Teacher
                entity.HasOne(ic => ic.Teacher)
                      .WithMany()
                      .HasForeignKey(ic => ic.TeacherID)
                      .OnDelete(DeleteBehavior.Cascade);
                
                // Configure many-to-one relationship with Student
                entity.HasOne(ic => ic.Student)
                      .WithMany()
                      .HasForeignKey(ic => ic.StudentID)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}

