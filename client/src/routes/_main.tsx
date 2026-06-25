import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import MainLayout from "../layouts/mainLayout";
import { me } from "../services/admin";

export const Route = createFileRoute("/_main")({
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
  beforeLoad: async () => {
    try {
      await me();
    } catch (err) {
      throw redirect({ to: "/login" });
    }
  },
});
