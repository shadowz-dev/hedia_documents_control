'use client';

import { AppLayout } from "@/components/app-layout";
import DashboardPage from "./(dashboard)/page";

export default function Home() {
  // This page now directly renders the dashboard within the main layout
  // to resolve a routing conflict and an infinite redirect loop.
  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
}
