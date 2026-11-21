namespace AIQuestions.API.Models;

public class Conversation
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = "New Chat";
    public string Mode { get; set; } = "normal";
    public bool IsPinned { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}