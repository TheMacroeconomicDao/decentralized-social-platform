import { createFileRoute } from "@tanstack/react-router";
import { TeamsPage } from "@/pages/team";

export const Route = createFileRoute("/teams/")({
    component: TeamsPage,
})
