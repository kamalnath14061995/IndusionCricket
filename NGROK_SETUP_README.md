# Ngrok Setup for Razorpay Payment Integration

This guide will help you set up ngrok to tunnel your local development server for Razorpay payment testing.

## Prerequisites

1. **Ngrok Account**: Sign up at https://ngrok.com
2. **Auth Token**: Get your auth token from the ngrok dashboard

## Quick Setup

### Step 1: Download and Install Ngrok

1. Download ngrok from: https://ngrok.com/download
2. Choose the Windows version (ngrok-v3-stable-windows-amd64.zip)
3. Extract the zip file to your project root directory (g:/indusion4)
4. You should now have `ngrok.exe` in your project folder

### Step 2: Authenticate Ngrok

Run the setup script:
```bash
setup_ngrok.bat
```

Or manually:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### Step 3: Start the Tunnel

```bash
ngrok http 8080
```

This will give you a public URL like: `https://abc123.ngrok.io`

### Step 4: Update Application Configuration

1. Copy the ngrok URL from the terminal
2. Update your `backend/src/main/resources/application.yml`:

```yaml
app:
  payment:
    razorpay:
      base-url: https://your-ngrok-url.ngrok.io  # Replace with your actual ngrok URL
```

### Step 5: Restart Your Backend Server

After updating the configuration, restart your Spring Boot application:
```bash
cd backend
mvn spring-boot:run
```

## Alternative: Manual Setup

If the automated script doesn't work, follow these steps:

### 1. Download Ngrok Manually
- Go to https://ngrok.com/download
- Download the Windows ZIP file
- Extract to a folder (e.g., `C:\ngrok\`)

### 2. Add to PATH (Optional)
Add the ngrok folder to your system PATH, or copy `ngrok.exe` to `C:\Windows\System32\`

### 3. Authenticate
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 4. Start Tunnel
```bash
ngrok http 8080
```

### 5. Update Configuration
Edit `backend/src/main/resources/application.yml`:
```yaml
app:
  payment:
    razorpay:
      base-url: YOUR_NGROK_URL_HERE
```

## Testing the Setup

### 1. Verify Ngrok is Working
- Visit your ngrok URL in a browser
- You should see your backend server's response

### 2. Test Payment Flow
1. Start your frontend: `cd project && npm run dev`
2. Login to your application
3. Go to the payment page
4. Try making a payment with Razorpay
5. Check the backend logs for any errors

### 3. Check Logs
Monitor your backend logs for:
- Successful order creation
- Webhook events (if configured)
- Any authentication or CORS errors

## Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Make sure you're logged in and have a valid JWT token
2. **CORS Errors**: The CORS configuration now allows ngrok URLs
3. **Webhook Issues**: Ensure your ngrok URL is updated in Razorpay dashboard
4. **Connection Refused**: Make sure your backend is running on port 8080

### Debug Commands:

```bash
# Check ngrok status
ngrok status

# View ngrok logs
ngrok logs

# Restart tunnel
ngrok http 8080
```

## Razorpay Dashboard Configuration

For production webhooks, you'll need to:

1. Go to your Razorpay Dashboard
2. Navigate to Settings → Webhooks
3. Add webhook URL: `https://your-ngrok-url.ngrok.io/api/payments/webhook/razorpay`
4. Select events: `payment.captured`, `payment.failed`, etc.

## Environment Variables

You can also use environment variables instead of updating application.yml:

```bash
# Linux/Mac
export RAZORPAY_BASE_URL=https://your-ngrok-url.ngrok.io

# Windows
set RAZORPAY_BASE_URL=https://your-ngrok-url.ngrok.io
```

## Security Note

- Ngrok tunnels are public, so don't expose sensitive endpoints
- Use ngrok only for development and testing
- For production, use proper HTTPS certificates and domains

## Support

If you encounter issues:
1. Check the backend logs for detailed error messages
2. Verify your ngrok URL is accessible
3. Ensure Razorpay API keys are correctly configured
4. Test with a simple curl request to your ngrok URL

---

**Happy coding! 🎉**
