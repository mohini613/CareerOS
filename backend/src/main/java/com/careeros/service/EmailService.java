package com.careeros.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.frontend-url}")
    private String frontendUrl;

    public void sendFollowUpReminder(String toEmail, String firstName,
                                      String company, String position) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Follow-up Reminder: " + position + " at " + company);
            helper.setText(buildFollowUpEmailHtml(firstName, company, position), true);

            mailSender.send(message);
            log.info("Follow-up reminder sent to {} for {} at {}", toEmail, position, company);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendApplicationStatusUpdate(String toEmail, String firstName,
                                             String company, String position, String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Application Update: " + position + " at " + company);
            helper.setText(buildStatusUpdateEmailHtml(firstName, company, position, status), true);

            mailSender.send(message);
            log.info("Status update email sent to {} for {} at {}", toEmail, position, company);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildFollowUpEmailHtml(String firstName, String company, String position) {
        return String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">CareerOS</h1>
                        <p style="color: #e0e0e0; margin: 5px 0 0 0;">Your AI Career Assistant</p>
                    </div>
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333;">Hey %s! 👋</h2>
                        <p style="color: #555; font-size: 16px;">
                            This is a friendly reminder to follow up on your application for
                            <strong>%s</strong> at <strong>%s</strong>.
                        </p>
                        <p style="color: #555;">Following up shows initiative and keeps you top of mind with recruiters!</p>
                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                            <strong>💡 Follow-up Tips:</strong>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Keep it brief and professional</li>
                                <li>Reiterate your interest in the role</li>
                                <li>Mention any new achievements since applying</li>
                            </ul>
                        </div>
                        <a href="%s" style="background: #667eea; color: white; padding: 12px 25px;
                           text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                            View Application →
                        </a>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">
                            You're receiving this because you have a follow-up scheduled in CareerOS.
                        </p>
                    </div>
                </body>
                </html>
                """, firstName, position, company, frontendUrl);
    }

    private String buildStatusUpdateEmailHtml(String firstName, String company,
                                               String position, String status) {
        String emoji = switch (status.toUpperCase()) {
            case "INTERVIEW" -> "🎉";
            case "OFFER" -> "🎊";
            case "REJECTED" -> "💪";
            case "SCREENING" -> "📞";
            default -> "📋";
        };

        return String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">CareerOS</h1>
                        <p style="color: #e0e0e0; margin: 5px 0 0 0;">Your AI Career Assistant</p>
                    </div>
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333;">Hey %s! %s</h2>
                        <p style="color: #555; font-size: 16px;">
                            Your application for <strong>%s</strong> at <strong>%s</strong>
                            has been updated to: <strong>%s</strong>
                        </p>
                        <a href="%s" style="background: #667eea; color: white; padding: 12px 25px;
                           text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                            View Application →
                        </a>
                    </div>
                </body>
                </html>
                """, firstName, emoji, position, company, status, frontendUrl);
    }
}