# PaymentController - High-Level Documentation

## Overview

`PaymentController` is a REST API controller for handling payment-related requests in the Cricket Academy application. It provides endpoints under `/api/payment` for operations pertaining to creating and managing payment orders via a payment service provider (Cashfree).

## Dependencies

- **CashfreeService**: A service component that encapsulates business logic for interacting with the Cashfree payment gateway.

## Endpoints

### 1. Create Cashfree Order

- **URL**: `/api/payment/create-order`
- **Method**: `POST`
- **Request Body**: JSON object with the following fields:
    - `orderId`: Unique identifier for the order.
    - `orderAmount`: The total amount for the order.
    - `customerEmail`: The email address of the customer.
    - `customerPhone`: The phone number of the customer.

#### Processing Steps:
- Receives a payment creation request with order and customer details.
- Delegates to `CashfreeService.createOrder` to create a payment order with Cashfree.
- On success, returns a response containing a `paymentSessionId`.
- On failure, returns a 500 Internal Server Error with an error message.

### 2. Supporting Classes

- **CreateOrderRequest**: Data Transfer Object (DTO) for reading order creation request data.
- **CreateOrderResponse**: DTO for sending a payment session identifier back to the client.

## Error Handling

- All exceptions are caught and result in a standardized error response with HTTP 500 and a descriptive message.

## Design Notes

- Uses Spring's `@RestController` for auto JSON serialization.
- Uses Lombok's `@Data` for boilerplate reductions (getters/setters).
- Relies on dependency injection (`@Autowired`) for service wiring.

---

**Typical Use case:**  
A client (such as a web frontend) posts order and customer details to `/create-order`. The API talks to Cashfree via the service layer, and responds with a session ID required for the payment process, or an appropriate error if issues occur.