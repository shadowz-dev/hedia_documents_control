// This file now re-exports the default from the actual dashboard page,
// which is located inside the (dashboard) route group.
// This resolves a route conflict where two pages were trying to serve the root URL ("/").
export { default } from './(dashboard)/page';
