import { createFileRoute } from "@tanstack/react-router";
import Analyze from "../pages/analyze";

export const Route = createFileRoute("/_main/analyze")({
    component: Analyze,
});
