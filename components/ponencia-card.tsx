"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Ponencia } from "@/lib/api"
import EliminarPonenciaDialog from "./eliminar-ponencia-dialog"

interface PonenciaCardProps {
  ponencia: Ponencia
  isSelected: boolean
  onClick: () => void
  onPonenciaEliminada: () => Promise<void>
}

export default function PonenciaCard({ ponencia, isSelected, onClick, onPonenciaEliminada }: PonenciaCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{ponencia.ponencia}</CardTitle>
          <div onClick={(e) => e.stopPropagation()}>
            <EliminarPonenciaDialog ponencia={ponencia} onPonenciaEliminada={onPonenciaEliminada} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-1">
          <p className="text-sm">
            <span className="font-medium">Ponente:</span> {ponencia.presentador}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="bg-muted/50">
              {ponencia.fecha}
            </Badge>
            <Badge variant="outline" className="bg-muted/50">
              {ponencia.hora}
            </Badge>
            {ponencia.sala && (
              <Badge className="bg-primary/10 text-primary border-primary/30">Sala: {ponencia.sala}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

