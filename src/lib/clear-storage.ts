/**
 * Clear all client-side storage on logout (localStorage, sessionStorage, and
 * cookies that are readable from JS). The auth httpOnly cookie is cleared
 * by signOut() via the auth API.
 */
export function clearAllStorageOnLogout(): void {
  if (typeof window === "undefined") return;

  localStorage.clear();
  sessionStorage.clear();

  // Clear all cookies we can access (non-httpOnly). The auth session cookie
  // is httpOnly and is cleared when signOut() runs.
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const name = cookie.split("=")[0].trim();
    if (name) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
}
