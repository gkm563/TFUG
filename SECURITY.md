# 🛡️ Security Policy & Architecture Guidelines

## API Key Security & Isolation Standard

**MindSpark Gemma** enforces strict server-side isolation for all Google AI Studio and model execution credentials.

### 🔒 Key Isolation Rules
1. **Zero Client-Side Exposure**: `GOOGLE_API_KEY` is strictly read via Node.js `process.env.GOOGLE_API_KEY` inside Next.js Serverless API routes (`app/api/gemma/route.ts`).
2. **Bundle Verification**: No secret keys, tokens, or environment variables starting with `GOOGLE_API_KEY` are bundled into frontend JavaScript outputs.
3. **Environment Management**: Secrets are managed exclusively via Vercel Environment Variables or local `.env.local` files (which are strictly ignored by `.gitignore`).

---

## Reporting Vulnerabilities

If you discover a potential security vulnerability or key exposure risk:

1. **Do NOT** open a public issue on GitHub.
2. Email the maintainers directly at security@mindspark-gemma.org or notify the project admin.
3. We will review and remediate all reported issues within 24 hours.
