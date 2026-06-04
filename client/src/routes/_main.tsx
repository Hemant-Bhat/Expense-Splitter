import { createFileRoute, Outlet } from "@tanstack/react-router";
import MainLayout from "../layouts/mainLayout";

export const Route = createFileRoute("/_main")({
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
});
