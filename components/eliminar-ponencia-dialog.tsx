"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Trash2 } from "lucide-react"
import { eliminarPonencia, type Ponencia } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface EliminarPonenciaDialogProps {
  ponencia: Ponencia
  onPonenciaEliminada: () => Promise<void>
}

export default function EliminarPonenciaDialog({ ponencia, onPonenciaEliminada }: EliminarPonenciaDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await eliminarPonencia(ponencia.ponencia)

      if (result.success) {
        toast({
          title: "Ponencia eliminada",
          description: "La ponencia ha sido eliminada correctamente.",
        })

        // Actualizar la lista de ponencias
        await onPonenciaEliminada()
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo eliminar la ponencia.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting ponencia:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la ponencia.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente la ponencia "{ponencia.ponencia}". Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

