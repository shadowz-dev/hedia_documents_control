// This file now re-exports the default from the actual dashboard page,
// which is located inside the (dashboard) route group.
// This resolves the routing conflicts and ensures all pages use the correct layout.
export { default } from './(dashboard)/page';
