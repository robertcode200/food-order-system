import { type RequestHandler } from 'msw'

// Handlers are added per feature alongside their tests.
// Each feature test file registers its own handlers via server.use(...) for
// feature-specific routes, or exports handlers to be composed here as needed.
export const handlers: RequestHandler[] = []
