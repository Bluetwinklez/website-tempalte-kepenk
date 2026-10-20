const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isAdministrator } = require('../public/js/admin-access.js');
test('signed-in accounts require a verified boolean administrator claim', async () => {
  for (const claims of [{}, { admin: false }, { admin: 'true' }, { admin: 1 }]) {
    assert.equal(await isAdministrator({ getIdTokenResult: async () => ({ claims }) }), false);
  }
  assert.equal(await isAdministrator(null), false);
  assert.equal(await isAdministrator({ getIdTokenResult: async () => { throw Error('offline'); } }), false);
  assert.equal(await isAdministrator({ getIdTokenResult: async () => ({ claims: { admin: true } }) }), true);
});
