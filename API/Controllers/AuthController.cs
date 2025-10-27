using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Data;
using MinigamesAPI.DTOs;
using MinigamesAPI.Models;
using BCrypt.Net;

namespace MinigamesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        private string GenerateClassID()
        {
            Random random = new Random();
            string classId;
            bool isUnique;
            
            do
            {
                classId = random.Next(10000000, 99999999).ToString();
                isUnique = !_context.Teachers.Any(t => t.ClassID == classId);
            } while (!isUnique);
            
            return classId;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(request.UserId) ||
                    string.IsNullOrWhiteSpace(request.Name) ||
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "All fields are required." });
                }

                if (request.UserType != "student" && request.UserType != "teacher")
                {
                    return BadRequest(new { message = "Invalid user type. Must be 'student' or 'teacher'." });
                }

                // Validate ClassID for students and get teacher info
                Teacher? teacherWithClass = null;
                if (request.UserType == "student")
                {
                    if (string.IsNullOrWhiteSpace(request.ClassID))
                    {
                        return BadRequest(new { message = "Class ID is required for student registration." });
                    }

                    // Check if the ClassID exists for any teacher
                    teacherWithClass = await _context.Teachers.FirstOrDefaultAsync(t => t.ClassID == request.ClassID);
                    if (teacherWithClass == null)
                    {
                        return BadRequest(new { message = "Invalid Class ID. Please check with your teacher." });
                    }
                }

                // Check if user already exists
                if (request.UserType == "student")
                {
                    var existingStudent = await _context.Students.FindAsync(request.UserId);
                    if (existingStudent != null)
                    {
                        return Conflict(new { message = "This Student ID is already taken." });
                    }

                    // Create new student
                    var student = new Student
                    {
                        StudentID = request.UserId,
                        StudentName = request.Name,
                        StudentPassword = BCrypt.Net.BCrypt.HashPassword(request.Password)
                    };

                    _context.Students.Add(student);
                    
                    // Create initial student scores record
                    var studentScores = new StudentScores
                    {
                        StudentID = request.UserId,
                        Game1Score = 0,
                        Game2Score = 0,
                        Game3Score = 0,
                        Game4Score = 0,
                        Game5Score = 0
                    };
                    
                    _context.StudentScores.Add(studentScores);

                    // Create InClass record to link student with teacher
                    if (teacherWithClass != null)
                    {
                        var inClass = new InClass
                        {
                            StudentID = request.UserId,
                            TeacherID = teacherWithClass.TeacherID,
                            ClassID = request.ClassID,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.InClasses.Add(inClass);
                    }
                    else
                    {
                        // This should not happen since we validated the ClassID earlier
                        return BadRequest(new { message = "Error: Could not find teacher for the provided Class ID." });
                    }

                    await _context.SaveChangesAsync();

                    return Ok(new UserResponse
                    {
                        UserId = student.StudentID,
                        Name = student.StudentName,
                        UserType = "student",
                        ScoreGame1 = studentScores.Game1Score,
                        ScoreGame2 = studentScores.Game2Score,
                        ScoreGame3 = studentScores.Game3Score,
                        ScoreGame4 = studentScores.Game4Score,
                        ScoreGame5 = studentScores.Game5Score
                    });
                }
                else // teacher
                {
                    var existingTeacher = await _context.Teachers.FindAsync(request.UserId);
                    if (existingTeacher != null)
                    {
                        return Conflict(new { message = "This Teacher ID is already taken." });
                    }

                    // Generate unique ClassID for teacher
                    var classId = GenerateClassID();

                    // Create new teacher
                    var teacher = new Teacher
                    {
                        TeacherID = request.UserId,
                        TeacherName = request.Name,
                        TeacherPassword = BCrypt.Net.BCrypt.HashPassword(request.Password),
                        ClassID = classId
                    };

                    _context.Teachers.Add(teacher);
                    await _context.SaveChangesAsync();

                    return Ok(new UserResponse
                    {
                        UserId = teacher.TeacherID,
                        Name = teacher.TeacherName,
                        UserType = "teacher"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "An error occurred during registration." });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(request.UserId) ||
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "User ID and password are required." });
                }

                if (request.UserType != "student" && request.UserType != "teacher")
                {
                    return BadRequest(new { message = "Invalid user type." });
                }

                if (request.UserType == "student")
                {
                    var student = await _context.Students
                        .Include(s => s.StudentScores)
                        .FirstOrDefaultAsync(s => s.StudentID == request.UserId);
                    
                    if (student == null || !BCrypt.Net.BCrypt.Verify(request.Password, student.StudentPassword))
                    {
                        return Unauthorized(new { message = "Invalid credentials." });
                    }

                    // Ensure student has a StudentScores record
                    if (student.StudentScores == null)
                    {
                        student.StudentScores = new StudentScores
                        {
                            StudentID = student.StudentID,
                            Game1Score = 0,
                            Game2Score = 0,
                            Game3Score = 0,
                            Game4Score = 0,
                            Game5Score = 0
                        };
                        _context.StudentScores.Add(student.StudentScores);
                        await _context.SaveChangesAsync();
                    }

                    return Ok(new UserResponse
                    {
                        UserId = student.StudentID,
                        Name = student.StudentName,
                        UserType = "student",
                        ScoreGame1 = student.StudentScores.Game1Score,
                        ScoreGame2 = student.StudentScores.Game2Score,
                        ScoreGame3 = student.StudentScores.Game3Score,
                        ScoreGame4 = student.StudentScores.Game4Score,
                        ScoreGame5 = student.StudentScores.Game5Score
                    });
                }
                else // teacher
                {
                    var teacher = await _context.Teachers.FindAsync(request.UserId);
                    if (teacher == null || !BCrypt.Net.BCrypt.Verify(request.Password, teacher.TeacherPassword))
                    {
                        return Unauthorized(new { message = "Invalid credentials." });
                    }

                    return Ok(new UserResponse
                    {
                        UserId = teacher.TeacherID,
                        Name = teacher.TeacherName,
                        UserType = "teacher"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login: {Message}", ex.Message);
                return StatusCode(500, new { 
                    message = "An error occurred during login.", 
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(request.UserId) ||
                    string.IsNullOrWhiteSpace(request.NewPassword) ||
                    string.IsNullOrWhiteSpace(request.UserType))
                {
                    return BadRequest(new { message = "User ID, new password, and user type are required." });
                }

                if (request.UserType != "student" && request.UserType != "teacher")
                {
                    return BadRequest(new { message = "Invalid user type. Must be 'student' or 'teacher'." });
                }

                if (request.UserType == "student")
                {
                    var student = await _context.Students.FindAsync(request.UserId);
                    if (student == null)
                    {
                        return NotFound(new { message = "Student with this ID was not found." });
                    }

                    // Update password with new hash
                    student.StudentPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Password reset successfully for student." });
                }
                else // teacher
                {
                    var teacher = await _context.Teachers.FindAsync(request.UserId);
                    if (teacher == null)
                    {
                        return NotFound(new { message = "Teacher with this ID was not found." });
                    }

                    // Update password with new hash
                    teacher.TeacherPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Password reset successfully for teacher." });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset");
                return StatusCode(500, new { message = "An error occurred during password reset." });
            }
        }
    }
}

