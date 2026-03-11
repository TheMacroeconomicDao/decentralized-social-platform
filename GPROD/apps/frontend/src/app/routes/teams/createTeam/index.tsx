import { createFileRoute } from '@tanstack/react-router'
import { CreateTeamPage } from '@/pages/team/createTeam'

export const Route = createFileRoute('/teams/createTeam/')({
  component: CreateTeamPage,
})
