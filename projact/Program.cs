using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models; // הוספתי עבור הגדרות Swagger
using System.Text;
using projact.BLL;
using projact.DAL;
using projact.Services;


var builder = WebApplication.CreateBuilder(args);

// --- הגדרות Swagger עם תמיכה ב-JWT ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Chinese Sale API", Version = "v1" });

    // הגדרת אפשרות ה-JWT בתוך ממשק ה-Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "הכנס את ה-Token בלבד (ללא המילה Bearer, המערכת תוסיף אותה אוטומטית)"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


// --- הגדרות Controllers ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // זו השורה שחסרה לך! היא תגרום לשרת לקבל "Name" בדיוק כמו שאנגולר שולח
        options.JsonSerializerOptions.PropertyNamingPolicy = null;

        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64;
    });

// --- Dependency Injection (DI) ---
builder.Services.AddScoped<IDonatorDal, DonatorDal>();
builder.Services.AddScoped<IDonatorService, DonatorService>();

builder.Services.AddScoped<ICustomerDal, CustomerDal>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

builder.Services.AddScoped<IPurchasesDal, PurchasesDal>();
builder.Services.AddScoped<IPurchasesService, PurchasesService>();

builder.Services.AddScoped<IGiftDal, GiftDal>();
builder.Services.AddScoped<IGiftService, GiftService>();

builder.Services.AddScoped<TokenService>();

// --- AutoMapper ---
builder.Services.AddAutoMapper(typeof(Program));

// --- Database Context ---
builder.Services.AddDbContext<ProjectDbContext>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("home")));

// --- JWT Authentication ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "DefaultSecretKeyForSafety123!")
            )
        };
    });
// --- Raffle Service ---
builder.Services.AddScoped<IRaffleService, RaffleService>();
builder.Services.AddScoped<IEmailService, EmailService>();
// --- Authorization ---
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()   // מאפשר לכל אתר (כולל האנגולר שלך) לגשת
              .AllowAnyMethod()   // מאפשר GET, POST, PUT, DELETE
              .AllowAnyHeader();  // מאפשר את כל כותרות ה-HTTP
    });
});
var app = builder.Build();

app.UseCors();
// --- Middleware Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Chinese Sale API V1");
    });
}

app.UseHttpsRedirection();

// חשוב: Authentication תמיד לפני Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();