"use client"

import { useRouter } from "next/navigation"
import { useAppContext } from "../contexts/AppContext"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminDashboard() {
  const { user } = useAppContext()
  const router = useRouter()

  if (!user || user.role !== "ADMIN") {
    router.push("/login")
    return null
  }

  const sections = [
    { title: "Users", href: "/admin/users" },
    { title: "Movies", href: "/admin/movies" },
    { title: "Cinema Rooms", href: "/admin/cinema-rooms" },
    { title: "Reservations", href: "/admin/reservations" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
