using projact.models;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string? Address { get; set; } 
    public string PasswordHash { get; set; }

    public string Role { get; set; }
    // קשר: משתמש יכול לבצע הרבה רכישות- יחס אחד לרבים
    public ICollection<Purchases> Purchases { get; set; }
}
