using Microsoft.AspNetCore.Mvc;
using FamilyAffairAPI.Models;
using FamilyAffairAPI.Services;
using FamilyAffairAPI.Repositories;

namespace FamilyAffairAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IChatRepository _repository;

        public ChatController(IChatService chatService, IChatRepository repository)
        {
            _chatService = chatService;
            _repository = repository;
        }

        // 1. Crear una nueva sesión de chat
        // POST: api/chat/session/5 (donde 5 es el ID del usuario)
        [HttpPost("session/{userId}")]
        public async Task<ActionResult<ChatSession>> StartSession(int userId)
        {
            var session = await _repository.CreateSessionAsync(userId);
            return Ok(session);
        }

        // 2. Enviar un mensaje y recibir respuesta de la IA
        // POST: api/chat/1/send (donde 1 es el ID de la sesión)
        [HttpPost("{sessionId}/send")]
        public async Task<IActionResult> SendMessage(int sessionId, [FromForm] string? message, IFormFile? file)
        {
            string? base64Image = null;

            if (file != null && file.Length > 0)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                base64Image = Convert.ToBase64String(ms.ToArray());
            }

            // Usamos un texto por defecto si el mensaje está vacío
            string finalMessage = string.IsNullOrWhiteSpace(message) ? "Analiza el contenido de esta imagen clínica." : message;

            // PASAMOS LOS 3 ARGUMENTOS (Importante: revisa que tu Service los reciba)
            var response = await _chatService.ProcessChatAsync(sessionId, finalMessage, base64Image);

            return Ok(new { userMessage = finalMessage, aiResponse = response });
        }

        // 3. Obtener todo el historial de una sesión
        // GET: api/chat/1/history
        [HttpGet("{sessionId}/history")]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetHistory(int sessionId)
        {
            var messages = await _repository.GetMessagesBySessionAsync(sessionId);
            return Ok(messages);
        }
    }
}