namespace AIQuestions.API.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public string? About { get; set; }
    public string? Goals { get; set; }
    public string? Skills { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
    public ICollection<Memory> Memories { get; set; } = new List<Memory>();
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public UserSetting? Setting { get; set; }
}