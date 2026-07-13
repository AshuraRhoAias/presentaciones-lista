"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "@/lib/auth"

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="font-bold text-xl">Panel Administrativo</div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </header>
  )
}

