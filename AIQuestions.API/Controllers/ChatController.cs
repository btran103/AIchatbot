using System.Security.Claims;
using AIQuestions.API.DTOs;
using AIQuestions.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIQuestions.API.Controllers;

[ApiController]
[Route("api/chat")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly AIService _aiService;
    private readonly ConversationService _conversationService;

    public ChatController(AIService aiService, ConversationService conversationService)
    {
        _aiService = aiService;
        _conversationService = conversationService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        var userId = GetUserId();

        // Build history for AI context
        var history = request.History
            .Select(h => (h.Role, h.Content))
            .ToList();

        // Get AI response
        var aiResponse = await _aiService.ChatAsync(request.Message, request.Mode, history);

        int? conversationId = request.ConversationId;

        // Save to DB if no conversation exists, create one
        if (conversationId == null)
        {
            var title = await _conversationService.GenerateTitleAsync(request.Message);
            var conv = await _conversationService.CreateConversationAsync(userId, title, request.Mode);
            conversationId = conv.Id;
        }

        // Save messages
        await _conversationService.SaveMessageAsync(conversationId.Value, "user", request.Message);
        await _conversationService.SaveMessageAsync(conversationId.Value, "assistant", aiResponse);

        return Ok(new ChatResponse
        {
            Content = aiResponse,
            ConversationId = conversationId
        });
    }
}
