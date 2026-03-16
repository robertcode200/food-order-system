# Food Order System

A food ordering web app where users can browse a categorized menu, manage a shopping cart, submit orders, and review their order history. Built as a take-home assignment for isCoolLab.

## Tech Stack

- **React 18** + **TypeScript**
- **Redux Toolkit** — cart state management with memoized selectors
- **RTK Query** — server data fetching, caching, and automatic refetch on mutation
- **MUI v7** — UI components
- **React Router v6** — client-side routing
- **Vite** — build tooling and dev server
- **Custom Node.js mock API** — REST endpoints backed by a JSON file
- **Vitest** + **React Testing Library** + **MSW** — unit and integration tests

## Getting Started

### Prerequisites

- Node.js >= 18

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts both the Vite dev server (port 5173) and the mock API server (port 3001) via `concurrently`. The database resets to its seed state on every server start — no leftover data from previous sessions.

### Tests

```bash
npm test
```

59 tests across 7 test files covering cart logic, selectors, and page-level integration.

### Build

```bash
npm run build
```

## Project Structure

Feature-based layout — each feature owns its components, state, API definitions, and tests.

```
src/
├── app/                # Store config, RTK Query base API, typed hooks
├── components/         # Shared layout (Navigation)
├── features/
│   ├── cart/           # Slice, selectors, CartDropdown, CartLineItem, CartIcon
│   ├── checkout/       # CheckoutPage (cart review + order submission)
│   ├── menu/           # MenuPage, FoodItemCard, getMenu endpoint
│   └── order/          # HistoryPage, OrderCard, order API endpoints
├── mocks/              # MSW handlers and test server
├── types/              # Shared TypeScript types
└── utils/              # formatPrice, formatDate, constants
```

## Design Decisions

### Server state vs. client state

Menu data (categories, foods) and orders live on the server — they're shared resources managed by the backend. The cart lives in a Redux slice as ephemeral session state: it only exists while the tab is open, and that's fine for a single-user ordering flow.

RTK Query handles all server communication. It gives each page automatic loading/error states, caching, and tag-based cache invalidation so the history page refetches after an order is submitted without any manual wiring.

### Integer prices (no floats, no ×100)

All menu data uses TWD (New Taiwan Dollar), which has no sub-units — there are no "cents" in TWD. Prices are stored as plain integers (`290` means NT$290) and displayed via `Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' })`. No float arithmetic, no precision bugs, no ×100 scaling.

### Snapshot pattern for cart and order items

When a food item is added to the cart, its name, price, and image URL are copied into the `CartItem`. When an order is submitted, those values are copied again into the `OrderItem`. This means historical orders stay accurate even if the menu changes later — standard e-commerce practice.

### Server-generated total and timestamp

The mock API server calculates each order's `total` and `submittedAt`, not the client. The frontend only sends `{ items: OrderItem[] }`. This mirrors how real APIs work — the server is the authoritative source for financial calculations and timestamps.

### Custom mock API server

The project uses a hand-written Node.js HTTP server (`server.mjs`) instead of json-server's built-in routing. json-server v1.x dropped the programmatic API that older tutorials rely on, so the server reads/writes `db.json` directly via `fs`. This gives full control over custom endpoints like `POST /orders` (server-generated fields) and `DELETE /orders` (bulk delete).

### Seed-based database reset

Seed data lives in `db.seed.json` (version-controlled). On every server start, `server.mjs` copies it to `db.json` (gitignored). Runtime mutations from using the app never show up in `git status`, and every `npm run dev` starts from a clean slate.

### Testing strategy

Tests are split into two layers:

- **Unit tests** — Redux slice reducers and memoized selectors are tested in isolation with plain function calls. No DOM, no store, no React rendering. This covers cart add/remove/increment/clear logic, quantity boundaries, and derived values like total and item count.
- **Integration tests** — Page components are rendered with a real Redux store (`renderWithStore`) and a router. RTK Query hooks fire real `fetch` calls that MSW intercepts at the network level — no module mocking and no `fetch` spying. This tests the full flow from user interaction to store update to DOM output.

Each test file groups cases into **happy path → boundary → edge cases**. Test descriptions read as user-facing behaviors (`'removes the line item when quantity reaches zero'`), not implementation details (`'removeItem reducer works'`). Every test maps to an assignment requirement or a named edge case that protects one.

State is injected via `preloadedState` rather than building up through UI interactions, keeping tests fast and deterministic. Error states are tested by overriding MSW handlers with `server.use()` on a per-test basis.

The commit history follows a test-first workflow — test commits precede their corresponding implementation commits.

#### Manual verification

All critical user flows were verified in a browser environment via Chrome DevTools MCP:

| Flow                                                        | Verified |
| ----------------------------------------------------------- | -------- |
| Menu loads with categories and food cards                   | ✓        |
| Category chip filters foods correctly                       | ✓        |
| Adding items updates cart badge and dropdown                | ✓        |
| Same item added twice increases quantity (no duplicate row) | ✓        |
| Checkout shows cart items with quantity controls and total  | ✓        |
| Submit order → cart clears → navigates to history           | ✓        |
| Order card shows timestamp, items summary, and total        | ✓        |
| Clear history empties the list                              | ✓        |
| Unknown routes show 404 page with navigation preserved      | ✓        |

## Bonus Features

- **Backend-persisted order history** — orders are stored on the server via `POST /orders` and retrieved with `GET /orders`, surviving page refreshes
- **Dedicated history page** — order history lives on its own route (`/history`) with per-order cards showing timestamp, items, and total
- **Category-based menu filtering** — chip toggles filter the food grid by category
- **Image fallback system** — broken or missing food images gracefully fall back to a local SVG placeholder with zero network dependency
- **Native image lazy loading** — food card images use `loading="lazy"` so off-screen images are deferred until the user scrolls near them, reducing initial page load
- **Route-level code splitting** — page components are lazy-loaded via `React.lazy` + per-route `Suspense` boundaries, so each route is a separate chunk fetched on demand (MenuPage 19.8 kB, HistoryPage 1.95 kB, CheckoutPage 1.39 kB gzipped)
- **Pre-commit quality gate** — every commit passes Prettier, ESLint, TypeScript type checking, and the full test suite via Husky + lint-staged

## Future Improvements

- Replace the mock JSON server with a real backend (e.g. Express + PostgreSQL)
- Deploy to Vercel with environment-based API URL switching (`VITE_API_URL` replaces the hardcoded localhost base URL)
- Persistent cart via localStorage or server sync
- Multi-category tags (many-to-many food–category relationship)
- Pagination or infinite scroll for large menus
- Error boundary via `react-error-boundary` — all API errors are already handled by RTK Query's `isError`, but a top-level boundary would catch unexpected render crashes
- i18n / locale switching
