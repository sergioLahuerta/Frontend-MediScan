using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FamilyAffairAPI.Models;

public class ChatSession
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; } // El ID del usuario que inició el chat

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Esta propiedad es clave para tu lógica de IA: 
    // Indica si ya hemos extraído un diagnóstico de esta charla.
    public bool IsAnalyzed { get; set; } = false;
}