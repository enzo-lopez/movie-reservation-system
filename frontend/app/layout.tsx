import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AppProvider } from "./contexts/AppContext"
import Navbar from "./components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cinema Ticket Booking",
  description: "Book your favorite movie tickets",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
