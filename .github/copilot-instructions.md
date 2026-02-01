# Copilot Instructions for AI Agents

## Project Overview
- **Framework:** Next.js 15 (App Router, TypeScript, React 19)
- **Styling:** Tailwind CSS (custom theme, utility-first)
- **Structure:**
  - `src/app/` — Main app router, each subfolder = route (e.g., `dashboard`, `analytics-reports`)
  - `src/components/` — Shared UI components
  - `src/app/[feature]/components/` — Feature-specific components
  - `public/assets/images/` — Static images
  - `styles/` — Tailwind and global CSS

## Key Patterns & Conventions
- **Component Organization:**
  - Use feature folders under `src/app/` for route isolation and co-located logic/UI
  - Shared UI in `src/components/`
  - Prefer functional React components with TypeScript
- **Styling:**
  - Use Tailwind utility classes; avoid custom CSS unless necessary
  - Global styles in `styles/`
- **Naming:**
  - PascalCase for components, camelCase for variables/functions
  - Folder names: kebab-case
- **Data Flow:**
  - State is managed locally in components; lift state up only as needed
  - Cross-component communication via props or context (no Redux/MobX)

## Developer Workflows
- **Install:** `npm install` or `yarn install`
- **Dev Server:** `npm run dev` (http://localhost:4028)
- **Build:** `npm run build`
- **Lint:** `npm run lint` / `npm run lint:fix`
- **Format:** `npm run format`
- **Production:** `npm run serve`

## Integration & External Dependencies
- No backend code in this repo; all logic is client-side or via Next.js API routes (if present)
- Images and static assets in `public/assets/images/`
- No custom server or API integration patterns found

## Examples
- To add a new dashboard widget: create a component in `src/app/dashboard/components/`, import and use in `src/app/dashboard/page.tsx`
- To add a new route: create a folder in `src/app/`, add `page.tsx` and optional `components/`

## Special Notes
- No project-specific test setup or custom scripts beyond standard Next.js/Tailwind/ESLint/Prettier
- Follow Next.js and Tailwind best practices unless a local pattern is documented above

---
_If you are unsure about a pattern, check similar files in the relevant `src/app/[feature]/components/` folder or ask for clarification._
