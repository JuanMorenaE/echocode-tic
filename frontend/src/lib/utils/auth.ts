export function isTokenExpired(token: string) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch (e) {
      return true;
    }
}

export function isLoggedIn(): boolean {
  const token = localStorage.getItem("token");
  return token ? !isTokenExpired(token) : false;
}

export function getToken(): string | null {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }

  return token;
}

export function getTokenPayload() {
  const token = getToken();
  if (!token) return null;

  return JSON.parse(atob(token.split(".")[1]));
}