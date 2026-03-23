const MOCK_DELAY = 300;

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mock_user_email");
}

export function getRefreshToken(): string | null {
  return null;
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("mock_user_email", access);
}

export function clearTokens() {
  localStorage.removeItem("mock_user_email");
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  console.log(`[MOCK API] Fetch disabled. Intercepted: ${path}`);
  
  await new Promise(res => setTimeout(res, MOCK_DELAY));

  // Determine what the mock should return based on common paths
  let body: any = [];
  
  if (path.includes('/dashboard')) {
    body = {
      user: { first_name: "Mock", last_name: "User" },
      stats: { total: 10 }
    };
  } else if (path.includes('/auth/me')) {
    const email = getAccessToken() || "admin@gmail.com";
    body = { email, first_name: "Mock", last_name: "User", role: email.split('@')[0] || "admin", is_password_changed: true };
  } else if (path.includes('/settings') || path.includes('/change-password')) {
    body = { success: true, detail: "Mock changed successfully" };
  }

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function apiFormData(
  path: string,
  formData: FormData
): Promise<Response> {
  console.log(`[MOCK API] FormData disabled. Intercepted: ${path}`);
  await new Promise(res => setTimeout(res, MOCK_DELAY));
  
  return new Response(JSON.stringify({ success: true, detail: "Mock uploaded successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
