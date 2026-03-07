using FamilyAffairAPI.Models;

namespace FamilyAffairAPI.Repositories;

public interface IChatRepository
{
    Task<ChatSession> CreateSessionAsync(int userId);
    Task AddMessageAsync(ChatMessage message);
    Task<IEnumerable<ChatMessage>> GetMessagesBySessionAsync(int sessionId);
    Task MarkAsAnalyzedAsync(int sessionId);
}