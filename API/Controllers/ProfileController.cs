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
        public async Task<ActionResult<UserResponse>> GetProfile(string userId, [FromQuery] string? userType = null)
        {
            try
            {
                // If userType is specified, only check that type
                if (!string.IsNullOrEmpty(userType))
                {
                    if (userType.ToLower() == "student")
                    {
                        var studentSpecific = await _context.Students
                            .Include(s => s.StudentScores)
                            .FirstOrDefaultAsync(s => s.StudentID == userId);
                            
                        if (studentSpecific != null)
                        {
                            return Ok(new UserResponse
                            {
                                UserId = studentSpecific.StudentID,
                                Name = studentSpecific.StudentName,
                                UserType = "student",
                                ScoreGame1 = studentSpecific.StudentScores?.Game1Score ?? 0,
                                ScoreGame2 = studentSpecific.StudentScores?.Game2Score ?? 0,
                                ScoreGame3 = studentSpecific.StudentScores?.Game3Score ?? 0,
                                ScoreGame4 = studentSpecific.StudentScores?.Game4Score ?? 0,
                                ScoreGame5 = studentSpecific.StudentScores?.Game5Score ?? 0,
                                LastUpdated = studentSpecific.StudentScores?.UpdatedAt
                            });
                        }
                    }
                    else if (userType.ToLower() == "teacher")
                    {
                        var teacherSpecific = await _context.Teachers.FindAsync(userId);
                        if (teacherSpecific != null)
                        {
                            // If teacher doesn't have ClassID, generate one
                            if (string.IsNullOrEmpty(teacherSpecific.ClassID))
                            {
                                var random = new Random();
                                string classId;
                                bool isUnique;
                                
                                do
                                {
                                    classId = random.Next(10000000, 99999999).ToString();
                                    isUnique = !await _context.Teachers.AnyAsync(t => t.ClassID == classId);
                                } while (!isUnique);
                                
                                teacherSpecific.ClassID = classId;
                                await _context.SaveChangesAsync();
                            }

                            return Ok(new UserResponse
                            {
                                UserId = teacherSpecific.TeacherID,
                                Name = teacherSpecific.TeacherName,
                                UserType = "teacher",
                                LastUpdated = null,
                                ClassId = teacherSpecific.ClassID
                            });
                        }
                    }
                    
                    return NotFound(new { message = $"{userType} not found." });
                }

                // If no userType specified, check both (legacy behavior)
                // Try to find student first
                var studentLegacy = await _context.Students
                    .Include(s => s.StudentScores)
                    .FirstOrDefaultAsync(s => s.StudentID == userId);
                    
                if (studentLegacy != null)
                {
                    return Ok(new UserResponse
                    {
                        UserId = studentLegacy.StudentID,
                        Name = studentLegacy.StudentName,
                        UserType = "student",
                        ScoreGame1 = studentLegacy.StudentScores?.Game1Score ?? 0,
                        ScoreGame2 = studentLegacy.StudentScores?.Game2Score ?? 0,
                        ScoreGame3 = studentLegacy.StudentScores?.Game3Score ?? 0,
                        ScoreGame4 = studentLegacy.StudentScores?.Game4Score ?? 0,
                        ScoreGame5 = studentLegacy.StudentScores?.Game5Score ?? 0,
                        LastUpdated = studentLegacy.StudentScores?.UpdatedAt
                    });
                }

                // Try to find teacher
                var teacherLegacy = await _context.Teachers.FindAsync(userId);
                if (teacherLegacy != null)
                {
                    // If teacher doesn't have ClassID, generate one
                    if (string.IsNullOrEmpty(teacherLegacy.ClassID))
                    {
                        var random = new Random();
                        string classId;
                        bool isUnique;
                        
                        do
                        {
                            classId = random.Next(10000000, 99999999).ToString();
                            isUnique = !await _context.Teachers.AnyAsync(t => t.ClassID == classId);
                        } while (!isUnique);
                        
                        teacherLegacy.ClassID = classId;
                        await _context.SaveChangesAsync();
                    }

                    return Ok(new UserResponse
                    {
                        UserId = teacherLegacy.TeacherID,
                        Name = teacherLegacy.TeacherName,
                        UserType = "teacher",
                        LastUpdated = null,
                        ClassId = teacherLegacy.ClassID
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
                        ScoreGame5 = s.StudentScores != null ? s.StudentScores.Game5Score : 0,
                        LastUpdated = s.StudentScores != null ? s.StudentScores.UpdatedAt : null
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

