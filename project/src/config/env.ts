// Environment configuration
export const config = {
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RCHTIPofbIz1gG',
    keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'v3GgVh6KzPX9lfafaQE5rxqX'
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  },
  googleMaps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  },
  facilitySuggestions: {
    // Optional external sources to enrich suggestions
    featureUrl: import.meta.env.VITE_FEATURE_SUGGESTIONS_URL || '',
    descriptionUrl: import.meta.env.VITE_DESCRIPTION_SUGGESTIONS_URL || ''
  }
};
