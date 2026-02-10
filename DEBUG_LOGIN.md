# 🔍 Login Debugging Guide

## 1️⃣ Angular Side - AuthService

Your Angular AuthService is sending:
```typescript
POST https://localhost:7239/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

✅ **This is correct!** The service uses lowercase property names (`email`, `password`).

---

## 2️⃣ C# Backend - AuthController

### Check Your AuthController Route

Your C# controller should look like this:

```csharp
using Microsoft.AspNetCore.Mvc;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/auth")]  // ✅ This matches Angular's URL
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]  // ✅ Full path: /api/auth/login
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Your login logic
        }
    }
}
```

### Check Your DTO Model

Your `LoginDto` should match Angular's payload:

```csharp
public class LoginDto
{
    public string Email { get; set; }     // ✅ C# uses PascalCase
    public string Password { get; set; }  // ✅ ASP.NET auto-converts from JSON
}
```

**Important:** ASP.NET Core automatically converts JSON property names:
- `email` (JSON) → `Email` (C#)
- `password` (JSON) → `Password` (C#)

---

## 3️⃣ C# Backend - Program.cs CORS Configuration

Add this to your `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ ADD CORS CONFIGURATION
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")  // Angular dev server
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ USE CORS (must be before UseAuthorization!)
app.UseCors("AllowAngularApp");

app.UseAuthentication();  // If using JWT
app.UseAuthorization();

app.MapControllers();

app.Run();
```

---

## 4️⃣ Common Issues & Solutions

### Issue 1: CORS Error
**Symptom:** Browser console shows "CORS policy" error

**Solution:**
1. Add CORS configuration in Program.cs (see above)
2. Ensure `app.UseCors()` is called BEFORE `app.UseAuthorization()`
3. Restart your C# server

### Issue 2: 401 Unauthorized on Login
**Symptom:** Login returns 401 even with correct credentials

**Possible causes:**
- AuthController expects different property names
- [Authorize] attribute on Login endpoint (should NOT be there!)
- Database query failing

**Check your controller:**
```csharp
[HttpPost("login")]
[AllowAnonymous]  // ✅ Add this if you have global [Authorize]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
```

### Issue 3: 404 Not Found
**Symptom:** Angular gets 404 error

**Check:**
1. C# API is running on `https://localhost:7239`
2. Route is `[Route("api/auth")]` and `[HttpPost("login")]`
3. No typos in URL

### Issue 4: 400 Bad Request
**Symptom:** Server returns 400

**Check:**
1. DTO properties match JSON (case-insensitive by default)
2. Add `[Required]` attributes to DTO if needed
3. Check server logs for validation errors

### Issue 5: SSL Certificate Error
**Symptom:** "NET::ERR_CERT_AUTHORITY_INVALID"

**Solution:**
1. Trust the development certificate:
   ```bash
   dotnet dev-certs https --trust
   ```
2. Or use `http://localhost:5000` instead of `https://localhost:7239`

---

## 5️⃣ Debugging Steps

### In Angular (Browser Console):

Check the interceptor logs:
```
🔐 Auth Interceptor: { url: '...login', isPublicEndpoint: true, hasToken: false }
⏭️ Skipping token for public endpoint
🔐 LOGIN REQUEST: { url: '...', body: { email: '...', password: '...' } }
```

If login succeeds:
```
✅ LOGIN SUCCESS: { token: 'eyJ...', role: 'customer' }
```

If login fails, check Network tab:
- **Status Code:** 401, 400, 404, 500?
- **Response Body:** What error message?
- **Request Headers:** Content-Type is `application/json`?
- **Request Payload:** Email and password are correct?

### In C# (Server Console):

Add logging to your AuthController:
```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
    Console.WriteLine($"🔐 Login attempt: {dto.Email}");
    
    // Your logic here
    
    if (user == null)
    {
        Console.WriteLine("❌ User not found");
        return Unauthorized(new { message = "Invalid credentials" });
    }
    
    Console.WriteLine($"✅ Login successful for: {user.Email}");
    return Ok(new { token = generatedToken, role = user.Role });
}
```

---

## 6️⃣ Test Checklist

- [ ] C# API is running on `https://localhost:7239`
- [ ] CORS is configured in Program.cs
- [ ] AuthController has `[Route("api/auth")]`
- [ ] Login method has `[HttpPost("login")]` and `[AllowAnonymous]`
- [ ] LoginDto has `Email` and `Password` properties
- [ ] Browser console shows interceptor skipping login endpoint
- [ ] Network tab shows request sent with correct JSON body
- [ ] Server responds with token (check Response tab in Network)

---

## 7️⃣ Quick Test

### Test with cURL:
```bash
curl -X POST https://localhost:7239/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -k
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "role": "customer"
}
```

If this works but Angular doesn't, it's a CORS issue!
