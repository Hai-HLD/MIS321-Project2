namespace MinigamesAPI.DTOs
{
    public class UpdateUserRequest
    {
        public string? Name { get; set; }
        public string? Password { get; set; }
        public string UserType { get; set; } = string.Empty;
    }
}

