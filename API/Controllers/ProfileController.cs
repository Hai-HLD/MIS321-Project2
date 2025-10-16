using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Data;
using MinigamesAPI.DTOs;
using MinigamesAPI.Models;

namespace MinigamesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(ApplicationDbContext context, ILogger<ProfileController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserResponse>> GetProfile(string userId)
        {
            try
            {
                // Try to find student first
                var student = await _context.Students
                    .Include(s => s.StudentScores)
                    .FirstOrDefaultAsync(s => s.StudentID == userId);
                    
                if (student != null)
                {
                    return Ok(new UserResponse
                    {
                        UserId = student.StudentID,
                        Name = student.StudentName,
                        UserType = "student",
                        ScoreGame1 = student.StudentScores?.Game1Score ?? 0,
                        ScoreGame2 = student.StudentScores?.Game2Score ?? 0,
                        ScoreGame3 = student.StudentScores?.Game3Score ?? 0,
                        ScoreGame4 = student.StudentScores?.Game4Score ?? 0,
                        ScoreGame5 = student.StudentScores?.Game5Score ?? 0
                    });
                }

                // Try to find teacher
                var teacher = await _context.Teachers.FindAsync(userId);
                if (teacher != null)
                {
                    return Ok(new UserResponse
                    {
                        UserId = teacher.TeacherID,
                        Name = teacher.TeacherName,
                        UserType = "teacher"
                    });
                }

                return NotFound(new { message = "User not found." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching profile for user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while fetching the profile." });
            }
        }

        [HttpGet("students")]
        public async Task<ActionResult<List<UserResponse>>> GetAllStudents()
        {
            try
            {
                var students = await _context.Students
                    .Include(s => s.StudentScores)
                    .Select(s => new UserResponse
                    {
                        UserId = s.StudentID,
                        Name = s.StudentName,
                        UserType = "student",
                        ScoreGame1 = s.StudentScores != null ? s.StudentScores.Game1Score : 0,
                        ScoreGame2 = s.StudentScores != null ? s.StudentScores.Game2Score : 0,
                        ScoreGame3 = s.StudentScores != null ? s.StudentScores.Game3Score : 0,
                        ScoreGame4 = s.StudentScores != null ? s.StudentScores.Game4Score : 0,
                        ScoreGame5 = s.StudentScores != null ? s.StudentScores.Game5Score : 0
                    })
                    .ToListAsync();

                return Ok(students);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all students");
                return StatusCode(500, new { message = "An error occurred while fetching students." });
            }
        }
    }
}

