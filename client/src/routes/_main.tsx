import { createFileRoute, redirect } from "@tanstack/react-router";
import MainLayout from "../layouts/mainLayout";

export const Route = createFileRoute("/_main")({
    component: MainLayout,
    beforeLoad: async ({ context }) => {
        try {
            const response = await context.auth.me();
            return { user: response.data.user };
        } catch (err) {
            throw redirect({ to: "/login" });
        }
    },
});
