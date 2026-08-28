package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.SupportTicketDTO;
import com.ecom.productcatalog.dto.SupportTicketRequest;
import com.ecom.productcatalog.model.SupportTicket;
import com.ecom.productcatalog.repository.SupportTicketRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Transactional
public class SupportTicketService {

    private final SupportTicketRepository repository;
    private final EmailService emailService;

    public SupportTicketService(
            SupportTicketRepository repository,
            EmailService emailService
    ) {
        this.repository = repository;
        this.emailService = emailService;
    }

    // =========================================================
    // CONSTANTS
    // =========================================================

    private static final String STATUS_OPEN = "OPEN";
    private static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    private static final String STATUS_RESOLVED = "RESOLVED";
    private static final String STATUS_CLOSED = "CLOSED";

    private static final String PRIORITY_LOW = "LOW";
    private static final String PRIORITY_NORMAL = "NORMAL";
    private static final String PRIORITY_HIGH = "HIGH";
    private static final String PRIORITY_URGENT = "URGENT";


    // =========================================================
    // CUSTOMER: CREATE SUPPORT TICKET
    // =========================================================
    //
    // POST /api/support/tickets
    //
    // =========================================================

    public SupportTicketDTO createTicket(
            SupportTicketRequest request
    ) {

        // -----------------------------------------------------
        // Validate request
        // -----------------------------------------------------

        validateRequest(request);

        // -----------------------------------------------------
        // Create entity
        // -----------------------------------------------------

        SupportTicket ticket = new SupportTicket();

        ticket.setEmail(
                request.getEmail()
                        .trim()
                        .toLowerCase(Locale.ROOT)
        );

        ticket.setCategory(
                request.getCategory()
                        .trim()
                        .toUpperCase(Locale.ROOT)
        );

        ticket.setSubject(
                request.getSubject()
                        .trim()
        );

        ticket.setMessage(
                request.getMessage()
                        .trim()
        );

        ticket.setPriority(
                normalizePriority(
                        request.getPriority()
                )
        );

        ticket.setStatus(
                STATUS_OPEN
        );

        // -----------------------------------------------------
        // Save ticket
        // -----------------------------------------------------

        SupportTicket savedTicket =
                repository.save(ticket);

        // -----------------------------------------------------
        // Send admin notification
        // -----------------------------------------------------

        sendAdminNotificationSafely(savedTicket);

        // -----------------------------------------------------
        // Return DTO
        // -----------------------------------------------------

        return convertToDTO(savedTicket);
    }


    // =========================================================
    // CUSTOMER / ADMIN: GET TICKET BY ID
    // =========================================================
    //
    // GET /api/support/tickets/{id}
    //
    // =========================================================

    @Transactional(readOnly = true)
    public SupportTicketDTO getTicketById(
            Long id
    ) {

        SupportTicket ticket =
                getEntityById(id);

        return convertToDTO(ticket);
    }


    // =========================================================
    // CUSTOMER: GET TICKETS BY EMAIL
    // =========================================================
    //
    // GET /api/support/tickets/customer?email=...
    //
    // =========================================================

    @Transactional(readOnly = true)
    public List<SupportTicketDTO> getTicketsByEmail(
            String email
    ) {

        String normalizedEmail =
                validateAndNormalizeEmail(email);

        return repository
                .findByEmailOrderByCreatedAtDesc(
                        normalizedEmail
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // ADMIN: GET ALL TICKETS
    // =========================================================
    //
    // GET /api/support/admin/tickets
    //
    // =========================================================

    @Transactional(readOnly = true)
    public List<SupportTicketDTO> getAllTickets() {

        return repository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // ADMIN: GET TICKETS BY STATUS
    // =========================================================
    //
    // GET /api/support/admin/tickets/status/{status}
    //
    // =========================================================

    @Transactional(readOnly = true)
    public List<SupportTicketDTO> getTicketsByStatus(
            String status
    ) {

        String normalizedStatus =
                normalizeAndValidateStatus(status);

        return repository
                .findByStatusOrderByCreatedAtDesc(
                        normalizedStatus
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // ADMIN: UPDATE STATUS
    // =========================================================
    //
    // PUT /api/support/admin/tickets/{id}/status?status=RESOLVED
    //
    // =========================================================

    public SupportTicketDTO updateStatus(
            Long id,
            String status
    ) {

        validateId(id);

        String normalizedStatus =
                normalizeAndValidateStatus(status);

        SupportTicket ticket =
                getEntityById(id);

        ticket.setStatus(
                normalizedStatus
        );

        SupportTicket updatedTicket =
                repository.save(ticket);

        return convertToDTO(updatedTicket);
    }


    // =========================================================
    // ADMIN: UPDATE PRIORITY
    // =========================================================
    //
    // PUT /api/support/admin/tickets/{id}/priority?priority=HIGH
    //
    // =========================================================

    public SupportTicketDTO updatePriority(
            Long id,
            String priority
    ) {

        validateId(id);

        String normalizedPriority =
                normalizeAndValidatePriority(priority);

        SupportTicket ticket =
                getEntityById(id);

        ticket.setPriority(
                normalizedPriority
        );

        SupportTicket updatedTicket =
                repository.save(ticket);

        return convertToDTO(updatedTicket);
    }


    // =========================================================
    // ADMIN: REPLY TO TICKET
    // =========================================================
    //
    // POST /api/support/admin/tickets/{id}/reply
    //
    // =========================================================

    public SupportTicketDTO replyToTicket(
            Long id,
            String replyMessage
    ) {

        // -----------------------------------------------------
        // Validate ID
        // -----------------------------------------------------

        validateId(id);

        // -----------------------------------------------------
        // Validate reply
        // -----------------------------------------------------

        if (replyMessage == null ||
                replyMessage.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Reply message is required."
            );
        }

        String normalizedReply =
                replyMessage.trim();

        if (normalizedReply.length() < 2) {

            throw new IllegalArgumentException(
                    "Reply message must contain at least 2 characters."
            );
        }

        if (normalizedReply.length() > 5000) {

            throw new IllegalArgumentException(
                    "Reply message cannot exceed 5000 characters."
            );
        }

        // -----------------------------------------------------
        // Find ticket
        // -----------------------------------------------------

        SupportTicket ticket =
                getEntityById(id);

        // -----------------------------------------------------
        // Save reply
        // -----------------------------------------------------

        ticket.setReplyMessage(
                normalizedReply
        );

        ticket.setRepliedAt(
                LocalDateTime.now()
        );

        // -----------------------------------------------------
        // Automatically mark as resolved
        // -----------------------------------------------------

        ticket.setStatus(
                STATUS_RESOLVED
        );

        // -----------------------------------------------------
        // Save
        // -----------------------------------------------------

        SupportTicket updatedTicket =
                repository.save(ticket);

        // -----------------------------------------------------
        // Optional customer email
        // -----------------------------------------------------
        //
        // If your EmailService has a customer-reply method,
        // call it here.
        //
        // Do NOT add a method call unless EmailService actually
        // contains that method.
        //
        // -----------------------------------------------------

        return convertToDTO(updatedTicket);
    }


    // =========================================================
    // ADMIN: DELETE TICKET
    // =========================================================
    //
    // DELETE /api/support/admin/tickets/{id}
    //
    // =========================================================

    public void deleteTicket(
            Long id
    ) {

        // -----------------------------------------------------
        // Validate ID
        // -----------------------------------------------------

        validateId(id);

        // -----------------------------------------------------
        // Check ticket exists
        // -----------------------------------------------------

        if (!repository.existsById(id)) {

            throw new IllegalArgumentException(
                    "Support ticket not found."
            );
        }

        // -----------------------------------------------------
        // Delete
        // -----------------------------------------------------

        repository.deleteById(id);
    }


    // =========================================================
    // VALIDATE CREATE REQUEST
    // =========================================================

    private void validateRequest(
            SupportTicketRequest request
    ) {

        // -----------------------------------------------------
        // Request
        // -----------------------------------------------------

        if (request == null) {

            throw new IllegalArgumentException(
                    "Support ticket data is required."
            );
        }


        // -----------------------------------------------------
        // Email
        // -----------------------------------------------------

        validateAndNormalizeEmail(
                request.getEmail()
        );


        // -----------------------------------------------------
        // Category
        // -----------------------------------------------------

        if (request.getCategory() == null ||
                request.getCategory().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Support category is required."
            );
        }

        String category =
                request.getCategory().trim();

        if (category.length() > 50) {

            throw new IllegalArgumentException(
                    "Category cannot exceed 50 characters."
            );
        }


        // -----------------------------------------------------
        // Subject
        // -----------------------------------------------------

        if (request.getSubject() == null ||
                request.getSubject().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Subject is required."
            );
        }

        String subject =
                request.getSubject().trim();

        if (subject.length() < 5) {

            throw new IllegalArgumentException(
                    "Subject must contain at least 5 characters."
            );
        }

        if (subject.length() > 120) {

            throw new IllegalArgumentException(
                    "Subject cannot exceed 120 characters."
            );
        }


        // -----------------------------------------------------
        // Message
        // -----------------------------------------------------

        if (request.getMessage() == null ||
                request.getMessage().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Message is required."
            );
        }

        String message =
                request.getMessage().trim();

        if (message.length() < 20) {

            throw new IllegalArgumentException(
                    "Message must contain at least 20 characters."
            );
        }

        if (message.length() > 2000) {

            throw new IllegalArgumentException(
                    "Message cannot exceed 2000 characters."
            );
        }


        // -----------------------------------------------------
        // Priority
        // -----------------------------------------------------

        if (request.getPriority() != null &&
                !request.getPriority().trim().isEmpty()) {

            normalizeAndValidatePriority(
                    request.getPriority()
            );
        }
    }


    // =========================================================
    // EMAIL VALIDATION
    // =========================================================

    private String validateAndNormalizeEmail(
            String email
    ) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        String normalizedEmail =
                email.trim()
                        .toLowerCase(Locale.ROOT);

        if (normalizedEmail.length() > 255) {

            throw new IllegalArgumentException(
                    "Email cannot exceed 255 characters."
            );
        }

        if (!isValidEmail(normalizedEmail)) {

            throw new IllegalArgumentException(
                    "Please enter a valid email address."
            );
        }

        return normalizedEmail;
    }


    // =========================================================
    // EMAIL FORMAT VALIDATION
    // =========================================================

    private boolean isValidEmail(
            String email
    ) {

        return email.matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
        );
    }


    // =========================================================
    // NORMALIZE PRIORITY
    // =========================================================

    private String normalizePriority(
            String priority
    ) {

        if (priority == null ||
                priority.trim().isEmpty()) {

            return PRIORITY_NORMAL;
        }

        return priority
                .trim()
                .toUpperCase(Locale.ROOT);
    }


    // =========================================================
    // VALIDATE PRIORITY
    // =========================================================

    private String normalizeAndValidatePriority(
            String priority
    ) {

        if (priority == null ||
                priority.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Priority is required."
            );
        }

        String normalizedPriority =
                priority
                        .trim()
                        .toUpperCase(Locale.ROOT);

        if (!normalizedPriority.equals(PRIORITY_LOW) &&
                !normalizedPriority.equals(PRIORITY_NORMAL) &&
                !normalizedPriority.equals(PRIORITY_HIGH) &&
                !normalizedPriority.equals(PRIORITY_URGENT)) {

            throw new IllegalArgumentException(
                    "Priority must be LOW, NORMAL, HIGH or URGENT."
            );
        }

        return normalizedPriority;
    }


    // =========================================================
    // VALIDATE STATUS
    // =========================================================

    private String normalizeAndValidateStatus(
            String status
    ) {

        if (status == null ||
                status.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Status is required."
            );
        }

        String normalizedStatus =
                status
                        .trim()
                        .toUpperCase(Locale.ROOT);

        if (!normalizedStatus.equals(STATUS_OPEN) &&
                !normalizedStatus.equals(STATUS_IN_PROGRESS) &&
                !normalizedStatus.equals(STATUS_RESOLVED) &&
                !normalizedStatus.equals(STATUS_CLOSED)) {

            throw new IllegalArgumentException(
                    "Status must be OPEN, IN_PROGRESS, RESOLVED or CLOSED."
            );
        }

        return normalizedStatus;
    }


    // =========================================================
    // VALIDATE ID
    // =========================================================

    private void validateId(
            Long id
    ) {

        if (id == null) {

            throw new IllegalArgumentException(
                    "Ticket ID is required."
            );
        }

        if (id <= 0) {

            throw new IllegalArgumentException(
                    "Ticket ID must be greater than zero."
            );
        }
    }


    // =========================================================
    // GET ENTITY BY ID
    // =========================================================

    private SupportTicket getEntityById(
            Long id
    ) {

        validateId(id);

        return repository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Support ticket not found."
                        )
                );
    }


    // =========================================================
    // SEND ADMIN NOTIFICATION
    // =========================================================

    private void sendAdminNotificationSafely(
            SupportTicket ticket
    ) {

        try {

            emailService.sendAdminSupportTicketAlert(
                    ticket.getId(),
                    ticket.getEmail(),
                    ticket.getCategory(),
                    ticket.getSubject(),
                    ticket.getMessage(),
                    ticket.getPriority()
            );

        } catch (Exception e) {

            System.err.println(
                    "Support ticket #" +
                            ticket.getId() +
                            " was saved, but admin email notification failed: " +
                            e.getMessage()
            );
        }
    }


    // =========================================================
    // ENTITY -> DTO
    // =========================================================

    private SupportTicketDTO convertToDTO(
            SupportTicket ticket
    ) {

        if (ticket == null) {
            return null;
        }

        SupportTicketDTO dto =
                new SupportTicketDTO();

        dto.setId(
                ticket.getId()
        );

        dto.setEmail(
                ticket.getEmail()
        );

        dto.setCategory(
                ticket.getCategory()
        );

        dto.setSubject(
                ticket.getSubject()
        );

        dto.setMessage(
                ticket.getMessage()
        );

        dto.setPriority(
                ticket.getPriority()
        );

        dto.setStatus(
                ticket.getStatus()
        );

        dto.setCreatedAt(
                ticket.getCreatedAt()
        );

        dto.setUpdatedAt(
                ticket.getUpdatedAt()
        );

        // -----------------------------------------------------
        // Reply fields
        // -----------------------------------------------------

        dto.setReplyMessage(
                ticket.getReplyMessage()
        );

        dto.setRepliedAt(
                ticket.getRepliedAt()
        );

        return dto;
    }
}