@echo off
echo ===========================================
echo Quick Tunnel Setup for Razorpay Testing
echo ===========================================
echo.

echo Choose your preferred tunneling method:
echo.
echo 1. Serveo SSH Tunnel (No installation required - RECOMMENDED)
echo 2. LocalTunnel (Requires Node.js/npm)
echo 3. Manual port forwarding
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto serveo
if "%choice%"=="2" goto localtunnel
if "%choice%"=="3" goto manual

echo Invalid choice. Exiting.
pause
exit /b 1

:serveo
echo.
echo ===========================================
echo Setting up Serveo SSH Tunnel
echo ===========================================
echo.
echo Step 1: Make sure your backend is running on port 8080
echo Step 2: Open a new command prompt and run:
echo.
echo ssh -R 80:localhost:8080 serveo.net
echo.
echo Or with custom subdomain:
echo ssh -R yourappname:80:localhost:8080 serveo.net
echo.
echo Step 3: Copy the HTTPS URL shown (e.g., https://abc123.serveo.net)
echo Step 4: Update application.yml with this URL
echo.
echo Example application.yml update:
echo app:
echo   payment:
echo     razorpay:
echo       base-url: https://your-serveo-url.serveo.net
echo.
pause
goto end

:localtunnel
echo.
echo ===========================================
echo Setting up LocalTunnel
echo ===========================================
echo.
echo Step 1: Install LocalTunnel (requires Node.js)
echo npm install -g localtunnel
echo.
echo Step 2: Start your backend on port 8080
echo.
echo Step 3: Run LocalTunnel:
echo lt --port 8080
echo.
echo Or with custom subdomain:
echo lt --port 8080 --subdomain yourappname
echo.
echo Step 4: Copy the HTTPS URL (e.g., https://yourappname.loca.lt)
echo Step 5: Update application.yml with this URL
echo.
pause
goto end

:manual
echo.
echo ===========================================
echo Manual Port Forwarding Setup
echo ===========================================
echo.
echo Step 1: Access your router admin panel (usually http://192.168.1.1)
echo Step 2: Login with admin credentials
echo Step 3: Go to Port Forwarding / Virtual Server / NAT settings
echo Step 4: Add a new rule:
echo    - External Port: 8080
echo    - Internal IP: [Your computer's IP on local network]
echo    - Internal Port: 8080
echo    - Protocol: TCP
echo.
echo Step 5: Find your public IP at: https://whatismyipaddress.com
echo Step 6: Your tunnel URL will be: http://[YOUR_PUBLIC_IP]:8080
echo.
echo Note: This method may not work with all ISPs
echo.
pause
goto end

:end
echo.
echo After setting up the tunnel:
echo 1. Update backend/src/main/resources/application.yml
echo 2. Restart your backend server
echo 3. Test the payment flow
echo.
echo For detailed instructions, see ALTERNATIVE_TUNNELING_README.md
echo.
pause
