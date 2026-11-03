'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

test('Firebase packaging excludes ignored files with the patched matcher', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'kepenk-package-'));
  try {
    await fs.writeFile(path.join(dir, 'index.html'), 'public');
    await fs.writeFile(path.join(dir, 'private.key'), 'synthetic test fixture');
    const { readdirRecursive } = require('firebase-tools/lib/fsAsync');
    const entries = await readdirRecursive({ path: dir, ignoreStrings: ['*.key'] });
    assert.deepEqual(entries.map(e => path.basename(e.name)), ['index.html']);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('hosting patterns and archive globbing retain their behavior', async () => {
  const patterns = require('superstatic/lib/utils/patterns');
  assert.equal(patterns.configMatcher('/assets/logo.svg', { glob: '/assets/**' }), true);
  assert.equal(patterns.configMatcher('/private/key', { glob: '/assets/**' }), false);
  const archiver = require('archiver');
  const zip = archiver('zip');
  const chunks = [];
  zip.on('data', chunk => chunks.push(chunk));
  const done = new Promise((resolve, reject) => { zip.on('end', resolve); zip.on('error', reject); });
  zip.glob('*.cjs', { cwd: path.join(__dirname, '../scripts') });
  await zip.finalize();
  await done;
  const archive = Buffer.concat(chunks);
  assert.ok(archive.includes(Buffer.from('grant-admin.cjs')));
  assert.ok(archive.includes(Buffer.from('patch-minimatch-consumers.cjs')));
});

test('Pub/Sub tracing still loads with patched OpenTelemetry', () => {
  const tracing = require('@google-cloud/pubsub/build/src/telemetry-tracing');
  assert.equal(typeof tracing.extractSpan, 'function');
  const { W3CTraceContextPropagator } = require('@opentelemetry/core');
  assert.deepEqual(new W3CTraceContextPropagator().fields(), ['traceparent', 'tracestate']);
});
