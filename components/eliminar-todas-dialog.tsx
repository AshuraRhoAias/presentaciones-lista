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
import { Trash } from "lucide-react"
import { eliminarTodasPonencias } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface EliminarTodasDialogProps {
  onPonenciasEliminadas: () => Promise<void>
}

export default function EliminarTodasDialog({ onPonenciasEliminadas }: EliminarTodasDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAll = async () => {
    setIsDeleting(true)
    try {
      const result = await eliminarTodasPonencias()

      if (result.success) {
        toast({
          title: "Ponencias eliminadas",
          description: "Todas las ponencias han sido eliminadas correctamente.",
        })

        // Actualizar la lista de ponencias
        await onPonenciasEliminadas()
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudieron eliminar las ponencias.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting all ponencias:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar las ponencias.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" />
          Eliminar Todas
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente TODAS las ponencias. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAll} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar Todas"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

