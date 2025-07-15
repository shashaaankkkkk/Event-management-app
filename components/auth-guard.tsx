"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService, type UserProfile } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()

    if (!currentUser && pathname !== "/login") {
      router.push("/login")
      return
    }

    if (currentUser && pathname === "/login") {
      router.push("/")
      return
    }

    if (requiredRole && currentUser && !requiredRole.includes(currentUser.role)) {
      router.push("/unauthorized")
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [pathname, router, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gdg-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user && pathname !== "/login") {
    return null
  }

  return <>{children}</>
}
