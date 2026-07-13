"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Sample presentations
const PRESENTATIONS = [
  { id: "1", title: "Introducción a React" },
  { id: "2", title: "Next.js y el futuro del desarrollo web" },
  { id: "3", title: "Diseño de interfaces con Tailwind CSS" },
]

export default function PresentationSelector() {
  const [selectedPresentationId, setSelectedPresentationId] = useState<string>("")
  const router = useRouter()

  const handleLogin = () => {
    // Store the selected presentation ID in localStorage or sessionStorage
    if (selectedPresentationId) {
      sessionStorage.setItem("selectedPresentation", selectedPresentationId)
      router.push("/login")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Ponencia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="presentation-select">Ponencia</Label>
          <Select value={selectedPresentationId} onValueChange={setSelectedPresentationId}>
            <SelectTrigger id="presentation-select">
              <SelectValue placeholder="Seleccione una ponencia" />
            </SelectTrigger>
            <SelectContent>
              {PRESENTATIONS.map((presentation) => (
                <SelectItem key={presentation.id} value={presentation.id}>
                  {presentation.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleLogin} className="w-full" disabled={!selectedPresentationId}>
          Iniciar Sesión
        </Button>
      </CardContent>
    </Card>
  )
}

