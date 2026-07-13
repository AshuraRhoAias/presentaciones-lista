"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LogOut, Save, Trash2, Send } from "lucide-react"
import { logout } from "@/lib/auth"
import { getPresentations, savePresentations, sendPresentationsToEmail } from "@/lib/presentations"

interface Presentation {
  id: string
  title: string
  speaker: string
  description: string
  date: string
}

export default function PresentationDashboard() {
  const router = useRouter()
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Get the selected presentation ID from sessionStorage
    const selectedId = typeof window !== "undefined" ? sessionStorage.getItem("selectedPresentation") : null

    if (selectedId) {
      const presentations = getPresentations()
      const selected = presentations.find((p) => p.id === selectedId)
      if (selected) {
        setPresentation(selected)
      }
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  const handleSave = () => {
    if (!presentation) return

    const presentations = getPresentations()
    const updatedPresentations = presentations.map((p) => (p.id === presentation.id ? presentation : p))

    savePresentations(updatedPresentations)
  }

  const handleDelete = () => {
    if (!presentation) return

    const presentations = getPresentations()
    const updatedPresentations = presentations.filter((p) => p.id !== presentation.id)
    savePresentations(updatedPresentations)

    // Return to home page after deleting
    router.push("/")
  }

  const handleDeleteAll = () => {
    savePresentations([])
    // Return to home page after deleting all
    router.push("/")
  }

  const handleSendEmail = () => {
    if (email && presentation) {
      sendPresentationsToEmail(email, [presentation])
      setEmail("")
    }
  }

  const handleInputChange = (field: keyof Presentation, value: string) => {
    if (!presentation) return

    setPresentation({
      ...presentation,
      [field]: value,
    })
  }

  if (!presentation) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p>No se ha seleccionado ninguna ponencia.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Ponencia</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Ponencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={presentation.title} onChange={(e) => handleInputChange("title", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="speaker">Ponente</Label>
            <Input
              id="speaker"
              value={presentation.speaker}
              onChange={(e) => handleInputChange("speaker", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={presentation.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              rows={5}
              value={presentation.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Borrar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Borrar Todo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminarán permanentemente todas las ponencias.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enviar a Correo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Ingrese correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleSendEmail}>
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

