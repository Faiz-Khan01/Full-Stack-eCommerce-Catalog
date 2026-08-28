package com.ecom.productcatalog.dto;

public class TicketStatusRequest {

    private String status;

    public TicketStatusRequest() {
    }

    public TicketStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}