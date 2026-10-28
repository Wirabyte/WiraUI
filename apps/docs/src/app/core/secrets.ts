// Two small secrets, unrelated to each other: typing "hasu" opens /ll, typing "kawaii" opens /kawaii. Finding one
// says nothing about the other. Only typing the word opens the page: it gives a pass held in memory for that one visit,
// so the address typed, pasted, bookmarked or reloaded shows the 404 page like any unknown address, and leaving the
// page drops the pass (Back does not return to it). Opening the page unlocks that page's hidden preset in the theme
// drawer and the Studio, remembered in this browser only.

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
  /** Leaving the page: the next visit needs the word again. */
  dropPass(): void;
  /** The route's guard. */
  hasPass(): boolean;
}

function secret(word: string, path: string, preset: string): Secret {
  const unlockKey = `wiratheme-docs-${word}`;
  // In memory only: a reload or a typed address starts without it.
  let pass = false;
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
      pass = true;
    },
    dropPass() {
      pass = false;
    },
    hasPass() {
      return pass;
    },
  };
}

export const HASU = secret('hasu', '/ll', 'll');
export const KAWAII = secret('kawaii', '/kawaii', 'kawaii');
export const SECRETS: readonly Secret[] = [HASU, KAWAII];
