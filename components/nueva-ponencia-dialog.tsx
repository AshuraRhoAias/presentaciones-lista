"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { agregarPonencia, type Ponencia } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface NuevaPonenciaDialogProps {
  onPonenciaAgregada: () => Promise<void>
}

export default function NuevaPonenciaDialog({ onPonenciaAgregada }: NuevaPonenciaDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nuevaPonencia, setNuevaPonencia] = useState<Ponencia>({
    ponencia: "",
    fecha: "",
    hora: "",
    presentador: "",
    sala: "",
    link: "",
  })

  const handleInputChange = (field: keyof Ponencia, value: string) => {
    setNuevaPonencia({
      ...nuevaPonencia,
      [field]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nuevaPonencia.ponencia || !nuevaPonencia.fecha || !nuevaPonencia.hora || !nuevaPonencia.presentador) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await agregarPonencia(nuevaPonencia)

      if (result.success) {
        toast({
          title: "Ponencia agregada",
          description: "La ponencia ha sido agregada correctamente.",
        })

        // Resetear el formulario
        setNuevaPonencia({
          ponencia: "",
          fecha: "",
          hora: "",
          presentador: "",
          sala: "",
          link: "",
        })

        // Cerrar el diálogo
        setOpen(false)

        // Actualizar la lista de ponencias
        await onPonenciaAgregada()
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo agregar la ponencia.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding ponencia:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al agregar la ponencia.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ponencia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Ponencia</DialogTitle>
            <DialogDescription>
              Complete los detalles de la nueva ponencia. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ponencia" className="text-right">
                Título *
              </Label>
              <Input
                id="ponencia"
                value={nuevaPonencia.ponencia}
                onChange={(e) => handleInputChange("ponencia", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="presentador" className="text-right">
                Presentador *
              </Label>
              <Input
                id="presentador"
                value={nuevaPonencia.presentador}
                onChange={(e) => handleInputChange("presentador", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha" className="text-right">
                Fecha *
              </Label>
              <Input
                id="fecha"
                type="date"
                value={nuevaPonencia.fecha}
                onChange={(e) => handleInputChange("fecha", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hora" className="text-right">
                Hora *
              </Label>
              <Input
                id="hora"
                type="time"
                value={nuevaPonencia.hora}
                onChange={(e) => handleInputChange("hora", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sala" className="text-right">
                Sala
              </Label>
              <Input
                id="sala"
                value={nuevaPonencia.sala || ""}
                onChange={(e) => handleInputChange("sala", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Enlace
              </Label>
              <Input
                id="link"
                type="url"
                value={nuevaPonencia.link || ""}
                onChange={(e) => handleInputChange("link", e.target.value)}
                className="col-span-3"
                placeholder="https://ejemplo.com/ponencia"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Agregando..." : "Agregar Ponencia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

