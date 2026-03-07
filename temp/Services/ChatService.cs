using System.Text;
using System.Text.Json;
using FamilyAffairAPI.Models;
using FamilyAffairAPI.Repositories;

namespace FamilyAffairAPI.Services;

public class ChatService : IChatService
{
    private readonly IChatRepository _repository;
    private readonly IHttpClientFactory _httpClientFactory;

    // 1. Pon tu clave de Groq aquí (la que empieza por gsk_)
    private readonly string _groqApiKey = "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";

    public ChatService(IChatRepository repository, IHttpClientFactory httpClientFactory)
    {
        _repository = repository;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<string> ProcessChatAsync(int sessionId, string userMessage, string? base64Image)
    {
        // Guardamos el mensaje del usuario en SQL
        await _repository.AddMessageAsync(new ChatMessage
        {
            ChatSessionId = sessionId,
            Sender = "User",
            Content = userMessage,
            Timestamp = DateTime.UtcNow
        });

        // ¡CORRECCIÓN!: Ahora sí pasamos la imagen al método GetAIResponse
        string aiResponse = await GetAIResponse(userMessage, base64Image);

        // Guardamos la respuesta de la IA
        await _repository.AddMessageAsync(new ChatMessage
        {
            ChatSessionId = sessionId,
            Sender = "AI",
            Content = aiResponse,
            Timestamp = DateTime.UtcNow
        });

        return aiResponse;
    }

    private async Task<string> GetAIResponse(string prompt, string? base64Image = null)
{
    try
    {
        var client = _httpClientFactory.CreateClient();
        var url = "https://api.groq.com/openai/v1/chat/completions";

        // 1. Preparamos el contenido del usuario (Texto + Imagen)
        var userContent = new List<object> { new { type = "text", text = prompt } };

        if (!string.IsNullOrEmpty(base64Image))
        {
            userContent.Add(new { 
                type = "image_url", 
                image_url = new { url = $"data:image/jpeg;base64,{base64Image}" } 
            });
        }

        // 2. Construimos la lista de mensajes con el modelo LLAMA 4 SCOUT
        var requestBody = new
        {
            model = "meta-llama/llama-4-scout-17b-16e-instruct", // NUEVO MODELO
            messages = new object[] {
                new { 
                    role = "system", 
                    content = "Eres un asistente experto en soporte al diagnóstico médico clínico. Analiza la imagen técnica proporcionada y ofrece diagnósticos diferenciales." 
                },
                new { 
                    role = "user", 
                    content = userContent
                }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Headers.Add("Authorization", $"Bearer {_groqApiKey}");
        request.Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        var response = await client.SendAsync(request);
        var responseString = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(responseString);
        return doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "Sin respuesta.";
    }
    catch (Exception ex)
    {
        return $"Error con Llama 4: {ex.Message}";
    }
}
}