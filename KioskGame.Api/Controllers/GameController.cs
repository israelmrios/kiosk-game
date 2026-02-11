using KioskGame.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace KioskGame.Api.Controllers
{

    [ApiController]
    [Route("api/game")]
    public class GameController : ControllerBase
    {
        private readonly GameService _gameService;

        public GameController(GameService gameService)
        {
            _gameService = gameService;
        }

        [HttpPost("play")]
        public IActionResult Play([FromBody] PlayRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.PlayerId))
                return BadRequest("PlayerId is required");

            try
            {
                var result = _gameService.Play(request.PlayerId);

                return Ok(new
                {
                    outcome = result.prize.Id == "nothing" ? "LOSE" : "WIN",
                    prize = result.prize.Id == "nothing"
                        ? null
                        : new { result.prize.Id, result.prize.Name },
                    playsRemaining = result.playsRemaining,
                    sessionExpiresAtUtc = result.sessionExpiresAtUtc
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public record PlayRequest(string PlayerId);
}
