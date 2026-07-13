"use client"

// API endpoints
const PONENCIAS_API = "https://dreamgateways.net/Re01/apis.php?action=ponencias"
const REGISTRO_API = "https://dreamgateways.net/Re01/apis.php?action=registrar"
const MODIFICAR_PONENCIA_API = "https://dreamgateways.net/Re01/apis.php?action=modificar_ponencia"
const VER_REGISTROS_API = "https://dreamgateways.net/Re01/apis.php/api.php?action=ver_registros"
const AGREGAR_PONENCIA_API = "https://dreamgateways.net/Re01/apis.php/api.php?action=agregar_ponencia"
const ELIMINAR_PONENCIA_API = "https://dreamgateways.net/Re01/apis.php/api.php?action=eliminar_ponencia"
const ELIMINAR_TODAS_API = "https://dreamgateways.net/Re01/apis.php/api.php?action=eliminar_todas"

export interface Ponencia {
  ponencia: string
  fecha: string
  hora: string
  presentador: string
  sala?: string
  link?: string
  id?: string
}

export async function getPonencias(): Promise<Ponencia[]> {
  try {
    const response = await fetch(PONENCIAS_API)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status === 1 && Array.isArray(data.data)) {
      return data.data
    }

    return []
  } catch (error) {
    console.error("Error fetching ponencias:", error)
    return []
  }
}

export interface RegistroData {
  nombre: string
  correo: string
  ponencia: string
  fecha: string
  hora: string
  sala?: string
  fecha_registro: string
}

export async function registrarAsistente(data: RegistroData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(REGISTRO_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const responseData = await response.json()

    if (responseData.status === 1) {
      return { success: true, message: responseData.message || "Registro exitoso" }
    } else {
      return { success: false, message: responseData.message || "Error en el registro" }
    }
  } catch (error) {
    console.error("Error registering:", error)
    return { success: false, message: "Error de conexión" }
  }
}

export async function actualizarPonencia(ponencia: Ponencia): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(MODIFICAR_PONENCIA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ponencia),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const responseData = await response.json()

    if (responseData.status === 1) {
      return { success: true, message: responseData.message || "Ponencia actualizada correctamente" }
    } else {
      return { success: false, message: responseData.message || "Error al actualizar la ponencia" }
    }
  } catch (error) {
    console.error("Error updating ponencia:", error)
    return { success: false, message: "Error de conexión" }
  }
}

// Interfaz actualizada para los registros de participantes según el formato real
export interface Registro {
  id: string
  nombre: string
  correo: string
  ponencia: string
  fecha: string
  hora: string
  sala: string | null
}

// Función para obtener los registros de participantes
export async function getRegistros(): Promise<Registro[]> {
  try {
    const response = await fetch(VER_REGISTROS_API)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status === 1 && Array.isArray(data.data)) {
      return data.data
    }

    return []
  } catch (error) {
    console.error("Error fetching registros:", error)
    return []
  }
}

// Función para agregar una nueva ponencia
export async function agregarPonencia(ponencia: Ponencia): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(AGREGAR_PONENCIA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ponencia),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const responseData = await response.json()

    if (responseData.status === 1) {
      return { success: true, message: responseData.message || "Ponencia agregada correctamente" }
    } else {
      return { success: false, message: responseData.message || "Error al agregar la ponencia" }
    }
  } catch (error) {
    console.error("Error adding ponencia:", error)
    return { success: false, message: "Error de conexión" }
  }
}

// Función para eliminar una ponencia específica
export async function eliminarPonencia(titulo: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(ELIMINAR_PONENCIA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ponencia: titulo }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const responseData = await response.json()

    if (responseData.status === 1) {
      return { success: true, message: responseData.message || "Ponencia eliminada correctamente" }
    } else {
      return { success: false, message: responseData.message || "Error al eliminar la ponencia" }
    }
  } catch (error) {
    console.error("Error deleting ponencia:", error)
    return { success: false, message: "Error de conexión" }
  }
}

// Función para eliminar todas las ponencias
export async function eliminarTodasPonencias(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(ELIMINAR_TODAS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const responseData = await response.json()

    if (responseData.status === 1) {
      return { success: true, message: responseData.message || "Todas las ponencias han sido eliminadas" }
    } else {
      return { success: false, message: responseData.message || "Error al eliminar las ponencias" }
    }
  } catch (error) {
    console.error("Error deleting all ponencias:", error)
    return { success: false, message: "Error de conexión" }
  }
}

