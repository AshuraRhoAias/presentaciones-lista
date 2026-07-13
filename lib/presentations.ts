"use client"

import { toast } from "@/components/ui/use-toast"

interface Presentation {
  id: string
  title: string
  speaker: string
  description: string
  date: string
}

// In a real application, this would be stored in a database
// For this example, we'll use localStorage when available
const STORAGE_KEY = "presentations"

// Sample data
const SAMPLE_PRESENTATIONS: Presentation[] = [
  {
    id: "1",
    title: "Introducción a React",
    speaker: "Juan Pérez",
    description: "Una introducción completa a React y sus principales características.",
    date: "2025-04-15",
  },
  {
    id: "2",
    title: "Next.js y el futuro del desarrollo web",
    speaker: "María González",
    description: "Explorando las capacidades de Next.js para crear aplicaciones web modernas.",
    date: "2025-04-20",
  },
  {
    id: "3",
    title: "Diseño de interfaces con Tailwind CSS",
    speaker: "Carlos Rodríguez",
    description: "Cómo utilizar Tailwind CSS para crear interfaces de usuario atractivas y responsivas.",
    date: "2025-04-25",
  },
]

export function getPresentations(): Presentation[] {
  if (typeof window === "undefined") {
    return SAMPLE_PRESENTATIONS
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    // Initialize with sample data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PRESENTATIONS))
    return SAMPLE_PRESENTATIONS
  }

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error parsing presentations from localStorage:", error)
    return SAMPLE_PRESENTATIONS
  }
}

export function savePresentations(presentations: Presentation[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presentations))
    toast({
      title: "Guardado exitoso",
      description: "Los cambios han sido guardados correctamente.",
    })
  } catch (error) {
    console.error("Error saving presentations to localStorage:", error)
    toast({
      title: "Error al guardar",
      description: "No se pudieron guardar los cambios.",
      variant: "destructive",
    })
  }
}

export function sendPresentationsToEmail(email: string, presentations: Presentation[]): void {
  // In a real application, this would send an API request to a backend service
  // For this example, we'll just show a toast notification
  console.log(`Sending presentations to ${email}:`, presentations)

  toast({
    title: "Correo enviado",
    description: `Se ha enviado la información de las ponencias a ${email}.`,
  })
}

