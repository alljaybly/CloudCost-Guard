export const MANUAL_KEY_SESSION_STORAGE_KEY = 'gemini_manual_api_key';

export type ApiKeySource = 'manual' | 'env' | 'none';

/**
 * Retrieves the API key based on the priority:
 * 1. Manual key from sessionStorage
 * 2. Environment variable
 * @returns The API key string or null if not found.
 */
export const getApiKey = (): string | null => {
  try {
    const manualKey = sessionStorage.getItem(MANUAL_KEY_SESSION_STORAGE_KEY);
    if (manualKey && manualKey.trim() !== '') {
      return manualKey;
    }
  } catch (e) {
    console.error("Could not access sessionStorage", e);
  }

  if (process.env.API_KEY) {
    return process.env.API_KEY;
  }

  return null;
};

/**
 * Determines the source of the currently active API key.
 * @returns 'manual', 'env', or 'none'.
 */
export const getApiKeySource = (): ApiKeySource => {
    try {
        if (sessionStorage.getItem(MANUAL_KEY_SESSION_STORAGE_KEY)) {
            return 'manual';
        }
    } catch (e) {
        console.error("Could not access sessionStorage", e);
    }

    if (process.env.API_KEY) {
        return 'env';
    }

    return 'none';
};

/**
 * Stores the manual API key in sessionStorage.
 * @param key The API key to store.
 */
export const setManualApiKey = (key: string): void => {
  try {
    sessionStorage.setItem(MANUAL_KEY_SESSION_STORAGE_KEY, key);
  } catch (e) {
    console.error("Could not set item in sessionStorage", e);
  }
};

/**
 * Removes the manual API key from sessionStorage.
 */
export const removeManualApiKey = (): void => {
  try {
    sessionStorage.removeItem(MANUAL_KEY_SESSION_STORAGE_KEY);
  } catch (e) {
    console.error("Could not remove item from sessionStorage", e);
  }
};
