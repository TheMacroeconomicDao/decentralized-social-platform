import { createFileRoute } from "@tanstack/react-router";
import { InvitesPage } from "@/pages/invites";

export const Route = createFileRoute("/invites/")({
    component: InvitesPage,
})
