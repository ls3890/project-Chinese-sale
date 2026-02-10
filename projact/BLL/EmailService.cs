using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using Microsoft.Extensions.Configuration;

namespace projact.BLL
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var email = new MimeMessage();
            // הגדרת השולח - נלקח מה-appsettings
            email.From.Add(MailboxAddress.Parse(_config["EmailSettings:EmailFrom"]));
            // הגדרת הנמען
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };

            // שימוש מפורש ב-SmtpClient של MailKit
            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            // התחברות לשרת
            await smtp.ConnectAsync(
                _config["EmailSettings:SmtpHost"],
                587,
                SecureSocketOptions.StartTls
            );

            // התחברות עם המייל והסיסמה (ה-16 אותיות)
            await smtp.AuthenticateAsync(
                _config["EmailSettings:EmailFrom"],
                _config["EmailSettings:EmailPassword"]
            );

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}