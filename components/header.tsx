import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="font-bold text-xl">Sistema de Ponencias</div>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </header>
  )
}

