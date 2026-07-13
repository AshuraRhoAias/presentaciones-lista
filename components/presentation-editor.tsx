"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { actualizarPonencia, type Ponencia } from "@/lib/api"

interface PresentationEditorProps {
  ponencia: Ponencia
  onUpdate?: () => Promise<void> // Callback para actualizar la lista después de modificar
}

export default function PresentationEditor({ ponencia: initialPonencia, onUpdate }: PresentationEditorProps) {
  const [ponencia, setPonencia] = useState<Ponencia>({ ...initialPonencia })
  const [isUpdating, setIsUpdating] = useState(false)

  // Este useEffect actualiza el estado local cuando cambia la ponencia seleccionada
  useEffect(() => {
    setPonencia({ ...initialPonencia })
  }, [initialPonencia])

  const handleInputChange = (field: keyof Ponencia, value: string) => {
    setPonencia({
      ...ponencia,
      [field]: value,
    })
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const result = await actualizarPonencia(ponencia)

      if (result.success) {
        toast({
          title: "Actualización exitosa",
          description: "Los datos de la ponencia han sido actualizados correctamente.",
        })

        // Si existe la función onUpdate, la llamamos para actualizar la lista
        if (onUpdate) {
          await onUpdate()
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo actualizar la ponencia.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating ponencia:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar la ponencia.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Detalles de la Ponencia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ponencia-titulo">Título</Label>
          <Input
            id="ponencia-titulo"
            value={ponencia.ponencia}
            onChange={(e) => handleInputChange("ponencia", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ponencia-presentador">Presentador</Label>
          <Input
            id="ponencia-presentador"
            value={ponencia.presentador}
            onChange={(e) => handleInputChange("presentador", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ponencia-fecha">Fecha</Label>
            <Input
              id="ponencia-fecha"
              type="date"
              value={ponencia.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ponencia-hora">Hora</Label>
            <Input
              id="ponencia-hora"
              type="time"
              value={ponencia.hora}
              onChange={(e) => handleInputChange("hora", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ponencia-sala">Sala</Label>
            <Input
              id="ponencia-sala"
              value={ponencia.sala || ""}
              onChange={(e) => handleInputChange("sala", e.target.value)}
              placeholder="Nombre de la sala"
            />
          </div>
        </div>

        {ponencia.link && (
          <div className="space-y-2">
            <Label htmlFor="ponencia-link">Enlace</Label>
            <Input
              id="ponencia-link"
              value={ponencia.link}
              onChange={(e) => handleInputChange("link", e.target.value)}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {isUpdating ? "Actualizando..." : "Actualizar Ponencia"}
        </Button>
      </CardFooter>
    </Card>
  )
}

