/**
 * Onboarding completion flag in localStorage.
 * Set on login (from API), cleared on logout.
 */

export const ONBOARDING_COMPLETE_KEY = "signup-onboarding-complete";

export function setOnboardingCompleteInStorage(complete: boolean): void {
  if (typeof window === "undefined") return;
  if (complete) {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
  } else {
    localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
  }
}

export function clearOnboardingFromStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
}

export function getOnboardingCompleteFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true";
}
