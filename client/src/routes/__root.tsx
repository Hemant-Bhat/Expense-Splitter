import * as React from "react";
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { login, logout, me, signup } from "../services/admin";

type RouterContext = {
    user:
        | {
              email: string;
              userId: string;
              currency: {
                  sign: string;
                  code: string;
                  country: string;
                  symbol: string;
              };
          }
        | undefined;
    auth: {
        login: typeof login;
        logout: typeof logout;
        me: typeof me;
        signup: typeof signup;
    };
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
    notFoundComponent: () => (
        <div style={{ color: "#FFF", textAlign: "center", display: "grid", alignItems: "center", justifyContent: "center", height: "100dvh" }}>
            <div>
                <h1>
                    ❌ <br /> Not Found
                </h1>
                <p>The page you were looking for doesn't exist</p>
                <Link to="/">Go to Homepage</Link>
            </div>
        </div>
    ),
    // context: {
    //     user: undefined,
    // },
});

function RootComponent() {
    return (
        <React.Fragment>
            <Outlet />
        </React.Fragment>
    );
}
