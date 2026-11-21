using AIQuestions.API.Data;
using AIQuestions.API.DTOs;
using AIQuestions.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AIQuestions.API.Services;

public class ConversationService
{
    private readonly AppDbContext _db;

    public ConversationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<ConversationDto>> GetConversationsAsync(int userId)
    {
        return await _db.Conversations
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.IsPinned)
            .ThenByDescending(c => c.UpdatedAt)
            .Select(c => new ConversationDto
            {
                Id = c.Id,
                Title = c.Title,
                Mode = c.Mode,
                IsPinned = c.IsPinned,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<Conversation> CreateConversationAsync(int userId, string title, string mode)
    {
        var conv = new Conversation
        {
            UserId = userId,
            Title = title,
            Mode = mode,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Conversations.Add(conv);
        await _db.SaveChangesAsync();
        return conv;
    }

    public async Task<List<MessageDto>> GetMessagesAsync(int conversationId, int userId)
    {
        var conv = await _db.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId && c.UserId == userId);
        if (conv == null) return new List<MessageDto>();

        return await _db.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                Role = m.Role,
                Content = m.Content,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<Message> SaveMessageAsync(int conversationId, string role, string content)
    {
        var msg = new Message
        {
            ConversationId = conversationId,
            Role = role,
            Content = content,
            CreatedAt = DateTime.UtcNow
        };
        _db.Messages.Add(msg);

        // Update conversation timestamp
        var conv = await _db.Conversations.FindAsync(conversationId);
        if (conv != null) conv.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return msg;
    }

    public async Task<bool> UpdateConversationAsync(int id, int userId, string? title, bool? isPinned)
    {
        var conv = await _db.Conversations.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (conv == null) return false;

        if (title != null) conv.Title = title;
        if (isPinned.HasValue) conv.IsPinned = isPinned.Value;
        conv.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteConversationAsync(int id, int userId)
    {
        var conv = await _db.Conversations.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (conv == null) return false;

        _db.Conversations.Remove(conv);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<string> GenerateTitleAsync(string firstMessage)
    {
        var title = firstMessage.Length > 50
            ? firstMessage[..50].Trim() + "..."
            : firstMessage.Trim();
        return title;
    }
}
