import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/a")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_main/a"!</div>;
}
