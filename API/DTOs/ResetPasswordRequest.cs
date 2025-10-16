namespace MinigamesAPI.DTOs
{
    public class ResetPasswordRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty; // "student" or "teacher"
    }
}
