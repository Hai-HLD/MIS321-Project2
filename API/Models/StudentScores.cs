using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MinigamesAPI.Models
{
    public class StudentScores
    {
        [Key]
        [ForeignKey("Student")]
        public string StudentID { get; set; } = string.Empty;
        
        public int Game1Score { get; set; } = 0;
        public int Game2Score { get; set; } = 0;
        public int Game3Score { get; set; } = 0;
        public int Game4Score { get; set; } = 0;
        public int Game5Score { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Student Student { get; set; } = null!;
    }
}
