// A small secret: opening /ll unlocks the Hasu preset (the library's hidden `ll`) in the theme drawer and the Studio.
// Remembered in this browser only.
const KEY = 'wiratheme-docs-hasu';

export function hasuUnlocked(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function unlockHasu(): void {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    // Private mode or blocked storage: the secret stays locked.
  }
}
