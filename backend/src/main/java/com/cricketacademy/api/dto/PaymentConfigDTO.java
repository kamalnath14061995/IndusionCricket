package com.cricketacademy.api.dto;

import java.util.Map;
import java.util.Set;

public class PaymentConfigDTO {
    private Map<String, Boolean> globalEnabled;
    private Map<String, Set<String>> perUserAllowed;
    private Map<String, Restriction> restrictions;

    public static class Restriction {
        private boolean blocked;
        private String reason;

        public boolean isBlocked() {
            return blocked;
        }

        public void setBlocked(boolean blocked) {
            this.blocked = blocked;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    public Map<String, Boolean> getGlobalEnabled() {
        return globalEnabled;
    }

    public void setGlobalEnabled(Map<String, Boolean> globalEnabled) {
        this.globalEnabled = globalEnabled;
    }

    public Map<String, Set<String>> getPerUserAllowed() {
        return perUserAllowed;
    }

    public void setPerUserAllowed(Map<String, Set<String>> perUserAllowed) {
        this.perUserAllowed = perUserAllowed;
    }

    public Map<String, Restriction> getRestrictions() {
        return restrictions;
    }

    public void setRestrictions(Map<String, Restriction> restrictions) {
        this.restrictions = restrictions;
    }
}
