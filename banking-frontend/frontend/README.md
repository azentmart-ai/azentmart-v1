# Banking AI Agent Frontend

The frontend now opens with a product landing page for the Banking AI Agent. The existing Banking AI dashboard remains available through **Launch Banking Agent**, **Open Dashboard**, or the dashboard hash route.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Backend

The existing NestJS backend is preserved. Start it separately:

```bash
cd backend
npm install
npm run start:dev
```

The frontend reads `VITE_API_BASE_URL` from `frontend/.env`. The provided project keeps the existing default of `http://localhost:3000`.

## Navigation

- `/` or the normal Vite URL: Banking AI Agent landing page
- `#dashboard`: Existing Banking AI dashboard with the conversational assistant
- The landing page CTA opens the dashboard without changing the backend workflow.

## Branding

The provided Azentmart AI logo is used consistently in the landing-page header, footer, and dashboard sidebar. The source image is stored at `frontend/public/azentmart-ai-logo.png`.
