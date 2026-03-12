import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// --- Mock environment for testing outside of Notion/Electron ---
const mockGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
};

mockGlobal('localStorage', {});
mockGlobal('location', { pathname: '/', search: '' });
Object.defineProperty(globalThis, 'navigator', {
  value: { userAgent: 'Node.js' },
  configurable: true,
});
mockGlobal('crypto', {
  randomUUID: () => '00000000-0000-0000-0000-000000000000',
});
mockGlobal('document', {
  readyState: 'complete',
  body: { append: () => {} },
  head: { append: () => {} },
  createElement: () => ({ append: () => {}, setAttribute: () => {} }),
  addEventListener: () => {},
  removeEventListener: () => {},
});

// Mock chrome extension API
mockGlobal('chrome', {
  runtime: {
    getManifest: () => ({ version: '0.11.1' }),
    getURL: (path) => `file://${process.cwd()}/src/${path}`,
    connect: () => ({
      onDisconnect: { addListener: () => {} },
      onMessage: { addListener: () => {} },
      postMessage: () => {},
    }),
    onMessage: { addListener: () => {} },
  },
});

// Mock fetch to handle simulated file URLs
const originalFetch = globalThis.fetch;
mockGlobal('fetch', async (url, options) => {
  if (typeof url === 'string' && url.startsWith('file://')) {
    const fs = await import('node:fs/promises');
    const path = url.replace('file://', '');
    try {
      const content = await fs.readFile(path, 'utf-8');
      return {
        json: async () => JSON.parse(content),
        text: async () => content,
        ok: true,
      };
    } catch (e) {
      return { ok: false, status: 404 };
    }
  }
  return originalFetch ? originalFetch(url, options) : { ok: false };
});

globalThis.__enhancerApi = {
  platform: 'linux',
  version: '0.11.1',
  initDatabase: () => ({
    get: async () => null,
    set: async () => true,
  }),
};

// --- Dynamic Imports ---
const notion = await import('../src/api/notion.js');
const state = await import('../src/api/state.js');
const system = await import('../src/api/system.js');
const registry = await import('../src/api/registry.js');

describe('Notion Enhancer API', () => {
  test('state.js: setState and useState work correctly', () => {
    const api = globalThis.__enhancerApi;
    api.setState({ testKey: 'testValue' });
    const [val] = api.useState(['testKey']);
    assert.strictEqual(val, 'testValue');
  });

  test('system.js: detects platform and version', () => {
    const api = globalThis.__enhancerApi;
    assert.strictEqual(api.platform, 'chromium');
    assert.strictEqual(api.version, '0.11.1');
  });

  test('registry.js: getMods returns array of mods', async () => {
    const api = globalThis.__enhancerApi;
    const mods = await api.getMods();
    assert.ok(Array.isArray(mods), 'getMods should return an array');
  });

  test('notion.js: getPageID returns string or undefined', () => {
    const pageId = notion.getPageID();
    assert.ok(typeof pageId === 'string' || !pageId, 'getPageID works');
  });

  test('notion.js: sign utility prepends notion.so to relative paths', () => {
    const signed = notion.sign('/some-image.png', '123');
    assert.ok(signed.startsWith('https://notion.so'), 'Prepends correctly');
  });

  test('notion.js: fails public fetch gracefully with error object', async () => {
    const data = await notion.get('00000000000000000000000000000000');
    assert.ok(data.errorId, 'Should return error object on invalid UUID');
  });
});
