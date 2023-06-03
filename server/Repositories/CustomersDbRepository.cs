using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Modals;
using Models;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SharpCompress.Common;
using System.Data.Common;
using System.Linq;
using System.Text.Json.Nodes;

namespace Repositories
{
    public interface ICustomersDbRepository
    {
        IEnumerable<Customer> GetCustomersList();
        void UpdateCustomersList(IEnumerable<Customer> customers);
    }

    public class CustomersDbRepository : ICustomersDbRepository
    {
        private readonly ILogger<CustomersDbRepository> _logger;
        private readonly string connectionString;

        public CustomersDbRepository(ILogger<CustomersDbRepository> logger, IOptions<CustomerDbSettings> customerDbSettings)
        {
            _logger = logger;
            connectionString = customerDbSettings.Value.ConnectionString;
        }

        public IEnumerable<Customer> GetCustomersList()
        {
            try
            {
                string databaseContent = File.ReadAllText(connectionString);
                JArray customerArray = JArray.Parse(databaseContent);
                return customerArray.ToObject<List<Customer>>() ?? new List<Customer>();
            }
            catch (Exception ex)
            {
                _logger.LogError("GetCustomersList: Could not get customers from db", ex);
                throw;
            }
        }

        public void UpdateCustomersList(IEnumerable<Customer> customers)
        {
            try
            {
                string json = JsonConvert.SerializeObject(customers, Formatting.Indented);
                File.WriteAllText(connectionString, json);
            }
            catch (Exception ex)
            {
                _logger.LogError("UpdateCustomersList: Could not get update customers list in db", ex);
                throw;
            }
        }
    }
}