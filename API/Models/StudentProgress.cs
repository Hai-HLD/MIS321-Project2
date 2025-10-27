using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MinigamesAPI.Models
{
    public class StudentProgress
    {
        [Key]
        [Column(Order = 0)]
        public string TeacherID { get; set; } = string.Empty;
        
        [Key]
        [Column(Order = 1)]
        public string StudentID { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Teacher Teacher { get; set; } = null!;
        public virtual Student Student { get; set; } = null!;
    }
}
