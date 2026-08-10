# ⚡ MindSpark Gemma - AI Study & Technical Learning Companion

**Build with Gemma Hackathon Submission (TFUG Prayagraj / AI Prayagraj)**

[![Deployment](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)
[![Model](https://img.shields.io/badge/Model-Gemma--2--27b--it-blue?logo=google)](https://aistudio.google.com)
[![License](https://img.shields.io/badge/License-MIT-green)](#)

---

## 🌟 Overview

**MindSpark Gemma** is an advanced AI learning & study studio powered exclusively by Google's **Gemma** model family (`gemma-2-27b-it` / `gemma-2-9b-it`). Designed to bridge zero-to-one conceptual understanding and code mastery, MindSpark Gemma delivers:

- 💡 **Concept Explainer**: Mental models, real-world analogies, and structured pillars.
- 🎴 **Interactive Flashcards**: Auto-generated active recall study decks with 3D flip card interactions.
- 🛠️ **Code Architect**: Code optimization, bug review, big-O analysis, and design pattern refactoring.
- ❓ **Quiz Master**: Self-assessment multiple-choice questions with answer explanations.
- 💬 **Gemma Studio Chat**: Direct instruction-tuned assistant powered strictly by Gemma 2.

---

## 🔒 Security Architecture (API Key Isolation)

Per competition rules, your `GOOGLE_API_KEY` **must never reach the client's browser**.

```
User's Browser (Frontend)
       │
       │  POST /api/gemma (JSON payload, NO API KEY)
       ▼
Next.js Serverless Route (app/api/gemma/route.ts)
       │  [Holds process.env.GOOGLE_API_KEY securely]
       │  export const maxDuration = 60;
       ▼
Google AI Studio Gemma REST API (generativelanguage.googleapis.com)
       │  Gemma 2 27B IT / Gemma 2 9B IT Execution
       ▼
Returns generated answer back to frontend
```

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/mindspark-gemma.git
cd mindspark-gemma
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GOOGLE_API_KEY=your_actual_aistudio_key_here
GEMMA_MODEL=gemma-2-27b-it
```

### 3. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🌐 Vercel Deployment Guide (Step 9)

1. Push your repository to GitHub (ensure repo is **Public**).
2. Log into [Vercel](https://vercel.com) -> Click **Add New Project**.
3. Import your GitHub repository.
4. Expand **Environment Variables** and add:
   - `GOOGLE_API_KEY` = `your_google_ai_studio_key`
   - `GEMMA_MODEL` = `gemma-2-27b-it`
5. Click **Deploy**.
6. Once deployed, open your live `.vercel.app` URL and verify generation!

---

## 📽️ Demo Video Recording Checklist (Step 13)

Record a **2 to 3 minute continuous video** (no editing, unlisted on YouTube):
1. State your name and project name (*MindSpark Gemma*).
2. Open your live `.vercel.app` URL in a browser tab.
3. Type a topic (e.g., *"Explain Transformer Attention"*), click **Generate**, and wait live for Gemma's response.
4. Show a second example or switch to **Flashcards / Code Architect** mode.
5. Open your GitHub repo, navigate to [`app/api/gemma/route.ts`](file:///app/api/gemma/route.ts), and point to the server route calling the Gemma API.

---

## 📝 Kaggle Writeup Template (Step 14)

Copy and adapt this writeup into your Kaggle submission:

```markdown
# MindSpark Gemma - AI Study & Technical Learning Companion

**Submission Track:** Build with Gemma Hackathon (TFUG Prayagraj)

### 💡 Inspiration
Students and developers often struggle to bridge abstract theory with practical code logic. We built MindSpark Gemma to transform complex concepts into intuitive mental models, interactive flashcards, self-assessment quizzes, and code architecture reviews—powered entirely by Google's Gemma models.

### 🛠️ How we built it
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide icons, Markdown parser with syntax highlighting.
- **Backend Server**: Next.js Serverless API Route (`/api/gemma`) with `export const maxDuration = 60;` to prevent serverless timeouts.
- **AI Model**: Google AI Studio REST API targeting `gemma-2-27b-it` (Strictly Gemma, no other AI model).
- **Security**: Complete server-side isolation of `GOOGLE_API_KEY`.

### 🎥 The Prototype
- **Live Vercel Application**: [https://your-project.vercel.app](https://your-project.vercel.app)
- **GitHub Repository**: [https://github.com/YOUR_USERNAME/mindspark-gemma](https://github.com/YOUR_USERNAME/mindspark-gemma)
- **Demo Video**: [Insert YouTube URL Here]

### 🥊 Challenges we ran into
Preventing serverless function timeouts while generating detailed multi-part study flashcards, which we solved using Next.js `maxDuration = 60` and direct REST streaming structure.
```

---

## 📋 Final Submission Form Links

- **Kaggle Competition**: [Build with Gemma - TFUG Prayagraj](https://www.kaggle.com/competitions/build-with-gemma-tfug-prayagraj-ai-prayagraj-in-person)
- **Google Submission Form**: [Submit Here](https://forms.gle/xz9Zu7VWn8aEvM6k8)

---

## 📄 License
MIT License. Built for the Build with Gemma Competition.
