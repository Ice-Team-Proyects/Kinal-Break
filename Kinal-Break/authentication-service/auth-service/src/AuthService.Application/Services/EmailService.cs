using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MailKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using AuthService.Application.Interfaces;
using System.IO;

namespace AuthService.Application.Services;

public class EmailService(IConfiguration configuration, ILogger<EmailService> logger) : IEmailService
{
    public async Task SendEmailVerificationAsync(string email, string username, string token)
    {
        var subject = "Verifica tu dirección de correo electrónico";
        var verificationUrl = $"{configuration["AppSettings:FrontendUrl"]}/verify-email?token={token}";
                var body = $@"
                                <div style='font-family: Inter, Arial, Helvetica, sans-serif; background:#f5f7fb; padding:40px'>
                                    <div style='max-width:650px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e6e9ef;box-shadow:0 8px 24px rgba(4,12,30,0.06)'>
                                        <div style='padding:20px 28px;display:flex;align-items:center;gap:12px'>
                                            <img src='{configuration["AppSettings:Assets:LogoUrl"] ?? ""}' alt='Kinal-Break' style='height:44px' />
                                            <h2 style='margin:0;font-size:20px;color:#031633;font-weight:800'>Kinal-Break</h2>
                                        </div>
                                        <div style='padding:28px;color:#111'>
                                            <h3 style='color:#031633;margin-top:0'>¡Hola {username}!</h3>
                                            <p style='color:#4b5563'>Gracias por crear una cuenta en Kinal-Break. Para completar tu registro, verifica tu correo electrónico pulsando el botón a continuación.</p>
                                            <div style='text-align:center;margin:28px 0'>
                                                <a href='{verificationUrl}' style='background:#ff8928;color:#fff;padding:14px 26px;border-radius:12px;text-decoration:none;font-weight:800;display:inline-block'>Verificar correo</a>
                                            </div>
                                            <p style='font-size:13px;color:#6b7280'>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
                                            <p style='font-size:13px;color:#6b7280;word-break:break-all'>{verificationUrl}</p>
                                            <p style='font-size:13px;color:#6b7280'>Este enlace expirará en 24 horas. Si no solicitaste este registro, puedes ignorar este correo.</p>
                                        </div>
                                        <div style='background:#fafafa;padding:16px;text-align:center;color:#9aa3b2;font-size:13px'>© {DateTime.UtcNow.Year} Kinal-Break</div>
                                    </div>
                                </div>
                        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendPasswordResetAsync(string email, string username, string token)
    {
        var subject = "Restablece tu contraseña";
        var resetUrl = $"{configuration["AppSettings:FrontendUrl"]}/reset-password?token={token}";

        var body = $@"
            <h2>Solicitud de Restablecimiento de Contraseña</h2>
            <p>Hola {username},</p>
            <p>Solicitaste restablecer tu contraseña. Haz clic en el enlace a continuación para restablecerla:</p>
            <a href='{resetUrl}' style='background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                Restablecer Contraseña
            </a>
            <p>Si no puedes hacer clic en el enlace, copia y pega esta URL en tu navegador:</p>
            <p>{resetUrl}</p>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.</p>
        ";

        await SendEmailAsync(email, subject, body);
    }
 
    public async Task SendWelcomeEmailAsync(string email, string username)
    {
        var subject = "¡Bienvenido a Kinal Break!";

                var body = $@"
                        <div style='font-family: Inter, Arial, Helvetica, sans-serif; background:#f5f7fb; padding:40px'>
                            <div style='max-width:650px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e6e9ef;box-shadow:0 8px 24px rgba(4,12,30,0.06)'>
                                <div style='padding:20px 28px;display:flex;align-items:center;gap:12px'>
                                    <img src='{configuration["AppSettings:Assets:LogoUrl"] ?? ""}' alt='Kinal-Break' style='height:44px' />
                                    <h2 style='margin:0;font-size:20px;color:#031633;font-weight:800'>Kinal-Break</h2>
                                </div>
                                <div style='padding:28px;color:#111'>
                                    <h3 style='color:#031633;margin-top:0'>¡Hola {username}!</h3>
                                    <p style='color:#4b5563'>Tu cuenta ha sido verificada y activada exitosamente.</p>
                                    <p style='color:#4b5563'>Ya puedes iniciar sesión y comenzar a usar Kinal-Break.</p>
                                    <div style='text-align:center;margin-top:20px'>
                                        <a href='{configuration["AppSettings:FrontendUrl"] ?? ""}/login' style='background:#ff8928;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block'>Iniciar sesión</a>
                                    </div>
                                </div>
                                <div style='background:#fafafa;padding:16px;text-align:center;color:#9aa3b2;font-size:13px'>© {DateTime.UtcNow.Year} Kinal-Break</div>
                            </div>
                        </div>
                ";

        await SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpSettings = configuration.GetSection("SmtpSettings");

        try
        {
            // Verificar si el email está habilitado
            var enabled = bool.Parse(smtpSettings["Enabled"] ?? "true");
            if (!enabled)
            {
                logger.LogInformation("El envío de emails está deshabilitado en la configuración. Omitiendo envío");
                return;
            }

            // Validar configuración
            var host = smtpSettings["Host"];
            var portString = smtpSettings["Port"];
            var username = smtpSettings["Username"];
            var password = smtpSettings["Password"];
            var fromEmail = smtpSettings["FromEmail"];
            var fromName = smtpSettings["FromName"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                logger.LogError("La configuración SMTP no está configurada correctamente");
                throw new InvalidOperationException("La configuración SMTP no está configurada correctamente");
            }

            // Avoid logging sensitive SMTP details

            var port = int.Parse(portString ?? "587");

            var protocolLogPath = smtpSettings["ProtocolLogPath"];
            if (!string.IsNullOrWhiteSpace(protocolLogPath))
            {
                var logDir = Path.GetDirectoryName(protocolLogPath);
                if (!string.IsNullOrWhiteSpace(logDir))
                {
                    Directory.CreateDirectory(logDir);
                }
                logger.LogInformation("SMTP protocol logging enabled at {ProtocolLogPath}", protocolLogPath);
            }

            using var protocolLogger = !string.IsNullOrWhiteSpace(protocolLogPath)
                ? new ProtocolLogger(protocolLogPath)
                : null;

            using var client = protocolLogger != null
                ? new SmtpClient(protocolLogger)
                : new SmtpClient();

            // Configurar timeout
            var timeoutMs = int.Parse(smtpSettings["Timeout"] ?? "30000");
            client.Timeout = timeoutMs;

            try
            {
                // Configurar validación de certificados SSL
                var ignoreCertErrors = bool.Parse(smtpSettings["IgnoreCertificateErrors"] ?? "false");
                if (ignoreCertErrors)
                {
                    logger.LogWarning("Validación de certificados SSL deshabilitada. Solo usar en desarrollo.");
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                }
                
                // Verificar configuración de SSL implícito
                var useImplicitSsl = bool.Parse(smtpSettings["UseImplicitSsl"] ?? "false");

                // Configuración específica por puerto y SSL
                if (useImplicitSsl || port == 465)
                {
                    await client.ConnectAsync(host, port, SecureSocketOptions.SslOnConnect);
                }
                else if (port == 587)
                {
                    await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                }
                else
                {
                    await client.ConnectAsync(host, port, SecureSocketOptions.Auto);
                }

                // Autenticación
                await client.AuthenticateAsync(username, password);

                // Crear mensaje con MimeKit
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromEmail));
                message.To.Add(new MailboxAddress("", to));
                message.Subject = subject;
                message.Body = new TextPart("html") { Text = body };

                // Enviar
                await client.SendAsync(message);
                logger.LogInformation("Email enviado exitosamente");

                await client.DisconnectAsync(true);
                logger.LogInformation("Pipeline de email completado");
            }
            catch (MailKit.Security.AuthenticationException authEx)
            {
                logger.LogError(authEx, "La autenticación de Gmail falló. Verifica la contraseña de aplicación.");
                throw new InvalidOperationException($"La autenticación de Gmail falló: {authEx.Message}. Por favor, verifica la contraseña de aplicación.", authEx);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error al enviar el email");
                throw;
            }
            logger.LogInformation("Email processed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al enviar el email");

            // Verificar si usar fallback
            var useFallback = bool.Parse(smtpSettings["UseFallback"] ?? "false");
            if (useFallback)
            {
                logger.LogWarning("Usando respaldo de email. El email no se envió, pero la acción continúa.");
                logger.LogWarning("Email fallback details: To={To}, Subject={Subject}", to, subject);
                logger.LogInformation("Email body preview:\n{Body}", body.Length > 500 ? body[..500] + "..." : body);
                return; // No fallar, solo logear
            }

            throw new InvalidOperationException($"Error al enviar el email: {ex.Message}", ex);
        }
    }
}

