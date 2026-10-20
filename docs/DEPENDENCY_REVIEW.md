# Development dependency review

Reviewed on 2026-10-20. This website ships static files from `public/`; Node dependencies are used for local administration, tests and the Firebase CLI, and are declared as development dependencies.

## Corrected dependency

Firebase's Node Firestore client pinned an old `@grpc/grpc-js` release. A scoped npm override selects **1.14.6**, matching the patched version already used by the Admin SDK. The lockfile is regenerated and the emulator suite verifies compatibility. Keep the override until the upstream Firestore dependency incorporates a patched version.

## Remaining upstream advisories

At this review, `npm audit` reports **7 development-tree findings: 3 high and 4 moderate**. The affected dependency paths involve Firebase CLI, chokidar/braces, OpenTelemetry, Pub/Sub and gaxios/uuid. Some entries are parent-package reports of the same underlying issue.

There is no compatible in-range resolution for all these findings in the selected upstream toolchain. The audit's suggested major downgrades do not establish a safe, compatible fix. No advisory has been suppressed and the test workflow does not claim a clean full dependency audit.

`npm audit --omit=dev` reports **zero findings** for the production Node dependency set. This describes this repository's npm classification; it does not certify browser SDKs, CDN assets, a deployed Firebase project, or freedom from security issues.

Use the CLI and emulators in a trusted development/CI environment. Do not expose their development services to untrusted networks or pass untrusted filesystem patterns to them. Track compatible upstream patches, refresh the lockfile, and rerun the full authorization suite before removing overrides or changing major versions.

## Reproduce

```bash
npm ci
npm run check
npm test
npm run test:rules
npm audit
npm audit --omit=dev
```

Rules tests require Java 21. They use the isolated `demo-kepenkpro` project and synthetic accounts, not production credentials or customer leads. Passing tests do not deploy server rules: production owners must deploy `firestore:rules,storage,hosting` and provision the administrator claim separately.
