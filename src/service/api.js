
const API_BASE_URL = "/api";

export async function auth(path, body) {
  try {
    console.log(`[API] POST /${path}`, body);
    const res = await fetch(`${API_BASE_URL}/${path}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      // required for backend Routes.js to set/read 'jwt' cookie
      credentials: "include", 
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    console.log(`[API] Response status: ${res.status}`, data);
    
    if (res.ok && data.accessToken) {
      sessionStorage.setItem("token", data.accessToken);
      return { success: true, accessToken: data.accessToken };
    }
    return { success: false, error: data.message || "Auth failed" };
  } catch (err) {
    console.error(`[API] Error:`, err);
    return { success: false, error: "Proxy connection failed" };
  }
}

export async function getData(path) {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include" 
  });
  return res.json();
}