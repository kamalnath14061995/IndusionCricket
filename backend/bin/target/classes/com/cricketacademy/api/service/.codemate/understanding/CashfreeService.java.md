# CashfreeService: High-Level Documentation

## Overview

The `CashfreeService` class is a Spring-based service designed to interact with the Cashfree Payment Gateway. Its primary responsibility is to create payment orders by communicating with the Cashfree API, supporting both production and sandbox environments.

---

## Key Features

- **Order Creation:** Enables the creation of payment orders via Cashfree.
- **Configurable:** Uses Spring's `@Value` annotations to inject configuration properties (credentials and environment).
- **Environment Awareness:** Selects either the production or sandbox Cashfree endpoint based on configuration.
- **Integration-friendly:** Exposes payment order creation for integration in larger applications.

---

## Main Method

### `createOrder`

- **Purpose:** Initiates an order with Cashfree and retrieves a `payment_session_id` if successful.
- **Inputs:**
  - `orderId`: Unique identifier for the order.
  - `orderAmount`: The order amount as a string (in INR).
  - `customerEmail`: Customer’s email address.
  - `customerPhone`: Customer’s phone number.
- **Process:**
  1. Configures the request with necessary headers (client ID and secret).
  2. Constructs the request body with order and customer details.
  3. Sends a POST request to the appropriate Cashfree order API URL.
  4. Checks response status and extracts `payment_session_id`.
- **Output:** Returns the `payment_session_id` as a string upon success.
- **Error Handling:** Throws a runtime exception if order creation fails.

---

## Dependencies

- **Spring Framework:** For dependency injection and HTTP utilities.
- **RestTemplate:** For RESTful HTTP communication.
- **Cashfree:** External payment gateway for order processing.

---

## Configuration Properties

- `cashfree.appId`: Cashfree application identifier.
- `cashfree.secretKey`: Cashfree secret key.
- `cashfree.env`: Environment (either `PROD` or another value for sandbox).

---

## Intended Usage

This service should be used where payment order initiation via Cashfree is required, such as in checkout workflows of e-commerce or application portals. It encapsulates Cashfree's authentication, request construction, and response handling logic.