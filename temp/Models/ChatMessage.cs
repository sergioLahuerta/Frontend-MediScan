using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FamilyAffairAPI.Models;

public class ChatMessage
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ChatSessionId { get; set; }

    // Relación de navegación: esto le dice a Entity Framework que el mensaje pertenece a una sesión
    [ForeignKey("ChatSessionId")]
    public ChatSession ChatSession { get; set; }

    [Required]
    public string Sender { get; set; } // Guardaremos "User" o "AI"

    [Required]
    public string Content { get; set; } // El texto del mensaje

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}