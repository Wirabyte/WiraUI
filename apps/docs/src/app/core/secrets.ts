// Two small secrets, unrelated to each other: typing "hasu" opens /ll, typing "kawaii" opens /kawaii. Finding one
// says nothing about the other. Typing the word gives this tab a pass (the address alone does not match, so it goes
// home like any unknown address); opening the page unlocks that page's hidden preset in the theme drawer and the
// Studio, remembered in this browser only.

export interface Secret {
  /** The word to type. */
  readonly word: string;
  /** The page's address. */
  readonly path: string;
  /** The library's hidden preset the page unlocks. */
  readonly preset: string;
  unlocked(): boolean;
  unlock(): void;
  grantPass(): void;
  /** The route's guard. */
  hasPass(): boolean;
}

function secret(word: string, path: string, preset: string): Secret {
  const unlockKey = `wiratheme-docs-${word}`;
  const passKey = `wiratheme-docs-${word}-pass`;
  let passInMemory = false;
  return {
    word,
    path,
    preset,
    unlocked() {
      try {
        return localStorage.getItem(unlockKey) === '1';
      } catch {
        return false;
      }
    },
    unlock() {
      try {
        localStorage.setItem(unlockKey, '1');
      } catch {
        // Private mode or blocked storage: the preset stays locked.
      }
    },
    grantPass() {
      passInMemory = true;
      try {
        sessionStorage.setItem(passKey, '1');
      } catch {
        // Blocked storage: the pass lasts until the page reloads.
      }
    },
    hasPass() {
      if (passInMemory) return true;
      try {
        return sessionStorage.getItem(passKey) === '1';
      } catch {
        return false;
      }
    },
  };
}

export const HASU = secret('hasu', '/ll', 'll');
export const KAWAII = secret('kawaii', '/kawaii', 'kawaii');
export const SECRETS: readonly Secret[] = [HASU, KAWAII];
