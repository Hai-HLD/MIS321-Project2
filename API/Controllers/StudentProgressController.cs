using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Data;
using MinigamesAPI.DTOs;
using MinigamesAPI.Models;

namespace MinigamesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentProgressController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<StudentProgressController> _logger;

        public StudentProgressController(ApplicationDbContext context, ILogger<StudentProgressController> logger)
        {
            _context = context;
            _logger = logger;
        }


        [HttpGet("teacher/{teacherId}")]
        public async Task<ActionResult<List<UserResponse>>> GetStudentsByTeacher(string teacherId)
        {
            try
            {
                var students = await _context.InClasses
                    .Where(ic => ic.TeacherID == teacherId)
                    .Include(ic => ic.Student)
                        .ThenInclude(s => s.StudentScores)
                    .Select(ic => new UserResponse
                    {
                        UserId = ic.Student.StudentID,
                        Name = ic.Student.StudentName,
                        UserType = "student",
                        ScoreGame1 = ic.Student.StudentScores != null ? ic.Student.StudentScores.Game1Score : 0,
                        ScoreGame2 = ic.Student.StudentScores != null ? ic.Student.StudentScores.Game2Score : 0,
                        ScoreGame3 = ic.Student.StudentScores != null ? ic.Student.StudentScores.Game3Score : 0,
                        ScoreGame4 = ic.Student.StudentScores != null ? ic.Student.StudentScores.Game4Score : 0,
                        ScoreGame5 = ic.Student.StudentScores != null ? ic.Student.StudentScores.Game5Score : 0,
                        LastUpdated = ic.Student.StudentScores != null ? 
                            ic.Student.StudentScores.UpdatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") : 
                            ic.Student.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                    })
                    .ToListAsync();

                return Ok(students);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching students for teacher {TeacherId}", teacherId);
                return StatusCode(500, new { message = "An error occurred while fetching students." });
            }
        }

        [HttpDelete("unassign/{studentId}")]
        public async Task<ActionResult> UnassignStudent(string studentId)
        {
            try
            {
                var assignment = await _context.InClasses
                    .FirstOrDefaultAsync(ic => ic.StudentID == studentId);

                if (assignment == null)
                {
                    return NotFound(new { message = "Student assignment not found." });
                }

                _context.InClasses.Remove(assignment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Student unassigned successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error unassigning student {StudentId}", studentId);
                return StatusCode(500, new { message = "An error occurred while unassigning student." });
            }
        }
    }
}
