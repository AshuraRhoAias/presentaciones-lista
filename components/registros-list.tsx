"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getRegistros, type Registro } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Search } from "lucide-react"

export default function RegistrosList() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [filteredRegistros, setFilteredRegistros] = useState<Registro[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchRegistros = async () => {
      setIsLoading(true)
      try {
        const data = await getRegistros()
        setRegistros(data)
        setFilteredRegistros(data)
      } catch (error) {
        console.error("Error fetching registros:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los registros. Por favor, intente más tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegistros()
  }, [])

  // Filtrar registros cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRegistros(registros)
      return
    }

    const lowerSearchTerm = searchTerm.toLowerCase()
    const filtered = registros.filter(
      (registro) =>
        registro.nombre.toLowerCase().includes(lowerSearchTerm) ||
        registro.correo.toLowerCase().includes(lowerSearchTerm) ||
        registro.ponencia.toLowerCase().includes(lowerSearchTerm),
    )
    setFilteredRegistros(filtered)
  }, [searchTerm, registros])

  if (isLoading) {
    return <div className="text-center p-4">Cargando registros...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registros de Participantes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Label htmlFor="search" className="sr-only">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nombre, correo o ponencia..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredRegistros.length === 0 ? (
          <p className="text-center py-4">No se encontraron registros.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Ponencia</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Sala</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistros.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>{registro.id}</TableCell>
                    <TableCell className="font-medium">{registro.nombre}</TableCell>
                    <TableCell>{registro.correo}</TableCell>
                    <TableCell>{registro.ponencia}</TableCell>
                    <TableCell>{registro.fecha}</TableCell>
                    <TableCell>{registro.hora}</TableCell>
                    <TableCell>{registro.sala || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

