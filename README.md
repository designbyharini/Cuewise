# Cuewise

Cuewise is a portfolio prototype for a sales conversation and deal intelligence SaaS product. It includes Sales Rep and Sales Manager demo roles, meeting intelligence, deals, accounts, tasks, team views, and light/dark/system themes.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (normally `http://localhost:3000`).

## Build

```bash
npm run build
npm run preview
```

The production build is generated in `dist/`.

## GitHub Pages

A GitHub Actions workflow is included at `.github/workflows/deploy-pages.yml`.

After pushing the project to a GitHub repository:

1. Open **Settings → Pages** in the repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to the `main` branch (or run the workflow manually from the Actions tab).
4. GitHub will build and publish the site automatically.

No Gemini API key or backend service is required for this portfolio prototype.
