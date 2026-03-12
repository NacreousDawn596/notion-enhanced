/**
 * notion-enhancer: quick note
 * (c) 2021 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * (https://notion-enhancer.github.io/) under the MIT license
 */

'use strict';

export default async function ({ web, components, notion }, db) {
  const targetDbId = await db.get(['target_db']);
  if (!targetDbId) return;

  const newQuickNote = async () => {
    try {
      const pageInfo = await notion.get(targetDbId);
      if (pageInfo?.errorId || !pageInfo?.collection_id) {
        throw new Error('Target database not found or network error');
      }
      const noteID = await notion.create(
        {
          recordValue: {
            properties: {
              title: [[`quick note: ${new Date().toLocaleString()}`]],
            },
          },
          recordTable: 'page',
        },
        { parentID: pageInfo.collection_id, parentTable: 'collection' }
      );
      if (typeof noteID === 'object' && noteID.errorId) {
        throw new Error(`Failed to create note: ${noteID.message}`);
      }
      location.assign(`https://www.notion.so/${noteID.replace(/-/g, '')}`);
    } catch (err) {
      alert(`quick note failed: ${err.message}`);
    }
  };

  await components.addCornerAction(
    await components.feather('feather'),
    newQuickNote
  );
  web.addHotkeyListener(await db.get(['hotkey']), newQuickNote);
}
