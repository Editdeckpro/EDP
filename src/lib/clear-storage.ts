/**
 * Clear all client-side storage on logout (localStorage, sessionStorage, and
 * cookies that are readable from JS). NextAuth httpOnly cookies are cleared
 * by signOut() via the auth API.
 */
export function clearAllStorageOnLogout(): void {
  if (typeof window === "undefined") return;

  localStorage.clear();
  sessionStorage.clear();

  // Clear all cookies we can access (non-httpOnly). NextAuth session cookies
  // are httpOnly and are cleared when signOut() runs.
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const name = cookie.split("=")[0].trim();
    if (name) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
}
