# Zone Scout: phone setup

This folder is the standalone Zone Scout app. Once installed it works with no signal,
and everything you log is stored only on your phone.

Files: `index.html` (the app), `sw.js` (offline cache), `manifest.webmanifest`,
`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, and this guide.

## 1. Put it online once (free, about 15 minutes)

The app has to be loaded once from a web address. After that it runs offline.

1. Make a free account at github.com.
2. Tap **+ → New repository**. Give it any name (for example `zs`), choose **Public**
   (free hosting needs a public repository), and tap **Create repository**.
3. On the new repository page, choose **Add file → Upload files** (or the
   "uploading an existing file" link). Upload the six app files, not the folder.
   On an iPhone, tap the zip in the Files app to unzip it first.
   Tap **Commit changes**.
4. Open **Settings → Pages**. Under **Build and deployment**, set Source to
   **Deploy from a branch**, Branch to **main** and folder **/ (root)**, then **Save**.
5. After a minute or two the page shows your address, like
   `https://yourname.github.io/zs/`.

## 2. Install it

**iPhone:** open the address in **Safari** → **Share** → **Add to Home Screen** → **Add**.
Always open Zone Scout from that icon. iPhone keeps the home-screen app's data
separate from Safari, and deleting the icon deletes its data.

**Android:** open the address in **Chrome** → **⋮** → **Install app** (or
**Add to Home screen**). Clearing Chrome's storage for that site deletes the app's data.

Open it once with signal, then turn on airplane mode and open it again to confirm
it works offline.

## 3. Lock and back up

In the app, tap **Backup & lock** on the home screen.

- **Set a PIN.** Zone Scout asks for it when it opens and after a minute in the
  background. There is no recovery if you forget it.
- **Save a backup file** every week or so, and keep it somewhere private
  (Files, Drive, or email to yourself). Never upload backups to the GitHub repository.
  The home screen reminds you when a backup is more than a week old.

## Privacy

The repository and address are public, so anyone who found the address would see an
empty copy of the app. Your walks, sprays and notes never leave your phone. The PIN
keeps someone holding your unlocked phone out of your records; it doesn't encrypt them.

## Updating

When you get a new version, upload the new `index.html` and `sw.js` over the old ones
(Add file → Upload files). The app picks up the update the next time it opens with
signal. Your data isn't touched by updates.
