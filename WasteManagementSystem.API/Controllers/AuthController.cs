using Azure.Core;
using Google.Apis.Auth;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WasteManagementSystem.API.Data;
using WasteManagementSystem.API.DTOs;
using WasteManagementSystem.API.Models;
using WasteManagementSystem.API.Services;

namespace WasteManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthController(
            AppDbContext context,
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            IEmailService emailService
        )
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailService = emailService;
        }

        /// <summary>
        /// Registers a new user account using the specified registration details.
        /// </summary>
        /// <remarks>The method validates the registration data, checks for existing users with the same
        /// email address, and ensures that the password and confirmation password match. Upon successful registration,
        /// the new user is assigned to the 'User' role.</remarks>
        /// <param name="model">An object containing the user's registration information, including email address, password, confirmation
        /// password, and personal details. All required fields must be provided and valid.</param>
        /// <returns>An IActionResult that indicates the outcome of the registration process. Returns a success message if
        /// registration is successful; otherwise, returns an error message describing the reason for failure.</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
                return BadRequest("User already exists.");

            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest("The passwords do not match.");
            }
            var user = new User
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "User");

            return Ok("Registration Successful.");
        }

        /// <summary>
        /// Authenticates a user using the provided login credentials and returns a JSON Web Token (JWT) along with user
        /// information if authentication is successful.
        /// </summary>
        /// <remarks>This method requires valid email and password credentials. If authentication fails,
        /// an Unauthorized response is returned with an appropriate error message.</remarks>
        /// <param name="model">The login credentials containing the user's email and password used to authenticate the user.</param>
        /// <returns>An IActionResult that contains a JWT token, the user's email, and assigned roles if authentication is
        /// successful; otherwise, an Unauthorized result indicating invalid credentials.</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (!result.Succeeded)
                return Unauthorized("Invalid email or password.");

            var roles = await _userManager.GetRolesAsync(user);

            var token = GenerateJwtToken(user, roles);

            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });
            return Ok("Login Successful.");
        }

        /// <summary>
        /// Retrieves the email address and role of the currently authenticated user.
        /// </summary>
        /// <remarks>This method requires the user to be authenticated. It obtains the user's email and
        /// role from the claims associated with the current user.</remarks>
        /// <returns>An object containing the user's email and role. Returns an empty object if the user is not authenticated.</returns>
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new { email, role });
        }

        /// <summary>
        /// Generates a JSON Web Token (JWT) that contains claims for the specified user and their associated roles.
        /// </summary>
        /// <remarks>The generated token includes claims for the user's ID, email, username, and all
        /// provided roles. The token is valid for 2 hours. Ensure that the JWT settings, such as the signing key,
        /// issuer, and audience, are correctly configured in the application's configuration for successful token
        /// generation.</remarks>
        /// <param name="user">The user for whom the JWT is generated. This parameter must not be null and should contain valid user
        /// information.</param>
        /// <param name="roles">A list of roles assigned to the user. Each role is included as a claim in the generated token.</param>
        /// <returns>A string representing the generated JWT, which can be used for authenticating subsequent requests.</returns>
        private string GenerateJwtToken(User user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName),
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Generates a JSON Web Token (JWT) for the specified user to facilitate password reset operations.
        /// </summary>
        /// <remarks>The generated token is valid for 10 minutes and includes claims for the user's
        /// identifier and the password reset purpose. Ensure that the JWT signing key is properly configured in the
        /// application settings to maintain token security.</remarks>
        /// <param name="user">The user for whom the JWT is generated. The user must have a valid identifier.</param>
        /// <returns>A string containing the generated JWT, which can be used to authenticate password reset requests.</returns>
        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("purpose", "password-reset"),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(10),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Authenticates a user using a Google login token and returns a JWT token along with the user's email and
        /// roles.
        /// </summary>
        /// <remarks>If the user does not already exist in the system, a new user account is created using
        /// the email address from the validated Google token. The method then generates a JWT token for the
        /// authenticated user, which can be used for subsequent authorized requests.</remarks>
        /// <param name="dto">A <see cref="GoogleLoginDto"/> containing the Google authentication token to validate and use for login.</param>
        /// <returns>An <see cref="IActionResult"/> containing a JWT token, the authenticated user's email address, and their
        /// assigned roles.</returns>
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(dto.Token);

            var email = payload.Email;

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new User { Email = email, UserName = email };

                await _userManager.CreateAsync(user);
            }
            var roles = await _userManager.GetRolesAsync(user);

            var jwt = GenerateJwtToken(user, roles);

            return Ok(
                new
                {
                    token = jwt,
                    user.Email,
                    roles,
                }
            );
        }

        /// <summary>
        /// Initiates the password reset process by generating and sending a one-time password (OTP) to the email
        /// address associated with the specified user account.
        /// </summary>
        /// <remarks>To prevent information disclosure, this method does not indicate whether the
        /// specified email address is associated with a user account. The generated OTP is valid for 10 minutes and can
        /// only be used once.</remarks>
        /// <param name="forgotPasswordRequest">An object containing the email address of the user requesting a password reset. The email address must be
        /// valid and associated with an existing user account.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns Ok() regardless of whether the email
        /// address exists in the system.</returns>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> SendPasswordResetOtp(
            ForgotPasswordRequestDto forgotPasswordRequest
        )
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(forgotPasswordRequest.Email);

                if (user == null)
                    return Ok(); // don't reveal user existence

                var otp = new Random().Next(100000, 999999).ToString();

                var reset = new PasswordResetOtp
                {
                    UserId = user.Id,
                    OtpCode = otp,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                    IsUsed = false,
                };

                _context.PasswordResetOtps.Add(reset);
                await _context.SaveChangesAsync();

                await _emailService.SendOtpEmailAsync(user.Email, otp);

                return Ok();
            }
            catch
            {
                return BadRequest("OTP failed to send.");
            }
        }

        /// <summary>
        /// Verifies the one-time password (OTP) provided by the user for account recovery.
        /// </summary>
        /// <remarks>This method checks whether the provided OTP matches the most recent, unused OTP
        /// associated with the specified email address and ensures that the OTP has not expired. The email address must
        /// correspond to an existing user account.</remarks>
        /// <param name="request">The request containing the user's email address and the OTP code to be verified.</param>
        /// <returns>An IActionResult that represents the result of the verification. Returns a 200 OK response with a reset
        /// token if the OTP is valid and not expired; otherwise, returns a 400 Bad Request with an error message.</returns>
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
                return BadRequest("Invalid OTP");

            var otp = await _context
                .PasswordResetOtps.Where(x => x.UserId == user.Id && !x.IsUsed)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            if (otp == null || otp.OtpCode != request.OtpCode || otp.ExpiresAt < DateTime.UtcNow)
                return BadRequest("Invalid or expired OTP");

            string resetToken = GenerateJwtToken(user);
            return Ok(new { resetToken });
        }

        /// <summary>
        /// Resets a user's password using a provided reset token and new password.
        /// </summary>
        /// <remarks>The reset token must be valid and specifically issued for password reset purposes.
        /// The method verifies the token, checks that the user exists, and then attempts to reset the password. If the
        /// token is invalid, expired, or not intended for password reset, or if the user does not exist, the operation
        /// fails with an appropriate error message.</remarks>
        /// <param name="request">A <see cref="ResetPasswordRequestDto"/> that contains the password reset token and the new password to set
        /// for the user.</param>
        /// <returns>An <see cref="IActionResult"/> that indicates the result of the password reset operation. Returns <see
        /// cref="OkResult"/> if the password is reset successfully; otherwise, returns <see cref="BadRequestResult"/>
        /// with an error message.</returns>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequestDto request)
        {
            var handler = new JwtSecurityTokenHandler();
            try
            {
                var principal = handler.ValidateToken(
                    request.ResetToken,
                    new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])
                        ),
                    },
                    out var validatedToken
                );

                var purpose = principal.FindFirst("purpose")?.Value;

                if (purpose != "password-reset")
                    return BadRequest("Invalid token");

                var userId = principal.FindFirst("userId")?.Value;

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                    return BadRequest("User not found");

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                var result = await _userManager.ResetPasswordAsync(
                    user,
                    token,
                    request.NewPassword
                );

                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                return Ok("Password reset successful");
            }
            catch
            {
                return BadRequest("Invalid or expired token");
            }
        }
    }
}
