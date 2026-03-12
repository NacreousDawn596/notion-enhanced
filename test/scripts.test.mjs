import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import child_process from 'node:child_process';
import util from 'node:util';

const exec = util.promisify(child_process.exec);

describe('Scripts Test', () => {
  test('validate syntax of bash build extension script', async () => {
    // Execute a syntax check on bash script
    const { stdout, stderr } = await exec('bash -n ./scripts/build-browser-extension.sh');
    assert.strictEqual(stderr, '', 'No errors in bash script syntax');
  });
});
