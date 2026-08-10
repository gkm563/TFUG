# 💎 MindSpark Gemma - Next-Gen AI Learning & Technical Architect

> **Build with Gemma Competition Submission** — Organized by **TFUG Prayagraj** & **AI Prayagraj**  
> Powered Exclusively by Google's **Gemma 2** (`gemma-2-27b-it` / `gemma-2-9b-it`)

[![Live Demo](https://img.shields.io/badge/Live_Demo-mindspark--gemma.vercel.app-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://mindspark-gemma.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub_Repo-gkm563%2FTFUG-2563eb?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gkm563/TFUG)
[![Model](https://img.shields.io/badge/Model-Gemma--2--27B--IT-06b6d4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![Next.js 14](https://img.shields.io/badge/Framework-Next.js_14_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## 🚀 Executive Summary

**MindSpark Gemma** is an open-source, full-stack AI learning studio engineered to bridge zero-to-one conceptual understanding, active learning recall, and code engineering. Built specifically for the **Build with Gemma** Kaggle competition, MindSpark Gemma transforms dense technical topics into structured mental models, interactive 3D flashcards, self-assessment quizzes, and production code reviews in real-time.

```
       ┌─────────────────────────────────────────────────────────────┐
       │                 User's Web Browser (Client)                 │
       │     Interactive Multi-Mode Studio • Glassmorphism UI        │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                         POST /api/gemma (Clean Payload)
                                      │
                                      ▼
       ┌─────────────────────────────────────────────────────────────┐
       │              Next.js Serverless Route Backend               │
       │    app/api/gemma/route.ts • process.env.GOOGLE_API_KEY     │
       │             ⚡ maxDuration = 60s Timeout Protection          │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                Google AI Studio REST Endpoint (Server-to-Server)
                                      │
                                      ▼
       ┌─────────────────────────────────────────────────────────────┐
       │             Google Gemma 2 Model Engine (Cloud)             │
       │        gemma-2-27b-it  |  gemma-2-9b-it  |  gemma-2-2b-it      │
       └─────────────────────────────────────────────────────────────┘
```

---

## 🔥 Key Features & Capabilities

### 💡 1. Concept Explainer & Mental Model Synthesizer
Transforms abstract engineering or scientific concepts into clear mental models:
- **Core Definition**: 1-2 sentence high-level summary.
- **Real-World Analogy**: Intuitive physical mental models (e.g. comparing Transformer Attention to library indexing).
- **Deep-Dive Pillars**: Key architectural takeaways.
- **Tone Customization**: Switch dynamically between **Pragmatic**, **ELI5**, and **Academic**.

### 🎴 2. Active Recall Flashcard Generator
Auto-extracts core principles from any technical input and builds structured Q&A decks:
- **Interactive 3D Cards**: Flip cards with a single click to reveal answers.
- **Active Recall**: Optimized for rapid memorization and exam preparation.

### 🛠️ 3. Code Architect & Refactoring Engineer
Paste raw snippets or technical requirements to receive:
- **Code Smell Review**: Vulnerability triage, race-condition checks, and antipattern identification.
- **Production Refactor**: Clean, syntax-highlighted solutions using modern best practices.
- **Big-O Analysis**: Time & Space complexity evaluation.

### ❓ 4. Interactive Quiz Master
Generates customized multiple-choice self-assessments:
- 3 to 5 targeted questions per topic.
- Instant rationale breakdown for correct vs. incorrect answers.

### 💬 5. Gemma Prompt Studio
Full control over generation parameters:
- **Creativity (Temperature Slider)**: Fine-tune from deterministic (0.1) to creative (1.0).
- **Model Switcher**: Dynamic selection between `gemma-2-27b-it`, `gemma-2-9b-it`, and `gemma-2-2b-it`.

---

## 🛡️ Hackathon Rule Compliance & Security Verification

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Strictly Gemma API** | Exclusively calls Google AI Studio Gemma endpoints (`gemma-2-27b-it` / `gemma-2-9b-it`). Zero third-party LLMs (No Gemini, ChatGPT, or Claude). | ✅ **Compliant** |
| **Zero Key Exposure** | `GOOGLE_API_KEY` is loaded on the server side (`process.env.GOOGLE_API_KEY`). Browser bundles contain zero references to secret keys. | ✅ **Compliant** |
| **Vercel 10s Timeout Fix** | Configured `export const maxDuration = 60;` in `app/api/gemma/route.ts` to accommodate multi-part flashcard generations. | ✅ **Compliant** |
| **Public GitHub Code** | Source code, components, routes, and configs public at [`https://github.com/gkm563/TFUG`](https://github.com/gkm563/TFUG). | ✅ **Compliant** |
| **Live Deployed App** | Live and publicly accessible at [`https://mindspark-gemma.vercel.app`](https://mindspark-gemma.vercel.app). | ✅ **Compliant** |

---

## 📁 Repository Directory Architecture

```
TFUG/
├── app/
│   ├── api/
│   │   └── gemma/
│   │       └── route.ts         # Serverless API Handler (Gemma REST API + Key Isolation + maxDuration=60)
│   ├── globals.css              # Dark Glassmorphism CSS design system & typography
│   ├── layout.tsx               # Root Layout & Metadata
│   └── page.tsx                 # Main Interactive Dashboard UI
├── components/
│   ├── Header.tsx               # Top Bar, Gemma Model Dropdown & Status Badges
│   ├── Sidebar.tsx              # Mode Navigation & Session History Manager
│   ├── StudioWorkspace.tsx      # Prompt Input Editor, Parameter Sliders & Template Chips
│   ├── ResultViewer.tsx         # Markdown Renderer, Flashcard Flip View & Audio Reader
│   └── KaggleChecklistModal.tsx # Interactive Hackathon Submission Checklist
├── public/                      # Static Assets
├── .env.example                 # Environment Variable Documentation
├── .gitignore                   # Environment & Build Exclusion Rules
├── next.config.mjs              # Next.js 14 Production Config
├── package.json                 # Project Dependencies & Build Scripts
├── tailwind.config.ts           # Custom Gemma Color Palette & Styling Tokens
├── tsconfig.json                # Strict TypeScript Settings
├── vercel.json                  # Explicit Next.js Framework Deployment Settings
└── README.md                    # Submission Documentation
```

---

## 🛠️ Local Development Quickstart

### Prerequisites
- Node.js `v18.0.0` or higher
- Google AI Studio API Key ([Get an API Key here](https://aistudio.google.com))

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/gkm563/TFUG.git
cd TFUG
npm install
```

### 2. Set Up Environment Variables
Create `.env.local` in the root directory:
```env
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
GEMMA_MODEL=gemma-2-27b-it
```

### 3. Run Development Server
```bash
npm run dev
```
Open [`http://localhost:3000`](http://localhost:3000) in your browser.

---

## ☁️ Vercel Deployment Guide

To deploy your own instance to Vercel:

1. Fork or push this repository to your GitHub account.
2. Go to [vercel.com/new](https://vercel.com/new) and select the repository.
3. Under **Environment Variables**, add:
   - `GOOGLE_API_KEY` = `YOUR_GOOGLE_API_KEY_HERE`
   - `GEMMA_MODEL` = `gemma-2-27b-it`
4. Click **Deploy**. Vercel will auto-detect Next.js and build the application cleanly.

---

## 📊 Technical Stack & Dependencies

- **Core Framework**: [Next.js 14 (App Router)](https://nextjs.org)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + Custom Glassmorphism System
- **Icons**: [Lucide React](https://lucide.dev)
- **Markdown & Code Highlighting**: `react-markdown` + `remark-gfm`
- **AI Infrastructure**: Google AI Studio REST API (`gemma-2-27b-it`)

---

## 👥 Hackathon Submission Details

- **Event**: Build with Gemma Hackathon
- **Organizers**: TFUG Prayagraj & AI Prayagraj
- **Project Title**: MindSpark Gemma
- **GitHub Repository**: [https://github.com/gkm563/TFUG](https://github.com/gkm563/TFUG)
- **Live Deployed App**: [https://mindspark-gemma.vercel.app](https://mindspark-gemma.vercel.app)
- **Submission Form**: [Google Form](https://forms.gle/xz9Zu7VWn8aEvM6k8)

---

## 📜 License

This project is open-source under the [MIT License](LICENSE). Built with ❤️ for the global Google Developer & Gemma community.
