# Workspace Problems Fix TODO

## TypeScript Errors
- [ ] Fix JSX syntax errors in c:/EnhancedNetCreateModal.tsx (missing closing tags, unexpected tokens)
- [ ] Fix missing default export in project/src/pages/AdminGrounds.tsx (GroundCreateModal)

## Java Warnings
- [ ] Remove unused import java.util.Optional in SessionActivityRepository.java
- [ ] Remove unused import java.util.Optional in ContactInfoRepository.java
- [ ] Remove unused field starPlayerTournamentRepository in HomepageContentService.java
- [ ] Remove unused import java.security.Key in JwtUtil.java
- [ ] Update deprecated SignatureException in JwtUtil.java
- [ ] Remove unused import org.springframework.context.annotation.Import in TestConfig.java
- [ ] Remove unused method isSecureUrl in UploadController.java
- [ ] Remove unused import BookingService in MigrationFixController.java
- [ ] Remove unused import UserAlreadyLoggedInException in UserService.java
- [ ] Remove unused import Net in AdminNetController.java
- [ ] Remove unused field userRepository in RefreshTokenService.java
- [ ] Remove unused PayPal imports in PaymentService.java
- [ ] Remove unused IOException import in PaymentService.java
- [ ] Remove unused payloadData variable in PaymentService.java
- [ ] Parameterize raw Map type in PaymentService.java
- [ ] Remove unused exception imports in GlobalExceptionHandler.java
- [ ] Remove unused import User in SessionController.java
- [ ] Remove unused field userService in SessionController.java
- [ ] Remove unused field jwtUtil in AuthController.java
- [ ] Remove unused BCryptPasswordEncoder and PasswordEncoder imports in SecurityConfig.java
- [ ] Remove unused Optional import in NetService.java
- [ ] Fix unchecked conversions in NetService.java (add generics to List and Map)
- [ ] Remove unused field emailService in PaymentController.java
- [ ] Remove unused imports in EnhancedBookingController.java
- [ ] Remove unused field bookingService in EnhancedBookingController.java
- [ ] Remove unused Optional import in ContactInfoService.java
- [ ] Remove unused lombok.Data import in AdminHomepageController.java

## Verification
- [ ] Run TypeScript compiler to verify TS fixes
- [ ] Run Java compiler/linter to verify Java fixes
