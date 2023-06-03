using Modals;
using Newtonsoft.Json.Linq;
using Repositories;

namespace Services
{
    public interface ICustomersCRUDService
    {
        Task<bool> UpdateUserAsync(Customer user);
        Task<bool> DeleteCustomerAsync(int id);
        Task<IEnumerable<Customer>> GetAllCustomersAsync();
        Task<Customer?> GetCustomerByIdAsync(int id);
        Task<Customer?> GetCustomerByEmailAsync(string email);
    }

    public class CustomersCRUDService : ICustomersCRUDService
    {
        private readonly ICustomersCacheService _customersCacheService;
        private readonly ICustomersDbService _customersDbService;

        public CustomersCRUDService(ICustomersCacheService customersCacheService, ICustomersDbService customersDbService)
        {
            _customersCacheService = customersCacheService;
            _customersDbService = customersDbService;
        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            await _customersCacheService.RemoveCustomerByIdAsync(id);
            var dbResult = _customersDbService.RemoveCustomerById(id);
            return dbResult;
        }

        public async Task<bool> UpdateUserAsync(Customer updatedCustomer)
        {
            // check input
            if (!updatedCustomer.IsValid)
            {
                return false;
            }

            // check if the customer exists first
            var oldCustomer = await GetCustomerByIdAsync(updatedCustomer.Id);
            if (oldCustomer == null)
            {
                return false;
            }
            // update customer in cache
            await _customersCacheService.UpdateCustomerAsync(updatedCustomer, oldCustomer);
            // update customer in db
            _customersDbService.UpdateCustomer(updatedCustomer);
            return true;
        }

        public async Task<IEnumerable<Customer>> GetAllCustomersAsync()
        {
            // fetch customers from cache
            var customers = await _customersCacheService.GetAllCustomersAsync();
            if (customers != null && customers.Any())
            {
                return customers;
            }

            // fetch customers from db
            var customersFromDb = _customersDbService.GetAllCustomers();

            // refresh cache
            await _customersCacheService.MultiUpsertCustomerAsync(customersFromDb);
            return customersFromDb;
        }

        public async Task<Customer?> GetCustomerByIdAsync(int id)
        {
            // get customer from cache
            var customerFromCache = await _customersCacheService.GetCustomerByIdAsync(id);
            if (customerFromCache != null)
            {
                return customerFromCache;
            }
            // document is not in cache, so get it from db
            return _customersDbService.GetCustomerById(id);
        }

        public async Task<Customer?> GetCustomerByEmailAsync(string email)
        {
            if (email == null) return null;

            // get customer from cache
            var customerFromCache = await _customersCacheService.GetCustomerByEmailAsync(email);
            if (customerFromCache != null)
            {
                return customerFromCache;
            }
            // document is not in cache, so get it from db
            return _customersDbService.GetCustomerByEmail(email);
        }
    }
}