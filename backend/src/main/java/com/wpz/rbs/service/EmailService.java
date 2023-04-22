package com.wpz.rbs.service;

import com.wpz.rbs.model.Reservation;
import com.wpz.rbs.model.Room;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${spring.mail.username}")
    private String from;

    @Value("${email}")
    private String adminEmail;

    private final JavaMailSender emailSender;
    private final SpringTemplateEngine thymeleafTemplateEngine;
    private final RoomService roomService;

    public EmailService(JavaMailSender emailSender, SpringTemplateEngine thymeleafTemplateEngine, RoomService roomService) {
        this.emailSender = emailSender;
        this.thymeleafTemplateEngine = thymeleafTemplateEngine;
        this.roomService = roomService;

    }

    public void sendMessageToAdmin(Reservation reservation) {
        Room room = roomService.getById(reservation.getRoom_id());
        String subject = "[System rezerwacji sal] Nowa rezerwacja #" + reservation.getId() + " w sali " + room.getNumber();

        Map<String, Object> model = new HashMap<>();
        model.put("reservation_name", reservation.getName());
        model.put("first_name", reservation.getFirst_name());
        model.put("last_name", reservation.getLast_name());
        model.put("room_number", room.getNumber());
        model.put("start_time", reservation.getStart_time());
        model.put("end_time", reservation.getEnd_time());
        model.put("requester_email", reservation.getEmail());
        model.put("link", "http://localhost:5173/reservations/" + reservation.getId());

        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(model);

        String htmlBody = thymeleafTemplateEngine.process("admin-message.html", thymeleafContext);
        try {
            sendHtmlMessage(adminEmail, subject, htmlBody);
        } catch (MessagingException e) {
            System.err.println("Email was not send successfully");
        }
    }

    public void sendDeclinedMessageToUser(Reservation reservation) {
        Room room = roomService.getById(reservation.getRoom_id());
        String subject = "[System rezerwacji sal] Informacje o rezerwacji #" + reservation.getId() + " \"" + reservation.getName().toLowerCase() + "\"";

        Map<String, Object> model = new HashMap<>();
        model.put("reservation_name", reservation.getName());
        model.put("room_number", room.getNumber());
        model.put("start_time", reservation.getStart_time());
        model.put("end_time", reservation.getEnd_time());

        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(model);

        String htmlBody = thymeleafTemplateEngine.process("user-decline-message.html", thymeleafContext);
        try {
            sendHtmlMessage(reservation.getEmail(), subject, htmlBody);
        } catch (MessagingException e) {
            System.err.println("Email was not send successfully");
        }
    }

    private void sendHtmlMessage(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        emailSender.send(message);
    }
}