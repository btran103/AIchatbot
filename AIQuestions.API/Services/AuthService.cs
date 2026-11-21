using AIQuestions.API.Data;
using AIQuestions.API.DTOs;
using AIQuestions.API.Helpers;
using AIQuestions.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AIQuestions.API.Services;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly JwtHelper _jwt;

    public AuthService(AppDbContext db, JwtHelper jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        var exists = await _db.Users.AnyAsync(u => u.Email == request.Email);
        if (exists) return null;

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // Tạo default settings cho user mới
        _db.UserSettings.Add(new UserSetting { UserId = user.Id });
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Token = _jwt.GenerateToken(user),
            User = new UserDto { Id = user.Id, Name = user.Name, Email = user.Email }
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null) return null;

        var valid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!valid) return null;

        return new AuthResponse
        {
            Token = _jwt.GenerateToken(user),
            User = new UserDto { Id = user.Id, Name = user.Name, Email = user.Email, Avatar = user.Avatar }
        };
    }
}