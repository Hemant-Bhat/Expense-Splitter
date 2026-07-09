import { createFileRoute } from "@tanstack/react-router";
import Group from "../pages/group";

export const Route = createFileRoute("/_main/group/$groupId")({
    component: Group,
});
