import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

describe('Integrations Validation', () => {
  test('all integrations possess valid mod.json files', async () => {
    const dirs = await fs.readdir('./src/integrations');
    for (const dir of dirs) {
      if (dir.startsWith('.')) continue;
      const modJson = await fs.readFile(`./src/integrations/${dir}/mod.json`, 'utf-8');
      const parsed = JSON.parse(modJson);
      assert.ok(parsed.id, `Integration ${dir} has a valid ID`);
      assert.ok(parsed.name, `Integration ${dir} has a valid name`);
      assert.ok(parsed.version, `Integration ${dir} specifies a version`);
    }
  });
});
