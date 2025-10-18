# Google Reviews Integration Setup

## Overview
The application now supports real Google Places API integration to fetch actual Google reviews for Indusion Cricket Ground.

## Setup Instructions

### 1. Get Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
5. **Secure your API key**:
   - Click on the API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API" only

### 2. Find Your Place ID
1. Go to [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for "Indusion Cricket Ground" or your business address
3. Copy the `place_id` from the search result

### 3. Configure Application
Update `backend/src/main/resources/application.properties`:

```properties
google.places.api.key=YOUR_ACTUAL_API_KEY_HERE
google.places.place.id=YOUR_ACTUAL_PLACE_ID_HERE
```

### 4. Test the Integration
1. Restart the Spring Boot application
2. Visit the homepage
3. Check the "What Our Members Say" section
4. Reviews should now show real Google reviews (4-5 stars only)

## Features Implemented

✅ **Real Google Reviews**: Fetches actual reviews from Google Places API  
✅ **Quality Filter**: Only shows 4-5 star reviews  
✅ **Newest First**: Sorts reviews by date (newest first)  
✅ **Fallback System**: Shows mock reviews if API fails  
✅ **Rate Limiting**: Handles API errors gracefully  
✅ **Caching Ready**: Service layer ready for caching implementation  

## API Limits & Costs
- **Google Places API**: $17 per 1,000 requests
- **Recommended**: Implement caching to reduce API calls
- **Free Tier**: $200 monthly credit (≈11,700 requests)

## Troubleshooting

### No Reviews Showing
1. Check API key is valid and has Places API enabled
2. Verify place ID is correct for your business
3. Check application logs for API errors
4. Ensure your Google My Business has reviews

### API Errors
- **403 Forbidden**: API key restrictions or billing not enabled
- **404 Not Found**: Invalid place ID
- **429 Too Many Requests**: Rate limit exceeded

## Next Steps (Optional)
1. **Implement Caching**: Cache reviews for 1-24 hours to reduce API costs
2. **Add More Fields**: Fetch reviewer photos, relative time
3. **Review Management**: Admin panel to moderate displayed reviews
4. **Analytics**: Track which reviews get most engagement