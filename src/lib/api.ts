const API_BASE_URL = 'http://127.0.0.1:8000';

interface ApiFetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiFetch(endpoint: string, options: ApiFetchOptions = {}): Promise<Response> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (requiresAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      mode: 'cors',
      credentials: 'include',
    });

    // Handle token refresh if needed
    if (response.status === 401 && requiresAuth) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
            mode: 'cors',
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('access_token', refreshData.access_token);
            localStorage.setItem('refresh_token', refreshData.refresh_token);

            // Retry the original request with new token
            headers['Authorization'] = `Bearer ${refreshData.access_token}`;
            return fetch(url, {
              ...fetchOptions,
              headers,
              mode: 'cors',
              credentials: 'include',
            });
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }

      // If refresh failed, clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }

    return response;
  } catch (error) {
    console.error(`API Error [${fetchOptions.method || 'GET'} ${url}]:`, error);
    console.error('Full error:', {
      endpoint,
      url,
      method: fetchOptions.method || 'GET',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

export async function apiFormData(endpoint: string, formData: FormData, options: Omit<ApiFetchOptions, 'body'> = {}): Promise<Response> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (requiresAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return apiFetch(endpoint, {
    ...fetchOptions,
    method: 'POST',
    body: formData,
    headers,
  });
}