using MailKit.Net.Smtp;
using MimeKit;

namespace WasteManagementSystem.API.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public SmtpEmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOtpEmailAsync(string email, string otp)
        {
            var message = new MimeMessage();

            message.From.Add(new MailboxAddress(
                _config["Email:SenderName"],
                _config["Email:SenderEmail"]
            ));

            message.To.Add(MailboxAddress.Parse(email));

            message.Subject = "Password Reset OTP";

            var builder = new BodyBuilder
            {
                HtmlBody = BuildOtpEmailTemplate(otp)
            };
            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();

            await client.AuthenticateAsync(
                _config["Email:Username"],
                _config["Email:Password"]
            );

            await client.SendAsync(message);

            await client.DisconnectAsync(true);
        }

        private string BuildOtpEmailTemplate(string otp)
        {
            return $@"
        <div style='font-family: Arial, sans-serif; background:#f5f7fa; padding:40px'>
            <div style='max-width:500px;margin:auto;background:white;border-radius:8px;padding:30px;text-align:center'>

                <h2 style='color:#0f766e;margin-bottom:20px'>
                    Password Reset
                </h2>

                <p style='color:#444;font-size:15px'>
                    Use the following verification code to reset your password.
                </p>

                <div style='
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:6px;
                    margin:25px 0;
                    color:#0f766e'>
                    {otp}
                </div>

                <p style='color:#666;font-size:14px'>
                    This code will expire in <b>10 minutes</b>.
                </p>

                <hr style='margin:30px 0;border:none;border-top:1px solid #eee'>

                <p style='font-size:12px;color:#999'>
                    If you didn't request this password reset, you can safely ignore this email.
                </p>

                <p style='font-size:12px;color:#999'>
                    WasteWise Security Team
                </p>

            </div>
        </div>";
        }
    }
}
