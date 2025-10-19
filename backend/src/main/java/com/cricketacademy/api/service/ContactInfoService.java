package com.cricketacademy.api.service;

import com.cricketacademy.api.entity.ContactInfo;
import com.cricketacademy.api.repository.ContactInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for ContactInfo operations
 * Handles business logic for contact information management
 * Supports multiple contact info entries with full CRUD operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContactInfoService {

    private final ContactInfoRepository contactInfoRepository;

    /**
     * Get all contact information entries
     *
     * @return List of all ContactInfo objects
     */
    public List<ContactInfo> getAllContactInfo() {
        log.info("Fetching all contact information");
        return contactInfoRepository.findAll();
    }

    /**
     * Get contact information by ID
     *
     * @param id the contact info ID
     * @return ContactInfo object if found
     * @throws RuntimeException if not found
     */
    public ContactInfo getContactInfoById(Long id) {
        log.info("Fetching contact information with ID: {}", id);
        return contactInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact info not found with ID: " + id));
    }

    /**
     * Create new contact information
     *
     * @param contactInfo the contact info to create
     * @return the saved ContactInfo
     */
    @Transactional
    public ContactInfo createContactInfo(ContactInfo contactInfo) {
        log.info("Creating new contact information");
        // Ensure id is null for new entries to allow auto-generation
        contactInfo.setId(null);
        ContactInfo saved = contactInfoRepository.save(contactInfo);
        log.info("Contact information created successfully with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Update existing contact information
     *
     * @param id          the contact info ID to update
     * @param updatedInfo the updated contact info data
     * @return the updated ContactInfo
     * @throws RuntimeException if not found
     */
    @Transactional
    public ContactInfo updateContactInfo(Long id, ContactInfo updatedInfo) {
        log.info("Updating contact information with ID: {}", id);

        ContactInfo existing = contactInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact info not found with ID: " + id));

        existing.setAddress(updatedInfo.getAddress());
        existing.setPhone(updatedInfo.getPhone());
        existing.setEmail(updatedInfo.getEmail());

        ContactInfo saved = contactInfoRepository.save(existing);
        log.info("Contact information updated successfully with ID: {}", id);
        return saved;
    }

    /**
     * Delete contact information by ID
     *
     * @param id the contact info ID to delete
     * @throws RuntimeException if not found
     */
    @Transactional
    public void deleteContactInfo(Long id) {
        log.info("Deleting contact information with ID: {}", id);

        if (!contactInfoRepository.existsById(id)) {
            throw new RuntimeException("Contact info not found with ID: " + id);
        }

        contactInfoRepository.deleteById(id);
        log.info("Contact information deleted successfully with ID: {}", id);
    }
}
