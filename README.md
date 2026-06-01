# ClarityOS — India's Financial Document Decoder

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env        # Add your GEMINI_API_KEY (free at aistudio.google.com)
npm install
npm run dev                  # Runs on http://localhost:4000
```

### Frontend
```bash
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:4000
npm install
npm run dev                  # Runs on http://localhost:5173
```

Open http://localhost:5173 in your browser.

## Deployment
- **Backend** → Railway / Render / Fly.io (set GEMINI_API_KEY + ALLOWED_ORIGIN in dashboard)
- **Frontend** → Vercel / Netlify (set VITE_API_URL to your backend URL)

## Security
- Gemini API key lives only in backend/.env — never exposed to frontend
- Helmet.js, strict CORS, rate limiting, input sanitisation, PDF validation
- No document content is ever logged or stored

## Tools
1. 📋 PolicySaathi — Insurance decoder
2. 🏦 LoanLens — Loan cost decoder
3. 🏗️ FlatTruth — Builder agreement decoder
4. 📈 MutualMirror — Mutual fund decoder
5. 💼 SalaryScan — Offer letter decoder
6. 🏥 BillBreaker — Hospital bill decoder
