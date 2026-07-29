import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
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
});

function RootComponent() {
    return (
        <React.Fragment>
            <Outlet />
        </React.Fragment>
    );
}
