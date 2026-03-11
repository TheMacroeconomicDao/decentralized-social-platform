import { createFileRoute } from '@tanstack/react-router'
import { CreateProjectPage } from '@/pages/projects/createProject'

export const Route = createFileRoute('/projects/createProject/')({
  component: CreateProjectPage,
})
