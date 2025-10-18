# Enhanced Online Booking System Documentation

## Overview
The Enhanced Online Booking System provides a comprehensive solution for booking cricket grounds and nets with advanced features including real-time availability, flexible pricing, add-on services, team management, and payment integration.

## Features Implemented

### 1. Real-Time Availability Checking
- **Frontend**: EnhancedBookingCreateModal.tsx with dynamic slot checking
- **Backend**: BookingRepository with conflict detection queries
- **API**: `/api/bookings/available-slots` endpoint

### 2. Multiple Ground/Net Options
- **Ground Management**: Complete CRUD operations for grounds
- **Net Management**: Complete CRUD operations for nets
- **Facility Selection**: Dropdown with pricing and descriptions

### 3. Pricing and Packages
- **Flexible Pricing**: Hourly, half-day, full-day, weekly, monthly packages
- **Dynamic Pricing**: Peak/off-peak, weekend/weekday, holiday multipliers
- **Discount System**: Group, corporate, student, loyalty discounts
- **Tax Calculation**: Automatic GST calculation

### 4. Add-On Services
- **Service Categories**: Equipment, coaching, facility, technology, catering, security
- **Available Services**:
  - Professional umpire
  - Match scorer
  - Bowling machine
  - Floodlights
  - Live streaming
  - Video recording
  - Professional coach
  - Pavilion access
  - Refreshments
  - Security personnel

### 5. Team Management
- **Team Creation**: Create and manage cricket teams
- **Player Management**: Add players with roles and skill levels
- **Captain Management**: Team captain contact information
- **Team Booking**: Book as a team with special rates

### 6. Payment Integration
- **Payment Methods**: UPI, credit/debit cards, wallets, net banking
- **Payment Providers**: Razorpay, Paytm, PhonePe integration ready
- **Payment Status**: Real-time payment tracking
- **Refund System**: Automated refund processing

### 7. Notifications and Reminders
- **Email Notifications**: Booking confirmations, reminders, cancellations
- **SMS Notifications**: Instant booking updates
- **WhatsApp Integration**: Rich media notifications
- **Push Notifications**: Browser-based notifications

## API Endpoints

### Booking Management
- `POST /api/bookings/enhanced` - Create enhanced booking
- `GET /api/bookings/available-slots` - Get available time slots
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Pricing Management
- `GET /api/bookings/pricing-packages` - Get pricing packages
- `GET /api/bookings/pricing-packages?type=GROUND` - Filter by type

### Add-On Services
- `GET /api/bookings/add-on-services` - Get all available services
- `GET /api/bookings/add-on-services?category=EQUIPMENT` - Filter by category

### Team Management
- `GET /api/bookings/teams` - Get all teams
- `POST /api/teams` - Create new team
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team

## Database Schema

### Core Tables
- `bookings` - Enhanced booking information
- `pricing_packages` - Flexible pricing options
- `add_on_services` - Additional services catalog
- `teams` - Team management
- `team_players` - Individual player details
- `payment_transactions` - Payment tracking
- `notifications` - Notification history

## Frontend Components

### EnhancedBookingCreateModal.tsx
- **Purpose**: Main booking interface
- **Features**:
  - Real-time availability checking
  - Dynamic pricing calculation
  - Add-on service selection
  - Team/player management
  - Payment integration
  - Responsive design

### Key Features:
1. **Booking Type Selection**: Ground vs Net booking
2. **Facility Selection**: Dropdown with pricing
3. **Date/Time Selection**: Calendar with available slots
4. **Pricing Packages**: Flexible package selection
5. **Team Management**: Team selection or creation
6. **Add-On Services**: Checkbox selection with pricing
7. **Customer Information**: Contact details
8. **Special Requirements**: Custom notes
9. **Total Price Display**: Real-time calculation
10. **Payment Integration**: Ready for payment gateway

## Configuration

### Environment Variables
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/cricket_academy
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password

# Payment
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
PAYTM_MERCHANT_ID=your_merchant_id

# Notifications
EMAIL_API_KEY=your_email_api_key
SMS_API_KEY=your_sms_api_key
```

### Frontend Configuration
```javascript
// API endpoints
const API_BASE_URL = 'http://localhost:8080/api';
const BOOKING_ENDPOINTS = {
  create: `${API_BASE_URL}/bookings/enhanced`,
  pricing: `${API_BASE_URL}/bookings/pricing-packages`,
  addons: `${API_BASE_URL}/bookings/add-on-services`,
  teams: `${API_BASE_URL}/bookings/teams`,
  slots: `${API_BASE_URL}/bookings/available-slots`
};
```

## Usage Examples

### Creating a Booking
```javascript
const bookingData = {
  bookingType: 'ground',
  facilityId: 'ground-001',
  pricingPackageId: 1,
  bookingDate: '2024-01-15',
  startTime: '09:00',
  endTime: '11:00',
  teamId: 1,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+91-9876543210',
  numberOfPlayers: 11,
  specialRequirements: 'Need umpire and scorer',
  addOnServices: [1, 2, 3],
  totalPrice: 2500
};
```

### Getting Available Slots
```javascript
const availableSlots = await fetch(
  '/api/bookings/available-slots?date=2024-01-15&facilityId=ground-001'
);
```

## Security Features
- JWT authentication
- Role-based access control
- Input validation
- SQL injection prevention
- XSS protection
- Rate limiting

## Performance Optimizations
- Database indexing
- Caching for pricing packages
- Lazy loading for relationships
- Pagination for large datasets
- Optimized queries

## Future Enhancements
- Mobile app integration
- AI-powered pricing recommendations
- Social media integration
- Loyalty program
- Referral system
- Analytics dashboard
- Multi-language support
- Calendar sync (Google/Outlook)
