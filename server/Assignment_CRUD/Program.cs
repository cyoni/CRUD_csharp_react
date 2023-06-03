using Models;
using Repositories;
using Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// custom configuration
builder.Services.Configure<CustomerCacheSettings>(builder.Configuration.GetSection("CacheServiceSettings"));
builder.Services.Configure<CustomerDbSettings>(builder.Configuration.GetSection("DbServiceSettings"));

// repositories
builder.Services.AddScoped<ICustomersDbRepository, CustomersDbRepository>();
builder.Services.AddScoped<ICacheManagerRepository, CacheManagerRepository>();

// services
builder.Services.AddScoped<ICustomersCacheService, CustomersCacheService>();
builder.Services.AddScoped<ICustomersDbService, CustomersDbService>();
builder.Services.AddScoped<ICustomersCRUDService, CustomersCRUDService>();
builder.Services.AddScoped<ILoginService, LoginService>();

// custom logging service
builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole(); 
    loggingBuilder.SetMinimumLevel(LogLevel.Debug);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
