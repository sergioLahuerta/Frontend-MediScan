using Microsoft.EntityFrameworkCore;
using FamilyAffairAPI.Models;

namespace FamilyAffairAPI.Data;

public class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

    // Cambia ISet por DbSet y añade = null!; al final
    public DbSet<ChatSession> ChatSessions { get; set; } = null!;
    public DbSet<ChatMessage> ChatMessages { get; set; } = null!;
}