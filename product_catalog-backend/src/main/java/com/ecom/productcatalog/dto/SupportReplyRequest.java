package com.ecom.productcatalog.dto;

public class SupportReplyRequest {

    private String message;

    public SupportReplyRequest() {
    }

    public SupportReplyRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}