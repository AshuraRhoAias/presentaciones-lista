import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AdminHeader from "@/components/admin-header"
import PresentationsList from "@/components/presentations-list"

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <>
      <AdminHeader />
      <main className="container mx-auto p-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        <PresentationsList />
      </main>
    </>
  )
}

