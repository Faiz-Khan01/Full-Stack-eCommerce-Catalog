package com.ecom.productcatalog.dto;

public class TicketPriorityRequest {
    private String priority;

    public TicketPriorityRequest() {}

    public TicketPriorityRequest(String priority) {
        this.priority = priority;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}