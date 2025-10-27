using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MinigamesAPI.Models
{
    public class InClass
    {
        [Key]
        [Column(Order = 0)]
        public string StudentID { get; set; } = string.Empty;
        
        [Key]
        [Column(Order = 1)]
        public string TeacherID { get; set; } = string.Empty;
        
        [Required]
        public string ClassID { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Student Student { get; set; } = null!;
        public virtual Teacher Teacher { get; set; } = null!;
    }
}
