import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"
import { AuthGuard } from "@/components/auth-guard"
import { UserHeader } from "@/components/user-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GDG Event Companion",
  description: "Smart Attendee Assistant for GDG Events",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthGuard>
          <div className="min-h-screen bg-gray-50">
            <UserHeader />
            {children}
            <Navigation />
          </div>
        </AuthGuard>
        <Toaster />
      </body>
    </html>
  )
}
