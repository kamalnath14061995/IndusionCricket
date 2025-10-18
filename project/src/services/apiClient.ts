// Simple API client with auto-refresh on 401
// Uses /api/auth/refresh with stored refreshToken

const API_BASE_URL = 'http://localhost:8080';

// Helper function to validate JWT token format
function isValidJwtToken(token: string | null): boolean {
  if (!token || typeof token !== 'string') return false;
  
  // JWT tokens should have exactly 2 dots separating 3 parts
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Each part should be non-empty
  return parts.every(part => part.length > 0);
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;

  const headers = new Headers(init.headers || {});
  // Only set JSON content-type when not sending FormData
  if (!isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  
  // Check if Authorization header is already set with a valid token
  const existingAuth = headers.get('Authorization');
  if (existingAuth && existingAuth.startsWith('Bearer ')) {
    // Authorization header is already set, use it as-is
    console.log('API Fetch: Using existing Authorization header');
  } else if (accessToken && isValidJwtToken(accessToken)) {
    // Only set Authorization header if token is valid and no existing valid header
    headers.set('Authorization', `Bearer ${accessToken}`);
    console.log('API Fetch: Added Authorization header from localStorage token');
  } else {
    console.log('API Fetch: No valid Authorization header available');
  }

  // Debug log the request details
  console.log('API Fetch Request:', {
    url: input,
    method: init.method || 'GET',
    headers: Object.fromEntries([...headers]),
    hasBody: !!init.body
  });

  const first = await fetch(input, { ...init, headers });
  
  // Debug log the response
  console.log('API Fetch Response:', {
    status: first.status,
    statusText: first.statusText,
    headers: Object.fromEntries([...first.headers])
  });

  if (first.status !== 401) return first;

  // Try refresh
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return first;

  const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshRes.ok) return first;
  const refreshData = await refreshRes.json().catch(() => ({} as any));
  if (!refreshData?.success) return first;

  const newAccess = refreshData?.data?.accessToken;
  const newRefresh = refreshData?.data?.refreshToken;
  if (newAccess) {
    localStorage.setItem('accessToken', newAccess);
    localStorage.setItem('token', newAccess); // compatibility
  }
  if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

  // Retry original request with new token
  const retryHeaders = new Headers(init.headers || {});
  if (!isFormData && !retryHeaders.has('Content-Type')) retryHeaders.set('Content-Type', 'application/json');
  retryHeaders.set('Authorization', `Bearer ${newAccess}`);
  return fetch(input, { ...init, headers: retryHeaders });
}

export { API_BASE_URL };