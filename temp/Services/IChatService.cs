namespace FamilyAffairAPI.Services;

public interface IChatService
{
    // Procesa el mensaje del usuario y devuelve la respuesta de la IA
    Task<string> ProcessChatAsync(int sessionId, string userMessage, string? base64Image = null);
}