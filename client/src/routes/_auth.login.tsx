import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import Login from "../pages/login";
import { me } from "../services/admin";

export const Route = createFileRoute("/_auth/login")({
    component: Login,
    beforeLoad: async () => {
        try {
            await me();
            throw redirect({ to: "/dashboard" });
        } catch (err) {
            if (isRedirect(err)) throw err;
        }
    },
    pendingComponent: () => <h1>Loading...</h1>,
});
