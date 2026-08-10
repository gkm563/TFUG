# 🤝 Contributing to MindSpark Gemma

Thank you for your interest in contributing to **MindSpark Gemma**! We welcome community contributions, feature additions, bug fixes, and documentation improvements.

---

## 🛠️ Development Workflow

1. **Fork the Repository**: Create a fork of [`https://github.com/gkm563/TFUG`](https://github.com/gkm563/TFUG).
2. **Clone Locally**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TFUG.git
   cd TFUG
   npm install
   ```
3. **Configure Local Environment**:
   Create a `.env.local` file:
   ```env
   GOOGLE_API_KEY=YOUR_API_KEY_HERE
   GEMMA_MODEL=gemma-2-27b-it
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
5. **Verify Build & Types**:
   ```bash
   npx next build
   ```
6. **Submit a Pull Request**: Push your branch and open a PR against `main`.

---

## 📜 Code Style Guidelines

- **TypeScript**: Ensure strict typing for components and API handlers.
- **Styling**: Use Tailwind CSS classes and existing glassmorphism utilities in `app/globals.css`.
- **Security**: Never hardcode API keys or secret credentials.
