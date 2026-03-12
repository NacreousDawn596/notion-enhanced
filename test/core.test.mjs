import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

describe('Core Module', () => {
  test('client.mjs exports default function', async () => {
    const client = await import('../src/core/client.mjs');
    assert.strictEqual(typeof client.default, 'function', 'client exports default function');
  });

  test('variables.css and theme.css exist', async () => {
    const vars = await fs.readFile('./src/core/variables.css', 'utf-8');
    const theme = await fs.readFile('./src/core/theme.css', 'utf-8');
    assert.ok(vars.length > 0, 'variables.css is not empty');
    assert.ok(theme.length > 0, 'theme.css is not empty');
  });
});
