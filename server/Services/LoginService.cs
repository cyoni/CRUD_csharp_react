using Modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Common;
using Microsoft.Extensions.Logging;

namespace Services
{
    public interface ILoginService
    {
        Task<bool> Login(Customer request);
    }

    public class LoginService : ILoginService
    {
        private readonly ICustomersCRUDService _customersCRUDService;

        public LoginService(ICustomersCRUDService customersCRUDService, ILogger<LoginService> logger)
        {
            _customersCRUDService = customersCRUDService;
        }

        public async Task<bool> Login(Customer request)
        {
            if (request.Email == null) return false;

            var customer = await _customersCRUDService.GetCustomerByEmailAsync(request.Email);
            return request != null
                && customer != null
                && Tools.GetSha256(request.Password) == customer.Password
                && request.Email == customer.Email
                && request.FirstName == customer.FirstName
                && request.LastName == customer.LastName;
        }

    }
}
