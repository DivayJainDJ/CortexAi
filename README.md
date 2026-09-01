# CortexAI

A microservices-based AI platform with an agentic RAG pipeline, real-time chat, and billing — built with Node.js and deployed on Vercel.

**[Live Demo](https://cortex-ai-ruby.vercel.app)**

---

## What It Does

CortexAI is a full-stack AI product that combines:

- **Agentic RAG** — LangGraph-powered agent that retrieves, reasons, and generates answers from indexed documents
- **Real-time Chat** — WebSocket-based chat interface with conversation history
- **Document Processing** — PDF parsing, text extraction, and vector embedding
- **Billing** — Credit-based system with Razorpay integration
- **Auth** — Firebase authentication with session management

---

## Architecture

```
React Frontend (Vercel)
        ↓
   API Gateway (Express)
   ┌────┬────┬────┬────┐
   ↓    ↓    ↓    ↓    ↓
 Auth  Chat Agent Billing
        ↓
   MongoDB + Redis
        ↓
   LangGraph Agent
   ├── Groq (LLM)
   ├── Qdrant (Vector DB)
   └── Tavily (Web Search)
```

**Services:**

| Service | Port | Description |
|---------|------|-------------|
| Gateway | 8000 | API routing, rate limiting, auth middleware |
| Auth | 8001 | Firebase login, session management |
| Chat | 3002 | Conversation history, real-time messaging |
| Agent | 3003 | RAG pipeline, document processing, LLM inference |
| Billing | 3004 | Credit management, Razorpay payments |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| LLM | Groq (LangChain) |
| Workflow | LangGraph |
| Vector DB | Qdrant |
| Database | MongoDB (Mongoose) |
| Cache | Redis |
| Auth | Firebase Admin |
| Payments | Razorpay |
| Search | Tavily |
| Deploy | Vercel (frontend), Docker (backend) |

---

## Project Structure

```
CortexAi/
├── frontend/               # React + Vite client
├── backend/
│   ├── gateway/            # API gateway with middleware
│   ├── shared/             # Shared utilities (Redis client)
│   └── services/
│       ├── auth/           # Firebase authentication
│       ├── chat/           # Chat & conversation history
│       ├── agent/          # LangGraph RAG agent
│       │   ├── agents/     # Agent definitions
│       │   ├── graph/      # LangGraph workflow
│       │   └── controllers/
│       └── billing/        # Credit system & payments
└── vercel.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis
- Firebase project
- API keys: Groq, Qdrant, Tavily, Razorpay

### Installation

```bash
git clone https://github.com/DivayJainDJ/CortexAi.git
cd CortexAi

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Setup

Each service needs its own `.env` file. Required variables:

```env
# Auth
FIREBASE_SERVICE_ACCOUNT=...

# Agent
GROQ_API_KEY=...
QDRANT_URL=...
QDRANT_API_KEY=...
TAVILY_API_KEY=...

# Billing
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

# Database
MONGODB_URI=mongodb://localhost:27017/cortex
REDIS_URL=redis://localhost:6379
```

### Run with Docker

```bash
cd backend
docker-compose up -d redis
npm run dev  # Start each service
```

---

## How It Works

1. **Upload** — User uploads a document (PDF) through the frontend
2. **Process** — Agent service extracts text, chunks it, and embeds with LangChain
3. **Store** — Embeddings are stored in Qdrant for vector search
4. **Query** — User asks a question; LangGraph agent classifies and routes the query
5. **Retrieve** — Agent searches Qdrant for relevant document chunks
6. **Generate** — Groq LLM generates an answer from the retrieved context
7. **Respond** — Answer is streamed back through the chat interface

---

## Author

**Divay Jain**
- GitHub: [DivayJainDJ](https://github.com/DivayJainDJ)

---

## License

MIT
