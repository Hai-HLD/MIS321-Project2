using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Data;
using MinigamesAPI.DTOs;
using MinigamesAPI.Models;

namespace MinigamesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ScoreController> _logger;

        public ScoreController(ApplicationDbContext context, ILogger<ScoreController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPut("{studentId}")]
        public async Task<ActionResult> UpdateScore(string studentId, [FromBody] UpdateScoreRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { message = "Request body is required." });
                }

                _logger.LogInformation("UpdateScore called for student {StudentId} with GameNumber {GameNumber} and Score {Score}", 
                    studentId, request.GameNumber, request.Score);
                
                var student = await _context.Students.FindAsync(studentId);
                if (student == null)
                {
                    _logger.LogWarning("Student {StudentId} not found", studentId);
                    return NotFound(new { message = "Student not found." });
                }

                // Validate game number
                if (request.GameNumber < 1 || request.GameNumber > 5)
                {
                    return BadRequest(new { message = "Game number must be between 1 and 5." });
                }

                // Validate score
                if (request.Score < 0)
                {
                    return BadRequest(new { message = "Score cannot be negative." });
                }

                // Get or create student scores record
                var studentScores = await _context.StudentScores.FindAsync(studentId);
                if (studentScores == null)
                {
                    studentScores = new StudentScores
                    {
                        StudentID = studentId,
                        Game1Score = 0,
                        Game2Score = 0,
                        Game3Score = 0,
                        Game4Score = 0,
                        Game5Score = 0
                    };
                    _context.StudentScores.Add(studentScores);
                }

                // Update the appropriate game score only if new score is higher
                bool scoreUpdated = false;
                switch (request.GameNumber)
                {
                    case 1:
                        _logger.LogInformation("Game 1: Current score {CurrentScore}, New score {NewScore}", 
                            studentScores.Game1Score, request.Score);
                        if (request.Score > studentScores.Game1Score)
                        {
                            studentScores.Game1Score = request.Score;
                            scoreUpdated = true;
                        }
                        break;
                    case 2:
                        _logger.LogInformation("Game 2: Current score {CurrentScore}, New score {NewScore}", 
                            studentScores.Game2Score, request.Score);
                        if (request.Score > studentScores.Game2Score)
                        {
                            studentScores.Game2Score = request.Score;
                            scoreUpdated = true;
                        }
                        break;
                    case 3:
                        _logger.LogInformation("Game 3: Current score {CurrentScore}, New score {NewScore}", 
                            studentScores.Game3Score, request.Score);
                        if (request.Score > studentScores.Game3Score)
                        {
                            studentScores.Game3Score = request.Score;
                            scoreUpdated = true;
                        }
                        break;
                    case 4:
                        _logger.LogInformation("Game 4: Current score {CurrentScore}, New score {NewScore}", 
                            studentScores.Game4Score, request.Score);
                        if (request.Score > studentScores.Game4Score)
                        {
                            studentScores.Game4Score = request.Score;
                            scoreUpdated = true;
                        }
                        break;
                    case 5:
                        _logger.LogInformation("Game 5: Current score {CurrentScore}, New score {NewScore}", 
                            studentScores.Game5Score, request.Score);
                        if (request.Score > studentScores.Game5Score)
                        {
                            studentScores.Game5Score = request.Score;
                            scoreUpdated = true;
                        }
                        break;
                }

                _logger.LogInformation("Score updated: {ScoreUpdated}", scoreUpdated);

                // Always update the timestamp to track student activity
                studentScores.UpdatedAt = DateTime.UtcNow;
                student.UpdatedAt = DateTime.UtcNow; // Also update student's last activity
                await _context.SaveChangesAsync();
                _logger.LogInformation("Score record updated (timestamp refreshed)");

                return Ok(new
                {
                    message = scoreUpdated ? "Score updated successfully." : "Score not updated - current score is higher.",
                    scoreUpdated = scoreUpdated,
                    student = new UserResponse
                    {
                        UserId = student.StudentID,
                        Name = student.StudentName,
                        UserType = "student",
                        ScoreGame1 = studentScores.Game1Score,
                        ScoreGame2 = studentScores.Game2Score,
                        ScoreGame3 = studentScores.Game3Score,
                        ScoreGame4 = studentScores.Game4Score,
                        ScoreGame5 = studentScores.Game5Score,
                        LastUpdated = (student.UpdatedAt ?? student.CreatedAt).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        ClassId = await _context.InClasses
                            .Where(ic => ic.StudentID == student.StudentID)
                            .Select(ic => ic.ClassID)
                            .FirstOrDefaultAsync()
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating score for student {StudentId}", studentId);
                return StatusCode(500, new { message = "An error occurred while updating the score." });
            }
        }

        [HttpGet("rankings/{gameNumber}")]
        public async Task<ActionResult<List<UserResponse>>> GetRankings(int gameNumber)
        {
            try
            {
                if (gameNumber < 1 || gameNumber > 5)
                {
                    return BadRequest(new { message = "Game number must be between 1 and 5." });
                }

                var students = await _context.Students
                    .Include(s => s.StudentScores)
                    .ToListAsync();

                // Sort students by the specified game score
                var rankings = students.Select(s => new UserResponse
                {
                    UserId = s.StudentID,
                    Name = s.StudentName,
                    UserType = "student",
                    ScoreGame1 = s.StudentScores?.Game1Score ?? 0,
                    ScoreGame2 = s.StudentScores?.Game2Score ?? 0,
                    ScoreGame3 = s.StudentScores?.Game3Score ?? 0,
                    ScoreGame4 = s.StudentScores?.Game4Score ?? 0,
                    ScoreGame5 = s.StudentScores?.Game5Score ?? 0,
                    LastUpdated = (s.UpdatedAt ?? s.CreatedAt).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    ClassId = _context.InClasses
                        .Where(ic => ic.StudentID == s.StudentID)
                        .Select(ic => ic.ClassID)
                        .FirstOrDefault()
                }).ToList();

                // Sort by the specific game score
                rankings = gameNumber switch
                {
                    1 => rankings.OrderByDescending(s => s.ScoreGame1).ToList(),
                    2 => rankings.OrderByDescending(s => s.ScoreGame2).ToList(),
                    3 => rankings.OrderByDescending(s => s.ScoreGame3).ToList(),
                    4 => rankings.OrderByDescending(s => s.ScoreGame4).ToList(),
                    5 => rankings.OrderByDescending(s => s.ScoreGame5).ToList(),
                    _ => rankings
                };

                return Ok(rankings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching rankings for game {GameNumber}", gameNumber);
                return StatusCode(500, new { message = "An error occurred while fetching rankings." });
            }
        }
    }
}

