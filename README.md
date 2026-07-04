# blockinv — Block Inventory lookup

Static, encrypted lookup page for **Block Inventory**, a private home tool/box tracking system.

## What it does

- Scan a box's QR sticker → opens `?b=<box-id>` → shows that box's type, current location and contents.
- Search items by name or code (`IT####`), browse all boxes, filter by aisle/type.
- Installable to a phone home screen and **works offline** (PWA).

## Privacy

The inventory data (`data.enc`) is stored **encrypted** — AES-256-GCM with a key derived from a
passcode via PBKDF2-SHA256. Only ciphertext is in this public repo; the page decrypts in your
browser after you enter the passcode. "Remember this device" keeps you signed in.

## This repo is generated — don't hand-edit

`index.html` and `data.enc` are produced by a `publish.py` script in a private source repo that
bundles the inventory, encrypts it, and pushes here. Editing files here directly will be
overwritten on the next publish.

`.nojekyll` disables Jekyll for faster, more reliable Pages builds.

## Files

| File | What |
|---|---|
| `index.html` | The app — self-contained, native Web Crypto, no dependencies |
| `data.enc` | Encrypted inventory bundle (boxes, items, types, places) |
| `manifest.webmanifest`, `sw.js`, `icon-*.png` | PWA: installable + offline |
