# AI Usage

This document describes how AI tooling was used during the development of this project, in accordance with the submission requirements.

---

## Tools and Models Used

| Tool                                                      | Role                                                          |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| **Google Gemini** (Gemini 2.5 Pro / Flash, with thinking) | Primary planning, architecture decisions, and code generation |

3 chats for diffrent tasks

- **`backend-builder`** — wrote the entire Express/TypeScript backend
- **`frontend-builder`** — wrote the entire React/TypeScript/Vite frontend
- **`docs-builder`** (this agent) — wrote all project-level documentation and Docker configuration

---

## Agent Instruction Files

Each Chat was given a detailed brief.:

- **Backend brief** (`@backend-builder`) — specified directory structure, all API routes and their behaviours, the Fake Store caching strategy, Nodemailer/Ethereal email logic, express-validator rules, Jest + Supertest test cases, and TypeScript/tsconfig requirements.
- **Frontend brief** (`@frontend-builder`) — specified the full component tree, CSS Modules approach, React Router v6 page structure, Axios API client setup, Vitest + React Testing Library test cases, and all environment variable usage.

---

## Plan / Spec Used

The plan was derived directly from the acceptance criteria provided. Where the criteria were ambiguous or silent, explicit assumptions were made and documented in [DECISIONS.md](./DECISIONS.md). No acceptance criterion was ignored; every gap was filled with a documented assumption rather than a silent guess.

---

## Key Prompts / Moments That Shaped the Solution

1. **"Do not call the Fake Store API directly from the client"** → This constraint drove the entire backend-as-proxy architecture. Without it, a simpler client-only app would have sufficed. With it, the Express backend became essential — and once it existed, caching and email handling sat naturally inside it.

2. **Ethereal chosen for zero-config email** → Early planning considered requiring real SMTP credentials. The constraint that the reviewer must not depend on paid services (constraint 6) made that untenable. Ethereal's programmatic account creation means the reviewer sees a preview URL in the console with no sign-up at all.

3. **CSS Modules chosen over Tailwind** → Tailwind was initially considered for speed. It was rejected because it adds PostCSS config overhead, requires reviewers to know utility-class naming conventions, and makes the CSS harder to read without framework knowledge. CSS Modules are supported out-of-the-box by Vite and produce plain, readable CSS files.

4. **Route ordering in Express router** → During backend design it was noted that Express matches routes top-to-bottom. Registering `GET /products/:id` before `/products/featured` would cause Express to treat the string `"featured"` as a product ID and return a 404 or error from Fake Store. The brief explicitly required `/featured`, `/search`, and `/categories` to be registered before `/:id`.

5. **EnquiryModal vs separate page** → A dedicated `/enquiry/:productId` route was considered. It was rejected in favour of a modal because: (a) the product context (image, price, title) stays visible while the form is open; (b) no state needs to be passed between pages via URL or global store; (c) it matches standard e-commerce UX patterns reviewers will recognise.

---

## Where AI Got Something Wrong

- **Initial email plan required SMTP config.** The first draft of the backend brief included `SMTP_HOST` as required (not optional), which would have forced every reviewer to register with an email provider. This was caught during plan review and corrected: Ethereal is the default, `SMTP_*` variables are optional overrides for production.

- **Initial route design ignored Express ordering.** The first route sketch placed `/:id` first. This was explicitly corrected in the brief with a note: "Register `/featured`, `/search`, `/categories` BEFORE `/:id` in the router." This is a classic Express gotcha that is easy to miss when drafting routes in isolation.

- **Vite TypeScript type checking & unused imports.** The initial frontend generation omitted `vite/client` in `tsconfig.json`'s `types` array and had unused `import React from 'react'` in tests under strict TypeScript configuration. During the verification phase, `npm run build` caught this; we resolved it by generating `vite-env.d.ts`, adding `"vite/client"` to the `types` array, and removing the unused React imports.

---

## Time Spent (Approximate)

| Phase                                              | Time           |
| -------------------------------------------------- | -------------- |
| Planning and acceptance criteria analysis          | ~15 min        |
| AI-assisted build (backend + frontend in parallel) | ~90 min        |
| Testing, reviewing, and fixing                     | ~30 min        |
| Documentation                                      | ~15 min        |
| **Total**                                          | **~2.5 hours** |
