using System.Security.Claims;
using AIQuestions.API.DTOs;
using AIQuestions.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIQuestions.API.Controllers;

[ApiController]
[Route("api/conversations")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly ConversationService _conversationService;

    public ConversationsController(ConversationService conversationService)
    {
        _conversationService = conversationService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var conversations = await _conversationService.GetConversationsAsync(GetUserId());
        return Ok(conversations);
    }

    [HttpGet("{id}/messages")]
    public async Task<IActionResult> GetMessages(int id)
    {
        var messages = await _conversationService.GetMessagesAsync(id, GetUserId());
        return Ok(messages);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateConversationRequest request)
    {
        var success = await _conversationService.UpdateConversationAsync(id, GetUserId(), request.Title, request.IsPinned);
        if (!success) return NotFound();
        return Ok(new { message = "Updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _conversationService.DeleteConversationAsync(id, GetUserId());
        if (!success) return NotFound();
        return Ok(new { message = "Deleted successfully" });
    }
}
