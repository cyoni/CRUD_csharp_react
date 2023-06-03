using Modals;
using MongoDB.Driver;

namespace Repositories
{
    public interface ICustomersDbService
    {
        Customer? GetCustomerById(int id);
        Customer? GetCustomerByEmail(string email);
        IEnumerable<Customer> GetAllCustomers();
        bool UpdateCustomer(Customer value);
        bool RemoveCustomerById(int id);
    }

    public class CustomersDbService : ICustomersDbService
    {
        private readonly ICustomersDbRepository _customersDbRepository;

        public CustomersDbService(ICustomersDbRepository customersDbRepository)
        {
            _customersDbRepository = customersDbRepository;
        }

        public IEnumerable<Customer> GetAllCustomers()
        {
            return _customersDbRepository.GetCustomersList();
        }

        public Customer? GetCustomerById(int id)
        {
            return GetAllCustomers()?.Where(customer => customer.Id == id).FirstOrDefault();
        }

        public Customer? GetCustomerByEmail(string email)
        {
            return GetAllCustomers()?.Where(customer => customer.Email == email).FirstOrDefault();
        }

        public bool RemoveCustomerById(int id)
        {
            var customers = GetAllCustomers().Where(customer => customer.Id != id);
            if (customers == null)
            {
                return false;
            }
            _customersDbRepository.UpdateCustomersList(customers);
            return true;
        }

        public bool UpdateCustomer(Customer customer)
        {
            var allCustomers = GetAllCustomers();
            var customerToUpdate = allCustomers.Where(c => c.Id == customer.Id)?.FirstOrDefault();

            if (customerToUpdate == null) return false;

            customerToUpdate.FirstName = customer.FirstName;
            customerToUpdate.LastName = customer.LastName;
            customerToUpdate.Phone = customer.Phone;
            customerToUpdate.Email = customer.Email;

            _customersDbRepository.UpdateCustomersList(allCustomers);
            return true;
        }
    }
}