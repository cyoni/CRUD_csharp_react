using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Modals;
using Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System.Collections.Generic;

namespace Repositories
{
    public interface ICustomersCacheService
    {
        Task<Customer?> GetCustomerByIdAsync(int id);
        Task<Customer?> GetCustomerByEmailAsync(string email);
        Task<IEnumerable<Customer>?> GetAllCustomersAsync();
        Task<bool> UpdateCustomerAsync(Customer updated, Customer oldValue);
        Task<bool> RemoveCustomerByIdAsync(int id);
        Task UpsertCustomerAsync(Customer value);
        Task MultiUpsertCustomerAsync(IEnumerable<Customer> values);
    }

    public class CustomersCacheService : ICustomersCacheService
    {
        private readonly ILogger<CustomersCacheService> _logger;
        private readonly IMongoCollection<Customer> _customersCollection;
        private readonly ICacheManagerRepository _cacheManagerRepository;

        public CustomersCacheService(
            ILogger<CustomersCacheService> logger,
            IOptions<CustomerCacheSettings> usersCacheSettings,
            ICacheManagerRepository cacheManagerRepository)
        {
            _logger = logger;
            var mongoClient = new MongoClient(usersCacheSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(usersCacheSettings.Value.DatabaseName);
            _customersCollection = mongoDatabase.GetCollection<Customer>(usersCacheSettings.Value.CollectionName);
            _cacheManagerRepository = cacheManagerRepository;
        }

        public async Task<IEnumerable<Customer>?> GetAllCustomersAsync()
        {
            return await _cacheManagerRepository.GetAllAsync(_customersCollection);
        }

        public async Task<Customer?> GetCustomerByIdAsync(int id)
        {
            FilterDefinition<Customer>? filter = Builders<Customer>.Filter.Eq("_id", id);
            var customerFromCache = await _cacheManagerRepository.GetAsync(filter, _customersCollection);
            return customerFromCache?.FirstOrDefault();
        }

        public async Task<Customer?> GetCustomerByEmailAsync(string email)
        {
            FilterDefinition<Customer>? filter = Builders<Customer>.Filter.Eq("Email", email);
            var customerFromCache = await _cacheManagerRepository.GetAsync(filter, _customersCollection);
            return customerFromCache?.FirstOrDefault();
        }

        public async Task MultiUpsertCustomerAsync(IEnumerable<Customer> customers)
        {
            await _cacheManagerRepository.MultiUpsertAsync(customers, _customersCollection);
        }

        public async Task<bool> RemoveCustomerByIdAsync(int id)
        {
            var filter = Builders<Customer>.Filter.Eq("_id", id);
            var result = await _cacheManagerRepository.RemoveAsync(filter, _customersCollection);

            if (result == false)
            {
                _logger.LogError($"RemoveCustomerByIdAsync: could not remove id: {id}");
            }

            return result;
        }

        public async Task UpsertCustomerAsync(Customer customer)
        {
            if (customer != null && customer.Id >= 0)
            {
                await _cacheManagerRepository.UpsertAsync(customer, _customersCollection);
            }
        }

        public async Task<bool> UpdateCustomerAsync(Customer updatedCustomer, Customer oldCustomer)
        {
            updatedCustomer.Password = oldCustomer.Password; // because any user can edit other customer
            var filter = Builders<Customer>.Filter.Eq("_id", updatedCustomer.Id);
            return await _cacheManagerRepository.UpdateAsync(filter, updatedCustomer, _customersCollection);
        }

    }
}