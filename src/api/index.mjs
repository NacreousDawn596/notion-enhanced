/**
 * notion-enhancer: api utilities
 * (c) 2024 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * (https://notion-enhancer.github.io/) under the MIT license
 */

'use strict';

/**
 * filesystem utilities
 * @namespace fs
 */
export const fs = {
  /**
   * fetch and parse a json resource
   * @param {string} url - the url to fetch
   * @param {object=} options - fetch options
   * @returns {Promise<object>}
   */
  getJSON: async (url, options = {}, retries = 3, backoff = 500) => {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          const isRetryable = res.status === 429 || res.status >= 500;
          if (isRetryable) {
            const err = new Error(`HTTP Error ${res.status}`);
            err.isRetryable = true;
            throw err;
          } else {
            // Not retryable, attempt to return formatted JSON error
            try {
              return await res.json();
            } catch {
              throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
            }
          }
        }
        return await res.json();
      } catch (err) {
        lastError = err;
        if (!err.isRetryable && err.name !== 'TypeError') {
          // TypeError is thrown by fetch on network errors (retryable).
          // If it's not a TypeError and not explicitly flagged as retryable, throw immediately.
          throw err;
        }
        if (i < retries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, backoff * Math.pow(2, i))
          );
        }
      }
    }
    throw lastError;
  },
};

/**
 * web utilities
 * @namespace web
 */
export const web = {
  /**
   * get current url query parameters
   * @returns {URLSearchParams}
   */
  queryParams: () => new URLSearchParams(globalThis.location?.search || ''),
};

/**
 * formatting utilities
 * @namespace fmt
 */
export const fmt = {
  /**
   * generate a uuidv4
   * @returns {string} v4 uuid
   */
  uuidv4: () => crypto.randomUUID(),
};
