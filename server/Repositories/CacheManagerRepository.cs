using Microsoft.Extensions.Logging;
using Modals;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public interface ICacheManagerRepository
    {
        Task<IEnumerable<T>?> GetAllAsync<T>(IMongoCollection<T> collection);
        Task<IEnumerable<T>?> GetAsync<T>(FilterDefinition<T> filter, IMongoCollection<T> collection);
        Task<bool> UpdateAsync<T>(FilterDefinition<T> filter, T value, IMongoCollection<T> collection);
        Task<bool> RemoveAsync<T>(FilterDefinition<T> filter, IMongoCollection<T> collection);
        Task UpsertAsync<T>(T value, IMongoCollection<T> collection);
        Task MultiUpsertAsync<T>(IEnumerable<T> values, IMongoCollection<T> collection);
    }

    public class CacheManagerRepository : ICacheManagerRepository
    {
        private readonly ILogger<CacheManagerRepository> _logger;

        public CacheManagerRepository(ILogger<CacheManagerRepository> logger)
        {
            _logger = logger;
        }

        public async Task<IEnumerable<T>?> GetAllAsync<T>(IMongoCollection<T> collection)
        {
            try
            {
                var documents = await collection.FindAsync<T>(_ => true);
                return documents?.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError("GetAllAsync: could not fetch from cache", ex);
                return null;
            }
        }

        public async Task<IEnumerable<T>?> GetAsync<T>(FilterDefinition<T> filter, IMongoCollection<T> collection)
        {
            try
            {
                var documents = await collection.Find(filter).ToListAsync();
                return documents;
            }
            catch (Exception ex)
            {
                _logger.LogError("GetAsync: could not fetch from cache", ex);
                return null;
            }
        }

        public async Task MultiUpsertAsync<T>(IEnumerable<T> values, IMongoCollection<T> collection)
        {
            try
            {
                await collection.InsertManyAsync(values);
            }
            catch (Exception ex)
            {
                _logger.LogError("MultiUpsertAsync: could not insert multiple documents to cache.", ex);
            }
        }

        public async Task<bool> RemoveAsync<T>(FilterDefinition<T> filter, IMongoCollection<T> collection)
        {
            try
            {
                var deletedDocument = await collection.FindOneAndDeleteAsync(filter);
                return deletedDocument != null;
            }
            catch (Exception ex)
            {
                _logger.LogError("RemoveAsync: could not remove from cache.", ex);
                return false;
            }
        }

        public async Task<bool> UpdateAsync<T>(FilterDefinition<T> filter, T value, IMongoCollection<T> collection)
        {
            try
            {
                var result = await collection.ReplaceOneAsync(filter, value);
                return result.IsAcknowledged;
            }
            catch (Exception ex)
            {
                _logger.LogError("UpdateAsync: could not update a document in cache.", ex);
                return false;
            }
        }

        public async Task UpsertAsync<T>(T value, IMongoCollection<T> collection)
        {
            try
            {
                await collection.InsertOneAsync(value);
            }
            catch (Exception ex)
            {
                _logger.LogError("UpsertAsync: could not insert a document in cache.", ex);
            }
        }
    }
}
