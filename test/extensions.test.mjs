import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

describe('Extensions Validation', () => {
  test('all extensions possess valid mod.json files', async () => {
    const dirs = await fs.readdir('./src/extensions');
    for (const dir of dirs) {
      if (dir.startsWith('.')) continue;
      const modJson = await fs.readFile(`./src/extensions/${dir}/mod.json`, 'utf-8');
      const parsed = JSON.parse(modJson);
      assert.ok(parsed.id, `Extension ${dir} has a valid ID`);
      assert.ok(parsed.name, `Extension ${dir} has a valid name`);
      assert.ok(parsed.version, `Extension ${dir} specifies a version`);
    }
  });
});
