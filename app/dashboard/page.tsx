import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import PresentationDashboard from "@/components/presentation-dashboard"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="container mx-auto p-4">
      <PresentationDashboard />
    </main>
  )
}

