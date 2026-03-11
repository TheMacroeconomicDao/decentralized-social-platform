import { createFileRoute } from '@tanstack/react-router'
import { DetailsUserPage } from '@/pages/users/userDetails'

export const Route = createFileRoute('/users/userDetails/')({
  component: DetailsUserPage,
})

