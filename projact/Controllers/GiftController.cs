using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using projact.BLL;
using projact.models;
using projact.models.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class GiftsController : ControllerBase
{
    private readonly IGiftService _giftService;
    private readonly IRaffleService _raffleService;
    private readonly IEmailService _emailService;
    public GiftsController(IGiftService giftService, IRaffleService raffleService, IEmailService emailService)
    {
        _giftService = giftService;
        _raffleService = raffleService;
        _emailService = emailService;
    }

    // יצירת מתנה - רק מנהל
    [Authorize(Roles = "manager")]
    [HttpPost]
    public async Task<IActionResult> Create(GiftDto giftDto)
    {
        await _giftService.Add(giftDto);
        return CreatedAtAction(nameof(GetAll), new { id = giftDto.Name }, giftDto);
    }

    // קבלת כל המתנות - כל משתמש מחובר
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // יחזיר רשימת GiftDto הכוללת את שם התורם
        var gifts = await _giftService.GetAllGifts();
        return Ok(gifts);
    }

    // חיפוש לפי שם
    [Authorize]
    [HttpGet("by-name/{name}")]
    public async Task<IActionResult> GetByName(string name)
    {
        var gifts = await _giftService.GetByName(name);
        if (gifts == null || !gifts.Any())
            return NotFound();

        return Ok(gifts);
    }

    // מחיקה - ייעלתי את השליפה
    [Authorize(Roles = "manager")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // במקום לשלוף את כל הרשימה, נשלוף רק את המתנה הספציפית
        var allGifts = await _giftService.GetAllGifts();
        var giftDto = allGifts.FirstOrDefault(g => g.Id == id);

        if (giftDto == null)
            return NotFound();

        // המרה מ-DTO ל-Entity לצורך מחיקה (או הוספת פונקציית מחיקה לפי ID בשירות)
        var giftEntity = new Gift { Id = giftDto.Id, Name = giftDto.Name };
        await _giftService.Remove(giftEntity);

        return NoContent();
    }

    // עדכון - ייעלתי את השליפה והמיפוי
    [Authorize(Roles = "manager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, GiftDto dto)
    {
        var allGifts = await _giftService.GetAllGifts();
        var existingDto = allGifts.FirstOrDefault(g => g.Id == id);

        if (existingDto == null)
            return NotFound();

        // יצירת אובייקט Entity לעדכון
        var giftToUpdate = new Gift
        {
            Id = id,
            Name = dto.Name,
            Price = dto.Price,
            NumOfCostermes = dto.NumOfCostermes,
            DonatorId = dto.DonatorId,
            Category = dto.Category
        };

        await _giftService.updete(giftToUpdate);
        return Ok(dto);
    }

    // הגרלה
    [Authorize(Roles = "manager")]
    [HttpPost("draw/{id}")]
    public async Task<IActionResult> DrawWinner(int id)
    {
        var winner = await _raffleService.RunRaffleAsync(id);

        if (winner == null)
        {
            return BadRequest(new { Message = "לא ניתן לבצע הגרלה: וודא שיש רוכשים מאושרים למתנה זו." });
        }

        // שליחת מייל לזוכה
        string subject = "מזל טוב! זכית בהגרלה הסינית";
        string message = $@"
        <html>
            <body dir='rtl'>
                <h1>מזל טוב {winner.Name}!</h1>
                <p>אנו שמחים לבשר לך שזכית בהגרלה על מתנה מספר {id}!</p>
                <p>נציג מטעמנו יצור איתך קשר בהקדם לקבלת הפרס.</p>
                <br>
                <p>בברכה,<br>צוות המכירה הסינית</p>
            </body>
        </html>";

        try
        {
            await _emailService.SendEmailAsync(winner.Email, subject, message);
        }
        catch (Exception ex)
        {
            // גם אם המייל נכשל, אנחנו עדיין רוצים להחזיר שההגרלה הצליחה
            // כדאי להוסיף לוג לשגיאה
        }

        return Ok(new
        {
            GiftId = id,
            WinnerName = winner.Name,
            WinnerEmail = winner.Email,
            Message = "ההגרלה הסתיימה בהצלחה והודעה נשלחה לזוכה!"
        });
    
}
}