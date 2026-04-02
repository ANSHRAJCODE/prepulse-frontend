# 🚀 PrepPulse AI — Campus Placement Decision Support System

> An AI-driven multi-role platform that replaces static placement databases with an intelligent engine that audits student skills, calculates real-time eligibility, and uses a Local LLM (Ollama/Llama3) to bridge skill gaps.

---

## 📁 Project Structure

```
prepulse/
├── backend/                  # FastAPI Python backend
│   ├── main.py               # App entry point
│   ├── seed.py               # Database seeder (run this first!)
│   ├── requirements.txt
│   ├── .env
│   └── app/
│       ├── api/routes/       # auth, students, jobs, applications, admin, ai
│       ├── core/             # config, security, dependencies
│       ├── db/               # database.py
│       ├── models/           # SQLAlchemy models
│       ├── schemas/          # Pydantic schemas
│       └── services/         # match_engine.py, ollama_service.py
│
└── frontend/                 # React + Vite + Tailwind
    ├── src/
    │   ├── pages/            # All page components
    │   ├── components/       # Shared Layout
    │   ├── store/            # Zustand auth store
    │   └── utils/            # axios api utility
    └── package.json
```

---

## ⚡ Quick Setup

### Step 1: Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Seed the database with demo data
python seed.py

# Start the backend server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**  
API Docs: **http://localhost:8000/api/docs**

---

### Step 2: Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

### Step 3: AI (Optional but recommended)

```bash
# Install Ollama from https://ollama.ai
# Then pull the Llama3 model:
ollama pull llama3

# Start Ollama (usually auto-starts)
ollama serve
```

> Without Ollama, the system uses a smart fallback roadmap template. The AI endpoint degrades gracefully.

---

## 🔐 Demo Accounts

| Role     | Email               | Password |
|----------|---------------------|----------|
| Student  | student@demo.com    | demo123  |
| Admin    | admin@demo.com      | demo123  |
| Company  | tech@demo.com       | demo123  |
| Student  | priya@demo.com      | demo123  |

---

## 🛠 Tech Stack

| Layer        | Technology                    |
|-------------|-------------------------------|
| Backend     | Python 3.12+, FastAPI         |
| ORM         | SQLAlchemy 2.0                |
| Auth        | JWT (python-jose + passlib)   |
| Database    | SQLite (dev) / PostgreSQL (prod) |
| Frontend    | React 18 + Vite               |
| Styling     | Tailwind CSS                  |
| State       | Zustand                       |
| Charts      | Recharts                      |
| AI          | Ollama (Llama3)               |
| HTTP Client | Axios                         |

---

## 🎯 Features

### Student Role
- ✅ Profile management (CGPA, skills, certifications, links)
- ✅ Browse and apply to jobs
- ✅ Real-time match percentage per job
- ✅ AI-generated 3-step learning roadmap (via Ollama)
- ✅ Application status tracking

### Admin (Placement Cell)
- ✅ Batch analytics dashboard
- ✅ Department readiness heatmap
- ✅ Application pipeline chart
- ✅ Student management table

### Company (Recruiter)
- ✅ Post jobs with skill requirements & branch filters
- ✅ View ranked candidates by match percentage
- ✅ Application management with status updates

---

## 🧠 Match Engine Algorithm

```
match_percentage = required_skills_score (70%) + preferred_skills_score (10%) + cgpa_score (20%)

Gates:
- CGPA < min_cgpa → hard cap at 40%
- Branch mismatch → 0% (ineligible)
- match < 50% → overall_eligible = false
```

---

## 📡 API Endpoints

```
POST /api/auth/register        — Register user
POST /api/auth/login           — Login (returns JWT)
GET  /api/auth/me              — Current user

GET  /api/students/profile     — Get student profile
PUT  /api/students/profile     — Update profile

GET  /api/jobs/                — List all jobs
GET  /api/jobs/{id}            — Job details
POST /api/jobs/                — Create job (company)
GET  /api/jobs/{id}/match      — Get match % for current student
GET  /api/jobs/{id}/ranked-students — Ranked candidates (admin/company)

POST /api/applications/apply   — Apply to job
GET  /api/applications/my      — My applications
PATCH /api/applications/{id}/status — Update status (admin/company)

GET  /api/admin/dashboard      — Admin analytics
GET  /api/admin/students       — All students
GET  /api/admin/readiness-heatmap — Dept readiness data

POST /api/ai/roadmap/{job_id}  — Generate AI roadmap
GET  /api/ai/status            — Check Ollama status
```

---

## 🚀 Production Deployment

```bash
# Backend → Render/Railway
# Set DATABASE_URL to PostgreSQL connection string in .env
# Set SECRET_KEY to a long random string

# Frontend → Vercel
# Set VITE_API_URL=https://your-backend.render.com
```

---

## 📄 License

MIT — Free to use for academic and educational purposes.
