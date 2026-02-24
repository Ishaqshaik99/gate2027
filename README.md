# EduTwin AI Web Application

EduTwin AI is an end-to-end web application focused on educational accessibility, personalization, and teacher decision support.

## What this app includes

- Student Learning Twin
- Multilingual explain mode (`/api/explain`) with OpenAI fallback to local explain engine
- Adaptive 5-question micro-quizzes (`/api/quiz/generate`, `/api/quiz/submit`)
- Student weak-topic + risk insights (`/api/student/:id/insights`)
- Teacher Insight Twin
- Class concept-confusion dashboard (`/api/teacher/:classId/dashboard`)
- At-risk and silent-struggler detection
- AI-generated intervention suggestions (`/api/teacher/:classId/interventions`)
- Demo data seeding for presentations (`/api/demo/seed`)

## Tech

- Frontend: Vanilla HTML/CSS/JS (single-page)
- Backend: Node.js HTTP server (`server.js`)
- Persistence: local JSON file at `data/edutwin-db.json`
- Optional AI: OpenAI Responses API via `OPENAI_API_KEY`

## Run locally

```bash
npm start
```

Open: `http://localhost:3000`

## Optional environment variables

```bash
export OPENAI_API_KEY="your_key_here"
export OPENAI_MODEL="gpt-4.1-mini"
```

If API key is not set, explain mode still works using a local fallback explanation engine.

## Main APIs

- `GET /api/health`
- `GET /api/concepts`
- `POST /api/users`
- `POST /api/explain`
- `POST /api/quiz/generate`
- `POST /api/quiz/submit`
- `GET /api/student/:userId/insights`
- `GET /api/teacher/:classId/dashboard`
- `POST /api/teacher/:classId/interventions`
- `POST /api/demo/seed`

## Demo flow

1. Create student profile
2. Ask a concept question and generate explanation
3. Take adaptive quiz and submit
4. Open teacher role and load dashboard
5. Seed demo data if needed, then generate interventions
