import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    debugger;
    console.log("a");
    throw redirect({
      to: "/login",
    });
  },
});
