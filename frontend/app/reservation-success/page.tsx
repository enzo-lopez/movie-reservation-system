"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReservationSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const movieName = searchParams.get("movieName")
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const seats = searchParams.get("seats")

  useEffect(() => {
    if (!movieName || !date || !time || !seats) {
      router.push("/")
    }
  }, [movieName, date, time, seats, router])

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>¡Reserva realizada con éxito!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Tu reserva ha sido confirmada con los siguientes detalles:</p>
          <ul className="list-disc list-inside mb-6">
            <li>Película: {movieName}</li>
            <li>Fecha: {date}</li>
            <li>Hora: {time}</li>
            <li>
              Asientos:{" "}
              {seats
                ? JSON.parse(seats)
                    .map((seat: { row: string; numberSeat: number }) => `${seat.row}${seat.numberSeat}`)
                    .join(", ")
                : "N/A"}
            </li>
          </ul>
          <Button onClick={handleBackToHome}>Volver al inicio</Button>
        </CardContent>
      </Card>
    </div>
  )
}
