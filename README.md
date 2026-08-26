## 🚧 Work in Progress

This project is currently under active development. Some features may be incomplete or change as development continues.


# 🤖 LexarAI

### `AI-powered Career Assistant`

> **Analyse. Optimise. Build. Grow.**

LexarAI is a **Generative AI career platform** that helps users analyse resumes, improve ATS scores, build professional profiles, optimise profiles for specific job sectors, and interact with an AI career assistant.

---

## ✨ What can LexarAI do?

```text
📄 Resume
   ↓
🔍 ATS Analysis
   ↓
📊 Score + Suggestions
   ↓
👤 AI Profile
   ↓
💼 Job Sector Optimisation
   ↓
🤖 LexarAI Chatbot
```

### 🚀 Core Features

* 🤖 **LexarAI Chatbot** — Chat with AI for career & job guidance
* 📄 **Resume Upload & ATS Review** — Upload, scan, score & improve your resume
* 📝 **AI Resume Builder** — Create a professional resume with AI
* 👤 **AI Profile Builder** — Build a job-ready professional profile
* 💼 **Job Sector Optimisation** — Optimise resume & profile for target roles
* 📧 **AI Email Agent** — Generate and send professional emails with AI
* 🔐 **Authentication** — JWT + Google OAuth
* 👨‍💻 **Developer Profile** — Showcase skills, projects & professional information


---

## 🛠️ Tech Stack

```text
Frontend        → React.js + Next.js + CSS
Backend         → Node.js + Express.js
Database        → MongoDB + Mongoose
AI              → Generative AI
Authentication  → JWT + Google OAuth
Email           → Nodemailer
Security        → bcrypt.js + Helmet + CORS + Rate Limit
HTTP Client     → Axios
API Testing     → Postman
Version Control → Git + GitHub
```

### 🔧 Detailed Stack

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| ⚛️ React.js      | UI & components         |
| ▲ Next.js        | Application framework   |
| 🎨 CSS           | Styling & responsive UI |
| 🟢 Node.js       | Backend runtime         |
| 🚂 Express.js    | REST APIs               |
| 🍃 MongoDB       | Database                |
| 🧩 Mongoose      | MongoDB ODM             |
| 🤖 Generative AI | AI features & chatbot   |
| 🔐 JWT           | Authentication          |
| 🔑 Google OAuth  | Google login            |
| 📧 Nodemailer    | Email services          |
| 🔒 bcrypt.js     | Password hashing        |
| 🌐 Axios         | API requests            |
| 🛡️ Helmet       | Security headers        |
| 🚦 Rate Limit    | API protection          |
| 🍪 Cookie Parser | Cookie handling         |
| 🔗 CORS          | Cross-origin security   |
| 🧪 Postman       | API testing             |

---

## 📁 Project Structure

```text
LexarAI/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   ├── utils/
│   └── config/
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### 1️⃣ Clone

### 🚀 Getting Started

```bash
git clone 
cd Gen_Ai
```
**[🔗 Git Clone](https://github.com/lexarcoder/Gen_Ai.git)**

### 2️⃣ Install

```bash
npm install
```

If frontend and backend have separate packages:

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 3️⃣ Environment Variables

Create `.env`:

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

AI_API_KEY=your_ai_api_key

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

CLIENT_URL=http://localhost:3000
```

> 🔒 Never push `.env` to GitHub.

### 4️⃣ Run Development Server

```bash
npm run dev
```

Or, if frontend/backend are separate:

```bash
# Frontend
cd frontend
npm run dev
```

```bash
# Backend
cd backend
npm run dev
```

---

## 🔌 API Modules

```text
/auth
   ├── register
   ├── login
   ├── logout
   ├── google
   ├── verify-email
   └── forgot-password

/resume
   ├── upload
   ├── analyze
   └── ats-review

/profile
   ├── create
   ├── update
   └── get

/ai
   ├── chat
   ├── profile-builder
   └── career-analysis
```

---

## 🔐 Authentication Flow

```text
User
 ↓
Register / Google Login
 ↓
JWT Token
 ↓
Secure Cookie
 ↓
Protected API
 ↓
User Dashboard
```

Email verification and password recovery are handled through **Nodemailer**.

---

## 🤖 LexarAI

LexarAI is more than a chatbot.

```text
        ┌──────────────────┐
        │     LexarAI      │
        └────────┬─────────┘
                 │
      ┌──────────┼──────────┐
      ↓          ↓          ↓
   Resume     Profile     Career
   Review     Builder    Guidance
      │          │          │
      └──────────┼──────────┘
                 ↓
          🎯 Better Career
             Decisions
```

---

## 🔮 Future Roadmap

```text
[ ] 🎬 AI Video Generation
[ ] 🖼️ AI Image Generation
[ ] 📧 AI Email Agent
[ ] 🤖 Autonomous AI Career Agent
[ ] 🎤 AI Mock Interview
[ ] 📄 AI Resume Generator
[ ] ✍️ AI Cover Letter Generator
[ ] 🎯 Job Recommendation Engine
[ ] 🧠 Personal Career Roadmap
```

---
## 👨‍💻 Connect With Me

- 📧 **Email:** [LexarCoder](mailto:lexarcoder@gmail.com)
- 💼 **LinkedIn:** [LinkedIn](https://www.linkedin.com/in/lexarcoder/)
- 📸 **Instagram:** [Instagram](https://www.instagram.com/lexarcoder/)
- 📘 **Facebook:** [Facebook](https://www.facebook.com/lexarcoder)
- 🐙 **GitHub:** [LexarCoder](https://github.com/lexarcoder)
---

## ⭐ LexarAI

```text
Build your profile.
Optimise your resume.
Talk to AI.
Get career-ready. 🚀
```

**Built by [LexarCoder](https://github.com/lexarcoder)**
