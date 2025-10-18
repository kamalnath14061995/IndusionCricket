@echo off
echo ===========================================
echo Tunnel Connectivity Test
echo ===========================================
echo.

set /p tunnel_url="Enter your tunnel URL (e.g., https://abc123.serveo.net): "

if "%tunnel_url%"=="" (
    echo No URL provided. Exiting.
    pause
    exit /b 1
)

echo.
echo Testing tunnel connectivity...
echo.

echo 1. Testing basic connectivity:
curl -s -o /dev/null -w "%%{http_code}" %tunnel_url%/api/payments/config
echo.

echo 2. Testing with authentication (you'll need a valid JWT token):
set /p jwt_token="Enter your JWT token (or press Enter to skip): "

if not "%jwt_token%"=="" (
    echo.
    echo Testing payment order creation:
    curl -X POST %tunnel_url%/api/payments/razorpay/order ^
         -H "Content-Type: application/json" ^
         -H "Authorization: Bearer %jwt_token%" ^
         -d "{\"amount\": 10000, \"currency\": \"INR\"}"
) else (
    echo.
    echo Skipping authenticated test (no JWT token provided)
)

echo.
echo 3. Testing CORS headers:
curl -I %tunnel_url%/api/payments/config

echo.
echo ===========================================
echo Test Complete
echo ===========================================
echo.
echo If you see HTTP 200 responses, your tunnel is working!
echo If you get connection errors, check:
echo - Is your backend running on port 8080?
echo - Is the tunnel URL correct?
echo - Are there firewall issues?
echo.
pause
