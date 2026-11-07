# Collab Workspace

A Notion-style notes app. Create notes, format text with a rich editor, and see changes sync live between browser tabs and devices.

Stack: React, Draft.js, Firebase (Firestore), Node.js tooling with Vite.

## Features

- Create, search, and delete notes
- Rich text: bold, italic, underline, inline code, headings, bullet and numbered lists, quotes
- Autosave to Firestore a moment after you stop typing
- Real-time sync: edits made on one device show up on the others
- Works on phone-sized screens with a slide-out notes list

## Firebase setup

1. Go to the Firebase console and create a project.
2. In Build, open Firestore Database and create a database in test mode.
3. In Project settings, add a web app and copy the config values.
4. Copy `.env.example` to `.env` and paste the values in.

For a quick demo the Firestore rules can be open for a short time:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{note} {
      allow read, write: if true;
    }
  }
}
```

Lock these down before using real data.

## Run it

```
npm install
npm run dev
```

Open http://localhost:5173 in two windows to see live sync.

## How sync works

Each note is one Firestore document. The editor content is stored as Draft.js raw JSON. Every save also records which tab wrote it, so a tab ignores its own updates and only applies changes that came from somewhere else. If two people type at the very same moment, the last save wins.
