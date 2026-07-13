"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PresentationEditor from "@/components/presentation-editor"
import PonenciaCard from "@/components/ponencia-card"
import RegistrosList from "@/components/registros-list"
import NuevaPonenciaDialog from "@/components/nueva-ponencia-dialog"
import EliminarTodasDialog from "@/components/eliminar-todas-dialog"
import { getPonencias, type Ponencia } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function PresentationsList() {
  const [ponencias, setPonencias] = useState<Ponencia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Función para cargar las ponencias
  const loadPonencias = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getPonencias()
      setPonencias(data)

      // Si no hay ponencia seleccionada o la seleccionada ya no existe, seleccionar la primera
      if (data.length > 0) {
        if (!selectedId || (selectedId && Number.parseInt(selectedId) >= data.length)) {
          setSelectedId("0")
        }
      } else {
        setSelectedId(null)
      }
    } catch (error) {
      console.error("Error fetching ponencias:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las ponencias. Por favor, intente más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedId])

  // Cargar ponencias al montar el componente
  useEffect(() => {
    loadPonencias()
  }, [loadPonencias])

  // Función para actualizar la lista después de modificar una ponencia
  const handlePonenciaUpdated = async () => {
    await loadPonencias()
    toast({
      title: "Lista actualizada",
      description: "La lista de ponencias ha sido actualizada con los cambios.",
    })
  }

  if (isLoading && ponencias.length === 0) {
    return <div className="text-center p-4">Cargando ponencias...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Lista de Ponencias</TabsTrigger>
          <TabsTrigger value="registrations">Registros</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center">
            <NuevaPonenciaDialog onPonenciaAgregada={loadPonencias} />
            <EliminarTodasDialog onPonenciasEliminadas={loadPonencias} />
          </div>

          {ponencias.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center">
                <p>No hay ponencias disponibles.</p>
                <p className="text-muted-foreground mt-2">Utilice el botón "Nueva Ponencia" para agregar una.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ponencias.map((ponencia, index) => (
                  <PonenciaCard
                    key={index}
                    ponencia={ponencia}
                    isSelected={selectedId === index.toString()}
                    onClick={() => setSelectedId(index.toString())}
                    onPonenciaEliminada={loadPonencias}
                  />
                ))}
              </div>

              {selectedId !== null && (
                <PresentationEditor
                  ponencia={ponencias[Number.parseInt(selectedId)]}
                  onUpdate={handlePonenciaUpdated}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="registrations">
          <RegistrosList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

