package com.careeros.service;

import com.careeros.model.JobApplication;
import com.careeros.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledReminderService {

    private final JobApplicationRepository jobApplicationRepository;
    private final EmailService emailService;

    // Runs every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendFollowUpReminders() {
        log.info("Running follow-up reminder job...");

        LocalDate today = LocalDate.now();
        List<JobApplication> allApplications = jobApplicationRepository.findAll();

        int remindersSent = 0;
        for (JobApplication app : allApplications) {
            if (app.getFollowUpDate() != null
                    && app.getFollowUpDate().equals(today)
                    && !app.getStatus().equalsIgnoreCase("REJECTED")
                    && !app.getStatus().equalsIgnoreCase("WITHDRAWN")
                    && !app.getStatus().equalsIgnoreCase("ACCEPTED")) {

                String email = app.getUser().getEmail();
                String firstName = app.getUser().getFirstName();

                emailService.sendFollowUpReminder(
                        email,
                        firstName,
                        app.getCompanyName(),
                        app.getJobTitle()
                );
                remindersSent++;
            }
        }
        log.info("Follow-up reminder job completed. Sent {} reminders.", remindersSent);
    }
}