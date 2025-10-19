package com.cricketacademy.api.controller;

import com.cricketacademy.api.entity.ContactInfo;
import com.cricketacademy.api.service.ContactInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class ContactInfoController {

    private final ContactInfoService contactInfoService;

    /**
     * Get all contact information entries (admin endpoint)
     *
     * @return List of ContactInfo
     */
    @GetMapping
    public ResponseEntity<List<ContactInfo>> getAllContactInfo() {
        try {
            List<ContactInfo> contactInfoList = contactInfoService.getAllContactInfo();
            return ResponseEntity.ok(contactInfoList);
        } catch (Exception e) {
            log.error("Error fetching all contact info: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get contact information by ID (public endpoint)
     *
     * @param id the contact info ID
     * @return ContactInfo
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContactInfo> getContactInfoById(@PathVariable Long id) {
        try {
            ContactInfo contactInfo = contactInfoService.getContactInfoById(id);
            return ResponseEntity.ok(contactInfo);
        } catch (RuntimeException e) {
            log.error("Contact info not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error fetching contact info by ID: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create new contact information (admin endpoint)
     *
     * @param contactInfo the contact info to create
     * @return created ContactInfo
     */
    @PostMapping
    public ResponseEntity<ContactInfo> createContactInfo(@RequestBody ContactInfo contactInfo) {
        try {
            ContactInfo created = contactInfoService.createContactInfo(contactInfo);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            log.error("Error creating contact info: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update contact information by ID (admin endpoint)
     *
     * @param id          the contact info ID to update
     * @param updatedInfo the updated contact info
     * @return updated ContactInfo
     */
    @PutMapping("/{id}")
    public ResponseEntity<ContactInfo> updateContactInfo(@PathVariable Long id, @RequestBody ContactInfo updatedInfo) {
        try {
            ContactInfo updated = contactInfoService.updateContactInfo(id, updatedInfo);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            log.error("Contact info not found for update: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error updating contact info: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete contact information by ID (admin endpoint)
     *
     * @param id the contact info ID to delete
     * @return no content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContactInfo(@PathVariable Long id) {
        try {
            contactInfoService.deleteContactInfo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Contact info not found for deletion: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting contact info: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
