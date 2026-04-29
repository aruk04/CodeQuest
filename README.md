# CodeQuest — Duolingo for Coding 🚀

An AI-powered coding learning platform with adaptive lessons, live code execution, gamified progress tracking, and a GPT-4o tutor.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion + Monaco Editor
- **Backend**: FastAPI (Python) + SQLAlchemy async + PostgreSQL + Redis
- **AI**: OpenAI GPT-4o (roadmap generation, adaptive lessons, hints, debugging)
- **Code Execution**: Judge0 CE (Self-hosted via Docker)
- **Auth**: JWT (email + password)

---

## Quick Start

### 1. Clone and setup
```bash
cd c:\Users\ashir\ai-app
```

### 2. Start PostgreSQL + Redis (Docker)
```bash
docker-compose up -d
```

### 3. Backend setup
```bash
cd backend
# Copy env file and fill in your API keys
copy .env.example .env

# Create and activate virtualenv
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000
```

### 4. Frontend setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 5. Open in browser
- **App**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **pgAdmin**: http://localhost:5050 (admin@codequest.dev / admin)

---

## Required API Keys (in `backend/.env`)

| Key | Where to get |
|-----|-------------|
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys |

*Note: Judge0 now runs locally via Docker, so no `JUDGE0_API_KEY` is required.*

---

## Features

| Feature | Status |
|---------|--------|
| Email/password auth | ✅ |
| 4-step onboarding | ✅ |
| AI roadmap generation  | ✅ |
| AI lesson generation  | ✅ |
| MCQ, fill-in, code exercises | ✅ |
| Live code execution (Judge0) | ✅ |
| AI tutor chat | ✅ |
| AI debug assistant | ✅ |
| XP + level system | ✅ |
| Daily streaks | ✅ |
| Weak area detection | ✅ |
| Adaptive difficulty | ✅ |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/users/onboard` | Complete onboarding |
| POST | `/api/roadmap/generate` | Generate AI roadmap |
| GET | `/api/roadmap/me` | Get active roadmap |
| POST | `/api/lessons/generate` | Generate AI lesson |
| GET | `/api/lessons/{id}` | Get lesson |
| POST | `/api/lessons/{id}/submit` | Submit answer |
| POST | `/api/lessons/{id}/complete` | Complete lesson |
| GET | `/api/progress/summary` | XP/level/streak |
| GET | `/api/progress/weak-areas` | Topics needing revision |
| POST | `/api/ai/explain` | Explain concept |
| POST | `/api/ai/hint` | Get hint |
| POST | `/api/ai/debug` | Debug code |
| POST | `/api/ai/chat` | Chat with AI tutor |
| POST | `/api/code/run` | Execute code |
| POST | `/api/code/validate` | Validate code output |
