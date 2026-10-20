# KepenkPro — Service Website and Firebase Admin Template

A responsive roller-shutter, garage-door and automation service website with lead collection, editable content, an image gallery and a Firebase administration panel. Built with HTML, Tailwind CSS and vanilla JavaScript, backed by Firebase Authentication, Firestore and Storage.

## Repository layout

| Path | Purpose |
|---|---|
| `public/index.html` | Public website and enquiry forms |
| `public/ek-panel.html` | Administration panel |
| `public/js/firebase-config.js` | Public Firebase project configuration |
| `public/js/admin-access.js` | Shared strict administrator-claim check |
| `public/js/inline-editor.js` | Administrator-only content editing |
| `firestore.rules`, `storage.rules` | Server-enforced authorization |
| `firebase.json` | Hosting, rules and HTTP security headers |

The sample business content is Turkish and can be customized in HTML and through the CMS. Replace the brand, phone/WhatsApp details, service areas, images, domain, sitemap and policy templates before using it for a business.

## Local setup

```bash
git clone https://github.com/Bluetwinklez/website-tempalte-kepenk.git
cd website-tempalte-kepenk
npm install
npm run check
npm test
```

Use Node 22 or newer. Create a Firebase project, enable Email/Password Authentication, create Firestore and Storage, and copy your web application's public configuration into `public/js/firebase-config.js`. Firebase web configuration identifies a project; the deployed security rules protect its data.

## Administrator provisioning

**Signing in alone does not grant administration rights.** Firestore writes, private lead access and Storage uploads require a Firebase custom claim with the boolean value `admin: true`. Both the panel and inline editor check the same claim. Ordinary authenticated users are denied.

Create your administrator in Firebase Authentication, then grant the claim from a trusted machine using the Admin SDK. Use Application Default Credentials authorized for the intended Firebase project; keep service-account credentials outside this repository:

```bash
npm run admin:grant -- YOUR_FIREBASE_PROJECT_ID YOUR_ADMIN_USER_UID
```

Sign out and back in after granting or changing claims. The script preserves other existing claims. Never let a browser, public form, or ordinary user assign this claim.

## Deployment

Install the Firebase CLI, sign in, select your project, and deploy the rules together with hosting:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase emulators:start --only hosting
firebase deploy --only firestore:rules,storage,hosting
```

Publishing code to GitHub does not deploy your Firebase project. Deploying only hosting leaves old server rules active. This repository does not include production credentials.

## Data access

- Public visitors may read public content and submit a size-validated lead with `handled: false` and a server timestamp.
- Only administrators may read, update or delete leads, change content, or upload permitted images.
- Unknown document paths are denied. Public image reads support the gallery.
- Client-side visibility is convenience; the server rules enforce authorization.

Enquiry rules do not provide spam rate limiting. Add deployment-specific abuse controls when operating a public production form. Replace the sample privacy/cookie notices with accurate business-specific notices.

## Dependency status

The Node toolchain is development-only. A scoped override updates the Firestore client’s vulnerable gRPC dependency. Some Firebase CLI transitive advisories remain upstream; see [the dependency review](docs/DEPENDENCY_REVIEW.md) for exact scope, audit commands and limitations.

## Validation

`npm run check` checks administration scripts; `npm test` verifies claim handling for anonymous users, ordinary users, malformed claims, token failures and administrators. `npm run test:rules` starts isolated Firestore/Storage emulators under the demo project and tests server authorization, forged lead fields, timestamp validation, public reads, image restrictions and administrator deletion. It requires Java 21 and downloads emulator binaries on first use. CI runs all three checks. [Previous detailed template guide (Turkish)](README.tr.md). [MIT license](LICENSE).
