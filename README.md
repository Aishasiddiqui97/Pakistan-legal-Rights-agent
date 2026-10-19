# Pakistan Legal Rights Agent 🇵🇰⚖️

An AI-powered legal information assistant for Sindh, Pakistan. Provides instant access to Pakistani labor laws, workplace harassment regulations, and tenant-landlord laws using Groq's advanced LLM and RAG (Retrieval-Augmented Generation).

**Live Demo:** https://pakistan-legal-rights-agent-xnqz.vercel.app

---

## 🌟 Features

- ✅ **AI-Powered Legal Analysis** - Get instant answers to legal questions about:
  - Employment disputes & unpaid salary claims
  - Workplace harassment & women's safety
  - Tenant-landlord disputes
  
- ✅ **Document Search** - Search through official Sindh legal documents
- ✅ **Multi-Language Support** - Urdu & English
- ✅ **RAG Technology** - Retrieves relevant laws and returns accurate citations
- ✅ **User Authentication** - Secure JWT-based auth
- ✅ **Production Ready** - Deployed on Vercel (Serverless)

---

## 📋 Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **LLM:** Groq API (Llama 3.3 70B)
- **Vector Store:** FAISS for document embeddings
- **Database:** SQLite
- **Authentication:** JWT + bcrypt
- **Deployment:** Vercel (Serverless)

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Deployment:** Vercel (Monorepo)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup

```bash
cd Backend

# Install dependencies
python -m pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Add your Groq API key
# Edit .env and set: GROQ_API_KEY=your_key_here

# Run locally
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will run on: `http://localhost:8000`

**Test health endpoint:**
```bash
curl http://localhost:8000/health/live
```

**API Documentation:**
```
http://localhost:8000/docs
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file for development
cp .env.example .env.local

# For LOCAL development, keep API pointing to localhost:
# VITE_API_BASE_URL=http://localhost:8000/api/v1

# For PRODUCTION, use deployed backend:
# VITE_API_BASE_URL=https://pakistan-legal-rights-agent-xnqz.vercel.app/api/v1

# Run development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 📦 Production Deployment

### Backend (Vercel)

1. **Environment Variables** (Set in Vercel Dashboard):
   ```
   GROQ_API_KEY=your_api_key
   CORS_ORIGINS=https://your-frontend-domain.com
   JWT_SECRET_KEY=your_secret_key
   APP_ENV=production
   ```

2. **Deploy:**
   ```bash
   git push origin main
   ```
   Vercel auto-deploys on push.

3. **Check Status:**
   ```bash
   curl https://pakistan-legal-rights-agent-xnqz.vercel.app/health/live
   ```

### Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel Dashboard
3. Auto-deploys on `git push`

---

## 🔌 API Endpoints

### Health Check
```
GET /health/live
GET /health/ready
```

### Authentication
```
POST /api/v1/auth/signup
POST /api/v1/auth/login
GET /api/v1/auth/me
```

### Legal Analysis
```
POST /api/v1/legal/analyze
  {
    "question": "What if my employer hasn't paid my salary for 3 months?",
    "category": "unpaid_salary"
  }

POST /api/v1/legal/search
  {
    "query": "minimum wages",
    "category": "unpaid_salary",
    "top_k": 5
  }
```

---

## 📁 Project Structure

```
.
├── Backend/
│   ├── app/
│   │   ├── api/routes/          # API endpoints
│   │   ├── core/                # Config, security, exceptions
│   │   ├── db/                  # Database models & sessions
│   │   ├── rag/                 # RAG pipeline (embeddings, vector store)
│   │   ├── services/            # Business logic
│   │   ├── schemas/             # Pydantic models
│   │   └── main.py              # FastAPI app
│   ├── api/
│   │   └── index.py             # Vercel serverless entry point
│   ├── data/documents/          # Legal documents
│   ├── requirements.txt
│   ├── vercel.json              # Vercel config
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Main app & router
│   │   ├── components/          # React components
│   │   ├── services/            # API client
│   │   ├── hooks/               # Custom hooks
│   │   ├── styles/              # Tailwind CSS
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
└── README.md
```

---

## 🔑 Environment Variables

### Backend (.env)
```
APP_ENV=production
GROQ_API_KEY=your_groq_api_key
CORS_ORIGINS=https://your-frontend-domain.com
JWT_SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///./legalsaathi.db
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=https://pakistan-legal-rights-agent-xnqz.vercel.app/api/v1
VITE_ENABLE_MOCK_API=false
```

---

## 📚 Supported Documents

The system includes official Sindh laws:
- **Employment:** Sindh Minimum Wages Act 2015, Payment of Wages Act 2015, Terms of Employment Act 2015
- **Harassment:** Protection Against Harassment of Women at the Workplace Act 2010
- **Tenant:** Sindh Rented Premises Ordinance 1979

---

## 🧪 Testing

### Backend Tests
```bash
cd Backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 📝 Development Workflow

1. **Make changes locally**
   ```bash
   # Backend changes
   cd Backend
   # ... make changes ...
   
   # Frontend changes
   cd frontend
   # ... make changes ...
   ```

2. **Test locally**
   ```bash
   # Terminal 1: Backend
   python -m uvicorn app.main:app --reload
   
   # Terminal 2: Frontend
   npm run dev
   ```

3. **Commit & Push**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

4. **Auto-deploys to Vercel** ✅

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Clear cache & reinstall
pip install --force-reinstall -r requirements.txt
```

### Frontend can't connect to backend
- Check `VITE_API_BASE_URL` in `.env.local`
- Verify backend is running or Vercel deployment is live
- Check CORS settings in backend `.env`

### Vercel deployment fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `requirements.txt` has all dependencies

---

## 🔐 Security

- JWT tokens with 24-hour expiration
- Bcrypt password hashing
- CORS middleware configured
- Environment variables for sensitive data
- Input validation on all endpoints

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👥 Contributors

- **Aisha Siddiqui** - Project Lead & Developer

---

## 📞 Contact

For questions or issues:
- GitHub: https://github.com/Aishasiddiqui97/Pakistan-legal-Rights-agent
- Email: [Your Email]

---

## 🎯 Roadmap

- [ ] Add more legal categories (criminal law, family law)
- [ ] Multi-language support (Sindhi, Pashto)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with legal consultants

---

**Made with ❤️ for Pakistan** 🇵🇰
