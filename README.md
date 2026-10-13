# DevLingo

DevLingo is a static React application for practicing technical English in software-development contexts. The MVP contains six bilingual lessons, interactive exercises, local progress, and a structured learning path.

## Development

Use Node.js `24.21.0` from [.nvmrc](./.nvmrc), then install dependencies:

```bash
npm ci
```

Useful commands:

```bash
npm run dev
npm test
npm run content:validate
npm run test:e2e
npm run quality:gate
```

The E2E suite runs in Chromium, Firefox, and WebKit. `npm run quality:gate` builds the application and runs the E2E suite against the production preview server.

## Deployment

The application is deployed as static assets to GitHub Pages by [.github/workflows/deploy.yml](./.github/workflows/deploy.yml). The workflow installs dependencies from the lockfile, installs the Playwright browser matrix, runs the complete quality gate, and publishes `dist` only after all checks pass.
