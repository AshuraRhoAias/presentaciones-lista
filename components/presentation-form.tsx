"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { getPonencias, registrarAsistente, type Ponencia } from "@/lib/api"

export default function PresentationForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedPonenciaId, setSelectedPonenciaId] = useState<string>("")
  const [ponencias, setPonencias] = useState<Ponencia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Fetch ponencias from API
  useEffect(() => {
    const fetchPonencias = async () => {
      setIsLoading(true)
      try {
        const data = await getPonencias()
        setPonencias(data)
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
    }

    fetchPonencias()
  }, [])

  // Actualizar el método handleSubmit para incluir la sala en los datos de registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPonenciaId) {
      toast({
        title: "Error",
        description: "Por favor, seleccione una ponencia.",
        variant: "destructive",
      })
      return
    }

    const selectedPonencia = ponencias.find((p, index) => index.toString() === selectedPonenciaId)

    if (!selectedPonencia) {
      toast({
        title: "Error",
        description: "Ponencia no encontrada.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Current date in YYYY-MM-DD format
    const fechaRegistro = new Date().toISOString().split("T")[0]

    const registroData = {
      nombre: name,
      correo: email,
      ponencia: selectedPonencia.ponencia,
      fecha: selectedPonencia.fecha,
      hora: selectedPonencia.hora,
      sala: selectedPonencia.sala, // Incluir la sala en los datos de registro
      fecha_registro: fechaRegistro,
    }

    try {
      const result = await registrarAsistente(registroData)

      if (result.success) {
        setIsSubmitted(true)
        toast({
          title: "Registro exitoso",
          description: result.message || "Tu información ha sido enviada correctamente.",
        })

        // Reset form
        setName("")
        setEmail("")
        setSelectedPonenciaId("")

        // Reset submitted state after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 3000)
      } else {
        toast({
          title: "Error",
          description: result.message || "Hubo un problema al enviar tu registro.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu registro. Por favor, intente más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulario de Registro</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="presentation-select">Seleccionar Ponencia</Label>
            <Select value={selectedPonenciaId} onValueChange={setSelectedPonenciaId} disabled={isLoading} required>
              <SelectTrigger id="presentation-select">
                <SelectValue placeholder={isLoading ? "Cargando ponencias..." : "Seleccione una ponencia"} />
              </SelectTrigger>
              <SelectContent>
                {ponencias.map((ponencia, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {ponencia.ponencia} - {ponencia.presentador}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPonenciaId && ponencias[Number.parseInt(selectedPonenciaId)] && (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Fecha: {ponencias[Number.parseInt(selectedPonenciaId)].fecha}</p>
                <p>Hora: {ponencias[Number.parseInt(selectedPonenciaId)].hora}</p>
                {ponencias[Number.parseInt(selectedPonenciaId)].sala && (
                  <p>Sala: {ponencias[Number.parseInt(selectedPonenciaId)].sala}</p>
                )}
                <p>Presentador: {ponencias[Number.parseInt(selectedPonenciaId)].presentador}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese su nombre completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || isSubmitting || isSubmitted}>
            {isLoading ? "Cargando..." : isSubmitting ? "Enviando..." : isSubmitted ? "¡Enviado!" : "Enviar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

