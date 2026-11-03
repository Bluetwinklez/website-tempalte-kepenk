'use strict';

// minimatch 11 fixes globparts amplification but exports a named function.
// These pinned tooling consumers still expect the pre-v9 callable export.
// Fail on unexpected source changes so dependency upgrades require review.
const fs = require('node:fs');
const path = require('node:path');
const patches = [
  ['firebase-tools', '15.34.2', 'lib/fsAsync.js'],
  ['firebase-tools', '15.34.2', 'lib/emulator/functionsEmulator.js'],
  ['superstatic', '10.0.0', 'lib/utils/patterns.js'],
];
for (const [name, version, relative] of patches) {
  const manifest = require.resolve(`${name}/package.json`);
  if (JSON.parse(fs.readFileSync(manifest, 'utf8')).version !== version) {
    throw new Error(`Review minimatch compatibility before upgrading ${name}`);
  }
  const file = path.join(path.dirname(manifest), relative);
  const source = fs.readFileSync(file, 'utf8');
  const before = 'const minimatch = require("minimatch");';
  const after = 'const { minimatch } = require("minimatch");';
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) {
    throw new Error(`Unexpected minimatch consumer: ${name}/${relative}`);
  }
  fs.writeFileSync(file, source.replace(before, after));
}
