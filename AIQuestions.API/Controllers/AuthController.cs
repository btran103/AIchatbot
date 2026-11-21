using AIQuestions.API.DTOs;
using AIQuestions.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AIQuestions.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin." });

        if (request.Password.Length < 6)
            return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự." });

        var result = await _authService.RegisterAsync(request);
        if (result == null)
            return BadRequest(new { message = "Email đã được sử dụng." });

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin." });

        var result = await _authService.LoginAsync(request);
        if (result == null)
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

        return Ok(result);
    }
}
