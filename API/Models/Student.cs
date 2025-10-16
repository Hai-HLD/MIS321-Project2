using System.ComponentModel.DataAnnotations;

namespace MinigamesAPI.Models
{
    public class Student
    {
        [Key]
        public string StudentID { get; set; } = string.Empty;
        
        [Required]
        public string StudentName { get; set; } = string.Empty;
        
        [Required]
        public string StudentPassword { get; set; } = string.Empty;
        
        // Navigation property for scores
        public virtual StudentScores? StudentScores { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

