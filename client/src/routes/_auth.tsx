import { createFileRoute, Outlet } from "@tanstack/react-router";
import AuthLayout from "../layouts/authLayout";

export const Route = createFileRoute("/_auth")({
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
});
