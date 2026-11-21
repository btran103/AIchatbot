namespace AIQuestions.API.DTOs;

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
    public string Mode { get; set; } = "normal";
    public List<ChatHistoryItem> History { get; set; } = new();
    public int? ConversationId { get; set; }
}

public class ChatHistoryItem
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class ChatResponse
{
    public string Content { get; set; } = string.Empty;
    public int? ConversationId { get; set; }
}

public class ConversationDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Mode { get; set; } = string.Empty;
    public bool IsPinned { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class MessageDto
{
    public int Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateConversationRequest
{
    public string Title { get; set; } = "New Chat";
    public string Mode { get; set; } = "normal";
}

public class UpdateConversationRequest
{
    public string? Title { get; set; }
    public bool? IsPinned { get; set; }
}
