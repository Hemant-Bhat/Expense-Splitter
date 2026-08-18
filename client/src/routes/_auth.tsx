import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import AuthLayout from "../layouts/authLayout";
import { Empty } from "antd";

export const Route = createFileRoute("/_auth")({
    component: AuthLayout,
    beforeLoad: async ({ context }) => {
        try {
            await context.auth.me();
            throw redirect({ to: "/dashboard" });
        } catch (err) {
            if (isRedirect(err)) throw err;
        }
    },
    pendingComponent: () => (
        <Empty
            image={false}
            description={"Initializing...."}
            className="initilizing"
            style={{ fontSize: 20 }}
        />
    ),
});
