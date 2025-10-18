#!/bin/bash

# JWT Token Validation Fix Test Script
# This script tests the JWT token validation fix

echo "🧪 Testing JWT Token Validation Fix"
echo "=================================="

# Test 1: Check if /api/grounds works without authentication
echo "1. Testing /api/grounds without authentication..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/grounds)
if [ "$response" -eq 200 ]; then
    echo "✅ /api/grounds accessible without authentication"
else
    echo "❌ /api/grounds returned HTTP $response"
fi

# Test 2: Check if /api/nets works without authentication
echo "2. Testing /api/nets without authentication..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/nets)
if [ "$response" -eq 200 ]; then
    echo "✅ /api/nets accessible without authentication"
else
    echo "❌ /api/nets returned HTTP $response"
fi

# Test 3: Check if protected endpoints still require authentication
echo "3. Testing protected endpoint /api/admin/users..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/admin/users)
if [ "$response" -eq 401 ]; then
    echo "✅ /api/admin/users still requires authentication"
else
    echo "❌ /api/admin/users returned HTTP $response (should be 401)"
fi

# Test 4: Check if health endpoint works
echo "4. Testing /api/health endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)
if [ "$response" -eq 200 ]; then
    echo "✅ /api/health accessible"
else
    echo "❌ /api/health returned HTTP $response"
fi

echo ""
echo "🎯 Test Summary:"
echo "If all tests show ✅, the JWT fix is working correctly!"
echo ""
echo "📋 Next Steps:"
echo "1. Start your Spring Boot application"
echo "2. Run this script: ./test_jwt_fix.sh"
echo "3. Check the JWT_FIX_GUIDE.md for detailed configuration"
