# GATE 2027 CSE Prep App (Offline)

A lightweight, offline-first dashboard to plan your daily study, track the GATE CSE syllabus, log mock tests, run topic quizzes, and keep revision notes.

## Features

- Topic tracker with auto-quiz on completion
- Study streak tracking + streak map
- Quiz history panel
- Curated resource library per subject (including YouTube + Telegram links)
- Add your own resources + search filter
- Offline doubt solver (local notes + summaries)
- Topic visuals for quick mental maps
- Offline-capable installable PWA

## Run (offline)

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`

> You can also open `index.html` directly, but PWA install/offline caching is best via a local server.

## Deploy (static)

### Option 1: GitHub Pages

1. Create a GitHub repo and push this folder.
2. In repo **Settings → Pages**, select the branch and root folder.
3. Save. GitHub will provide your site URL.

### Option 2: Netlify (drag & drop)

1. Create a new site in Netlify.
2. Drag this folder into the deploy area.
3. Netlify will give you a live URL.

### Option 3: Vercel (static)

1. Import the repo into Vercel.
2. Set framework to **Other** and build command to none.
3. Deploy.

## Data storage

Your data is saved locally in the browser using `localStorage`.
Use **Export** to download a backup and **Import** to restore it later.
