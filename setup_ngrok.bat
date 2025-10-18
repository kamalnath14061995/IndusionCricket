@echo off
echo ========================================
echo Razorpay Payment Ngrok Setup Script
echo ========================================
echo.

echo Step 1: Download ngrok from https://ngrok.com/download
echo Step 2: Extract ngrok.exe to your project root directory
echo Step 3: Sign up at ngrok.com and get your auth token
echo.

set /p NGROK_TOKEN="Enter your ngrok auth token (or press Enter to skip): "
if not "%NGROK_TOKEN%"=="" (
    echo Setting up ngrok auth token...
    ngrok config add-authtoken %NGROK_TOKEN%
    echo Auth token configured successfully!
) else (
    echo Skipping auth token setup. Make sure to run: ngrok config add-authtoken YOUR_TOKEN
)

echo.
echo Step 4: Starting ngrok tunnel for port 8080...
echo.
echo Your ngrok URL will be displayed below.
echo Update your application.yml with this URL:
echo   app.payment.razorpay.base-url: YOUR_NGROK_URL
echo.
echo Press Ctrl+C to stop the tunnel when done.
echo.

ngrok http 8080

pause
