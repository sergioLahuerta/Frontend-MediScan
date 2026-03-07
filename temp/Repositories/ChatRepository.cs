using Microsoft.EntityFrameworkCore;
using FamilyAffairAPI.Models;
using FamilyAffairAPI.Repositories;

namespace FamilyAffairAPI.Data;

public class ChatRepository : IChatRepository
{
    private readonly MyDbContext _context;

    public ChatRepository(MyDbContext context)
    {
        _context = context;
    }

    public async Task<ChatSession> CreateSessionAsync(int userId)
    {
        var session = new ChatSession { UserId = userId };
        _context.ChatSessions.Add(session);
        await _context.SaveChangesAsync();
        return session;
    }

    public async Task<IEnumerable<ChatMessage>> GetMessagesBySessionAsync(int sessionId)
    {
        // El ToListAsync() ahora funcionará gracias al using de arriba
        return await _context.ChatMessages
            .Where(m => m.ChatSessionId == sessionId)
            .OrderBy(m => m.Timestamp)
            .ToListAsync();
    }

    public async Task AddMessageAsync(ChatMessage message)
    {
        _context.ChatMessages.Add(message);
        await _context.SaveChangesAsync();
    }

    public async Task MarkAsAnalyzedAsync(int sessionId)
    {
        var session = await _context.ChatSessions.FindAsync(sessionId);
        if (session != null)
        {
            session.IsAnalyzed = true;
            await _context.SaveChangesAsync();
        }
    }
}