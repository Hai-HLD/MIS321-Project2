using System.ComponentModel.DataAnnotations;

namespace MinigamesAPI.Models
{
    public class Teacher
    {
        [Key]
        public string TeacherID { get; set; } = string.Empty;
        
        [Required]
        public string TeacherName { get; set; } = string.Empty;
        
        [Required]
        public string TeacherPassword { get; set; } = string.Empty;
        
        [Required]
        public string ClassID { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}

