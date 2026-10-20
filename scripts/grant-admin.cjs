'use strict';
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

async function main() {
  const [projectId, uid, ...extra] = process.argv.slice(2);
  if (!projectId || !uid || extra.length || /\s/.test(projectId) || /\s/.test(uid)) {
    throw new Error('Usage: npm run admin:grant -- PROJECT_ID USER_UID');
  }
  const app = initializeApp({ credential: applicationDefault(), projectId });
  const auth = getAuth(app);
  const user = await auth.getUser(uid);
  await auth.setCustomUserClaims(uid, { ...user.customClaims, admin: true });
  console.log('Administrator claim granted. Sign out and sign in again to refresh the ID token.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
