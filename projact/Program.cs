using Microsoft.EntityFrameworkCore;
using projact.BLL;
using projact.DAL;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IDonatorDal, DonatorDal>();
builder.Services.AddScoped<IDonatorService, DonatorService>();

builder.Services.AddScoped<ICustomerDal, CustomerDal>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

builder.Services.AddScoped<IPurchasesDal, PurchasesDal>();
builder.Services.AddScoped<IPurchasesService, PurchasesService>();

// DI
builder.Services.AddScoped<IGiftDal, GiftDal>();
builder.Services.AddScoped<IGiftService, GiftService>();

// DbContext
builder.Services.AddDbContext<ProjectDbContext>(options =>
    options.UseSqlServer("Server=localhost;Database=ChineseSaleDb;Trusted_Connection=True;TrustServerCertificate=True"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
