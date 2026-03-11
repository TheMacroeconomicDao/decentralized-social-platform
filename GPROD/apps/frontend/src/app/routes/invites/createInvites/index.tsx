import { createFileRoute } from '@tanstack/react-router'
import { CreateInvitesPage } from '@/pages/invites/createInvites'

export const Route = createFileRoute('/invites/createInvites/')({
  component: CreateInvitesPage,
})
