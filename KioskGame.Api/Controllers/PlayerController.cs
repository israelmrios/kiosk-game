using KioskGame.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace KioskGame.Api.Controllers
{

    [ApiController]
    [Route("api/player")]
    public class PlayerController : ControllerBase
    {
        private readonly PlayerService _playerService;

        public PlayerController(PlayerService playerService)
        {
            _playerService = playerService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.PlayerId))
                return BadRequest("PlayerId is required");

            var player = _playerService.Login(request.PlayerId);

            return Ok(new
            {
                playerId = player.Id,
                playsRemaining = player.PlaysRemaining
            });
        }

        [HttpGet("{id}/status")]
        public IActionResult Status([FromRoute] string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest("PlayerId is required");

            var status = _playerService.GetStatus(id);

            if (!status.Exists)
                return NotFound(new { message = "Player not found", playerId = id });

            return Ok(new
            {
                playerId = status.PlayerId,
                playsRemaining = status.PlaysRemaining,
                canPlay = status.CanPlay,
                sessionExpiresAtUtc = status.SessionExpiresAtUtc
            });
        }
    }

    public record LoginRequest(string PlayerId);
}
