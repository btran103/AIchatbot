using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace AIQuestions.API.Services;

public class AIService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly ILogger<AIService> _logger;

    private static readonly Dictionary<string, string> SystemInstructions = new()
    {
        ["normal"] = "Bạn là AIQuestions (AQ), một trợ lý AI cá nhân cao cấp chuyên về Học tập và Công việc. Hãy trả lời thông minh, đầy đủ, sử dụng định dạng Markdown rõ ràng, danh sách gạch đầu dòng, bảng biểu và code block khi cần thiết.",
        ["study"] = "Bạn là trợ lý Học tập AIQuestions. Nhiệm vụ: Giúp người dùng hiểu sâu kiến thức. Khi hỏi bài tập: 1) Phân tích đề, 2) Nêu kiến thức/công thức cần dùng, 3) Hướng dẫn từng bước để người dùng tự làm. Chỉ giải trọn vẹn khi được yêu cầu rõ. Trả lời bằng tiếng Việt chi tiết, sư phạm.",
        ["coding"] = "Bạn là chuyên gia Lập trình AIQuestions (.NET, C#, React, TypeScript, SQL Server, Python, Clean Architecture). Giúp debug, sửa lỗi, review code, phân tích nguyên nhân lỗi và đưa ra giải pháp chuẩn. Viết code sạch, có comment rõ ràng.",
        ["english"] = "Bạn là gia sư Tiếng Anh AIQuestions. Hỗ trợ học từ vựng, ngữ pháp, dịch thuật, luyện thi TOEIC/IELTS. Giải thích song ngữ Anh - Việt, có ví dụ thực tế.",
        ["work"] = "Bạn là trợ lý Công việc AIQuestions. Hỗ trợ lập kế hoạch, soạn thảo email, viết báo cáo công việc, phân tích vấn đề và chia nhỏ đầu việc rõ ràng.",
        ["project"] = "Bạn là kiến trúc sư Dự án phần mềm AIQuestions. Hỗ trợ phân tích yêu cầu, thiết kế Database ERD, thiết kế REST API, kiến trúc hệ thống và lập kế hoạch sprint."
    };

    public AIService(IConfiguration config, ILogger<AIService> logger)
    {
        _config = config;
        _logger = logger;
        _httpClient = new HttpClient();
    }

    public async Task<string> ChatAsync(string userMessage, string mode, List<(string Role, string Content)> history)
    {
        try
        {
            var apiKey = _config["Gemini:ApiKey"]?.Trim();
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                return "Chưa cấu hình Gemini API Key.";
            }

            // 1. Tự động lấy danh sách Model khả dụng từ Google
            var listModelsUrl = $"https://generativelanguage.googleapis.com/v1beta/models?key={apiKey}";
            var modelsResponse = await _httpClient.GetAsync(listModelsUrl);
            
            var targetModel = "models/gemini-1.5-flash"; // mặc định

            if (modelsResponse.IsSuccessStatusCode)
            {
                var modelsJson = await modelsResponse.Content.ReadAsStringAsync();
                using var docModels = JsonDocument.Parse(modelsJson);
                if (docModels.RootElement.TryGetProperty("models", out var modelsArr))
                {
                    foreach (var m in modelsArr.EnumerateArray())
                    {
                        var name = m.GetProperty("name").GetString() ?? "";
                        // Tìm model hỗ trợ generateContent
                        if (m.TryGetProperty("supportedGenerationMethods", out var methods))
                        {
                            var methodsStr = methods.ToString();
                            if (methodsStr.Contains("generateContent"))
                            {
                                if (name.Contains("flash"))
                                {
                                    targetModel = name;
                                    break;
                                }
                                targetModel = name; // lấy model đầu tiên hỗ trợ
                            }
                        }
                    }
                }
            }

            var systemInstruction = SystemInstructions.TryGetValue(mode, out var inst) 
                ? inst 
                : SystemInstructions["normal"];

            var contents = new List<object>();
            foreach (var (role, content) in history.TakeLast(6))
            {
                var geminiRole = role.ToLower() == "assistant" ? "model" : "user";
                contents.Add(new
                {
                    role = geminiRole,
                    parts = new[] { new { text = content } }
                });
            }

            contents.Add(new
            {
                role = "user",
                parts = new[] { new { text = userMessage } }
            });

            var requestBody = new
            {
                system_instruction = new
                {
                    parts = new[] { new { text = systemInstruction } }
                },
                contents,
                generationConfig = new
                {
                    temperature = 0.7,
                    maxOutputTokens = 2500
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

            // Gọi endpoint với tên model chính xác lấy từ chính Google
            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/{targetModel}:generateContent?key={apiKey}";
            var response = await _httpClient.PostAsync(endpoint, httpContent);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                return $"⚠️ Lỗi kết nối Google ({response.StatusCode}) với model {targetModel}: {err}";
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);

            if (doc.RootElement.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
            {
                var firstCandidate = candidates[0];
                if (firstCandidate.TryGetProperty("content", out var contentElem) &&
                    contentElem.TryGetProperty("parts", out var parts) && parts.GetArrayLength() > 0)
                {
                    var reply = parts[0].GetProperty("text").GetString();
                    if (!string.IsNullOrEmpty(reply)) return reply;
                }
            }

            return "Không nhận được phản hồi từ AI.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi gọi AI");
            return $"⚠️ Lỗi hệ thống: {ex.Message}";
        }
    }
}
