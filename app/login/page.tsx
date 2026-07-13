import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"
import { getSession } from "@/lib/auth"
import Header from "@/components/header"

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/admin")
  }

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 pt-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h1>
          <LoginForm />
        </div>
      </main>
    </>
  )
}

