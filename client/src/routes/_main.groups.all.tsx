import { createFileRoute } from "@tanstack/react-router";
import AllGroups from "../pages/group/AllGroups";

export const Route = createFileRoute("/_main/groups/all")({
    component: AllGroups,
});
