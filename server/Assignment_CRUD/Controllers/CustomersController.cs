using Microsoft.AspNetCore.Mvc;
using Modals;
using Models;
using Services;

namespace Assignment_CRUD_Harel.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class CustomersController : ControllerBase
    {
        private readonly ILogger<CustomersController> _logger;
        private readonly ICustomersCRUDService _customersCRUDService;

        public CustomersController(ILogger<CustomersController> logger, ICustomersCRUDService usersCRUDService)
        {
            _logger = logger;
            _customersCRUDService = usersCRUDService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerResponse>>> GetAllCustomers()
        {
            try
            {
                IEnumerable<Customer> customers = await _customersCRUDService.GetAllCustomersAsync();
                var repsonse = new List<CustomerResponse>();

                foreach (var customer in customers) { 
                    repsonse.Add(new CustomerResponse(customer));
                }

                return Ok(repsonse);
            }
            catch (Exception ex)
            {
                _logger.LogError("GetAllCustomers: caught exception", ex);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<CustomerResponse>> GetCustomerById(int id)
        {
            try
            {
                var customer = await _customersCRUDService.GetCustomerByIdAsync(id);
                if (customer == null)
                {
                    return BadRequest();
                }
                return Ok(new CustomerResponse(customer));
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetCustomerById: caught exception, Id: {id}", ex);
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost]
        public async Task<ActionResult> UpdateCustomer([FromBody] Customer customer)
        {
            try
            {
                if (customer == null)
                {
                    return BadRequest();
                }

                bool result = await _customersCRUDService.UpdateUserAsync(customer);

                if (result == false) 
                {
                    return BadRequest();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"UpdateCustomer: caught exception, Id: {customer.Id}", ex);
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost]
        public async Task<ActionResult> DeleteCustomer(int id)
        {
            try
            {
                var result = await _customersCRUDService.DeleteCustomerAsync(id);

                if (result == false)
                {
                    return BadRequest();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"DeleteCustomer: caught exception, Id: {id}", ex);
                return StatusCode(500, ex.Message);
            }
        }


    }
}