namespace MinigamesAPI.DTOs
{
    public class RegisterRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty; // "student" or "teacher"
        public string? ClassID { get; set; } // Required for students, null for teachers
    }
}

