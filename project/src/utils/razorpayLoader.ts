export async function loadRazorpay(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve((window as any).Razorpay);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve((window as any).Razorpay);
      } else {
        reject(new Error('Razorpay SDK failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay SDK'));
    };

    // Add script to document head
    if (document.head) {
      document.head.appendChild(script);
    } else {
      reject(new Error('Document head not available'));
    }
  });
}

// Utility function to check if Razorpay is available
export function isRazorpayAvailable(): boolean {
  return typeof window !== 'undefined' && !!(window as any).Razorpay;
}

// Utility function to get Razorpay instance
export function getRazorpayInstance(): any {
  if (typeof window !== 'undefined' && (window as any).Razorpay) {
    return (window as any).Razorpay;
  }
  return null;
}
