import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getMetadata, deleteObject } from 'firebase/storage';

test('server rules restrict private data and mutations to administrators', async () => {
  const env = await initializeTestEnvironment({
    projectId: 'demo-kepenkpro',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
    storage: { rules: readFileSync('storage.rules', 'utf8') },
  });
  try {
    const guest = env.unauthenticatedContext();
    const member = env.authenticatedContext('member');
    const fakeAdmin = env.authenticatedContext('fake-admin', { admin: 'true' });
    const admin = env.authenticatedContext('administrator', { admin: true });
    const lead = { name: 'Test', phone: '555', district: 'Sample', service: 'Repair', message: '', handled: false, createdAt: serverTimestamp() };
    await assertSucceeds(setDoc(doc(guest.firestore(), 'leads/valid'), lead));
    await assertFails(setDoc(doc(guest.firestore(), 'leads/forged'), { ...lead, handled: true }));
    await assertFails(setDoc(doc(guest.firestore(), 'leads/stale'), { ...lead, createdAt: Timestamp.fromMillis(0) }));
    await assertFails(setDoc(doc(guest.firestore(), 'leads/extra'), { ...lead, admin: true }));
    for (const context of [guest, member, fakeAdmin]) {
      await assertFails(getDoc(doc(context.firestore(), 'leads/valid')));
      await assertFails(updateDoc(doc(context.firestore(), 'leads/valid'), { handled: true }));
      await assertFails(deleteDoc(doc(context.firestore(), 'leads/valid')));
      await assertFails(setDoc(doc(context.firestore(), 'content/home'), { title: 'Denied' }));
      await assertFails(uploadBytes(ref(context.storage(), 'content/denied.png'), new Uint8Array([1]), { contentType: 'image/png' }));
    }
    await assertSucceeds(getDoc(doc(admin.firestore(), 'leads/valid')));
    await assertSucceeds(updateDoc(doc(admin.firestore(), 'leads/valid'), { handled: true }));
    await assertSucceeds(deleteDoc(doc(admin.firestore(), 'leads/valid')));
    await assertSucceeds(setDoc(doc(admin.firestore(), 'content/home'), { title: 'Public content' }));
    await assertSucceeds(getDoc(doc(guest.firestore(), 'content/home')));
    await assertFails(setDoc(doc(admin.firestore(), 'unknown/path'), { value: true }));
    const image = ref(admin.storage(), 'content/valid.png');
    await assertSucceeds(uploadBytes(image, new Uint8Array([1, 2]), { contentType: 'image/png' }));
    await assertSucceeds(getMetadata(ref(guest.storage(), 'content/valid.png')));
    await assertFails(deleteObject(ref(member.storage(), 'content/valid.png')));
    await assertFails(uploadBytes(ref(admin.storage(), 'content/not-image.txt'), new Uint8Array([1]), { contentType: 'text/plain' }));
    await assertFails(uploadBytes(ref(admin.storage(), 'content/too-large.png'), new Uint8Array(5 * 1024 * 1024), { contentType: 'image/png' }));
    await assertFails(uploadBytes(ref(admin.storage(), 'other/image.png'), new Uint8Array([1]), { contentType: 'image/png' }));
    await assertSucceeds(deleteObject(image));
  } finally { await env.cleanup(); }
});
