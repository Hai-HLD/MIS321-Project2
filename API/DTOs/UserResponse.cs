namespace MinigamesAPI.DTOs
{
    public class UserResponse
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public int? ScoreGame1 { get; set; }
        public int? ScoreGame2 { get; set; }
        public int? ScoreGame3 { get; set; }
        public int? ScoreGame4 { get; set; }
        public int? ScoreGame5 { get; set; }
        public DateTime? LastUpdated { get; set; }
        public string? ClassId { get; set; }
    }
}

