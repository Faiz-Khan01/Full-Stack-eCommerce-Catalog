package com.ecom.productcatalog.dto;

public class SupportTicketRequest {

    private String email;
    private String category;
    private String subject;
    private String message;
    private String priority;

    public SupportTicketRequest() {
    }

    public SupportTicketRequest(
            String email,
            String category,
            String subject,
            String message,
            String priority
    ) {
        this.email = email;
        this.category = category;
        this.subject = subject;
        this.message = message;
        this.priority = priority;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}