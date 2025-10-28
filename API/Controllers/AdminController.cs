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
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AdminController> _logger;

        public AdminController(ApplicationDbContext context, ILogger<AdminController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPut("users/{userId}")]
        public async Task<ActionResult<UserResponse>> UpdateUser(string userId, [FromBody] UpdateUserRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.UserType))
                {
                    return BadRequest(new { message = "User type is required." });
                }

                if (request.UserType == "student")
                {
                    var student = await _context.Students.FindAsync(userId);
                    if (student == null)
                    {
                        return NotFound(new { message = "Student not found." });
                    }

                    // Update student properties
                    if (!string.IsNullOrWhiteSpace(request.Name))
                    {
                        student.StudentName = request.Name;
                    }

                    if (!string.IsNullOrWhiteSpace(request.Password))
                    {
                        student.StudentPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
                    }

                    student.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    // Get updated student with scores
                    var updatedStudent = await _context.Students
                        .Include(s => s.StudentScores)
                        .FirstOrDefaultAsync(s => s.StudentID == userId);

                    return Ok(new UserResponse
                    {
                        UserId = updatedStudent.StudentID,
                        Name = updatedStudent.StudentName,
                        UserType = "student",
                        ScoreGame1 = updatedStudent.StudentScores?.Game1Score ?? 0,
                        ScoreGame2 = updatedStudent.StudentScores?.Game2Score ?? 0,
                        ScoreGame3 = updatedStudent.StudentScores?.Game3Score ?? 0,
                        ScoreGame4 = updatedStudent.StudentScores?.Game4Score ?? 0,
                        ScoreGame5 = updatedStudent.StudentScores?.Game5Score ?? 0,
                        LastUpdated = (updatedStudent.UpdatedAt ?? updatedStudent.CreatedAt).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        ClassId = await _context.InClasses
                            .Where(ic => ic.StudentID == updatedStudent.StudentID)
                            .Select(ic => ic.ClassID)
                            .FirstOrDefaultAsync()
                    });
                }
                else if (request.UserType == "teacher")
                {
                    var teacher = await _context.Teachers.FindAsync(userId);
                    if (teacher == null)
                    {
                        return NotFound(new { message = "Teacher not found." });
                    }

                    // Update teacher properties
                    if (!string.IsNullOrWhiteSpace(request.Name))
                    {
                        teacher.TeacherName = request.Name;
                    }

                    if (!string.IsNullOrWhiteSpace(request.Password))
                    {
                        teacher.TeacherPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
                    }

                    teacher.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    return Ok(new UserResponse
                    {
                        UserId = teacher.TeacherID,
                        Name = teacher.TeacherName,
                        UserType = "teacher",
                        LastUpdated = (teacher.UpdatedAt ?? teacher.CreatedAt).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        ClassId = teacher.ClassID
                    });
                }

                return BadRequest(new { message = "Invalid user type." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while updating the user." });
            }
        }

        [HttpDelete("users/{userId}")]
        public async Task<ActionResult> DeleteUser(string userId, [FromQuery] string userType)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userType))
                {
                    return BadRequest(new { message = "User type is required." });
                }

                if (userType == "student")
                {
                    var student = await _context.Students.FindAsync(userId);
                    if (student == null)
                    {
                        return NotFound(new { message = "Student not found." });
                    }

                    // Remove InClass relationships
                    var inClassRecords = await _context.InClasses
                        .Where(ic => ic.StudentID == userId)
                        .ToListAsync();
                    _context.InClasses.RemoveRange(inClassRecords);

                    // Remove StudentProgress relationships
                    var progressRecords = await _context.StudentProgress
                        .Where(sp => sp.StudentID == userId)
                        .ToListAsync();
                    _context.StudentProgress.RemoveRange(progressRecords);

                    // Remove StudentScores (will cascade from Student deletion, but explicit is safer)
                    var scores = await _context.StudentScores.FindAsync(userId);
                    if (scores != null)
                    {
                        _context.StudentScores.Remove(scores);
                    }

                    // Remove student
                    _context.Students.Remove(student);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Student deleted successfully." });
                }
                else if (userType == "teacher")
                {
                    var teacher = await _context.Teachers.FindAsync(userId);
                    if (teacher == null)
                    {
                        return NotFound(new { message = "Teacher not found." });
                    }

                    // Remove InClass relationships
                    var inClassRecords = await _context.InClasses
                        .Where(ic => ic.TeacherID == userId)
                        .ToListAsync();
                    _context.InClasses.RemoveRange(inClassRecords);

                    // Remove StudentProgress relationships
                    var progressRecords = await _context.StudentProgress
                        .Where(sp => sp.TeacherID == userId)
                        .ToListAsync();
                    _context.StudentProgress.RemoveRange(progressRecords);

                    // Remove teacher
                    _context.Teachers.Remove(teacher);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Teacher deleted successfully." });
                }

                return BadRequest(new { message = "Invalid user type." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while deleting the user." });
            }
        }
    }
}

