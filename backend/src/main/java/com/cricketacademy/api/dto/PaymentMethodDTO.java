package com.cricketacademy.api.dto;

public class PaymentMethodDTO {
    private String key;
    private String label;
    private String type;
    private String provider;

    public PaymentMethodDTO() {
    }

    public PaymentMethodDTO(String key, String label, String type, String provider) {
        this.key = key;
        this.label = label;
        this.type = type;
        this.provider = provider;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }
}
