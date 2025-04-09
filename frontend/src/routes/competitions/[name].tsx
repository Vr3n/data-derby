import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/competitions/[name]')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/competitions/[slug]"!</div>
}
