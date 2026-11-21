namespace AIQuestions.API.Models;

public class UserSetting
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Theme { get; set; } = "system"; // light, dark, system
    public bool EnterToSend { get; set; } = true;
    public bool ShowTimestamps { get; set; } = true;
    public bool MarkdownEnabled { get; set; } = true;
    public string AIModel { get; set; } = "claude-3-5-sonnet-20241022";
    public float Temperature { get; set; } = 0.7f;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}