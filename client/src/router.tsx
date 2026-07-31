import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { login, logout, me, signup } from "./services/admin";

export const router = createRouter({
    routeTree: routeTree,
    context: {
        user: undefined,
        auth: {
            login,
            logout,
            me,
            signup,
        },
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
