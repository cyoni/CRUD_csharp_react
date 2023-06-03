using Microsoft.AspNetCore.Mvc;
using Modals;
using Models;
using Services;

namespace Assignment_CRUD_Harel.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {

        private readonly ILogger<LoginController> _logger;
        private readonly ILoginService _loginService;

        public LoginController(
            ILogger<LoginController> logger,
            ILoginService loginService)
        {
            _logger = logger;
            _loginService = loginService;
        }

        [HttpPost]
        public async Task<ActionResult> Login([FromBody] Customer request)
        {
            try
            {
                var result = await _loginService.Login(request);
                if (result == true)
                {
                    _logger.LogInformation($"Login: Access granted for customer: {request.Id}");
                    return Ok();
                }
                else
                {
                    _logger.LogInformation($"Login: Access denied for customer: {request.Id}");
                    return Unauthorized();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Login: caught exception. Customer: {request.Id}", ex);
                return StatusCode(500, ex);
            }
        }
    }
}
