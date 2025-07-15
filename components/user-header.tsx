"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function UserHeader() {
  const [user] = useState(authService.getCurrentUser())
  const router = useRouter()

  const handleSignOut = async () => {
    await authService.signOut()
    router.push("/login")
  }

  if (!user) return null

  const getRoleColor = (role: string) => {
    switch (role) {
      case "organizer":
        return "bg-gdg-red text-white"
      case "teacher":
        return "bg-gdg-blue text-white"
      case "student":
        return "bg-gdg-green text-white"
      case "community":
        return "bg-gdg-yellow text-black"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 md:block hidden">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">GDG Event Companion</h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Hello, {user.name || "User"}</p>
            <Badge className={getRoleColor(user.role)} variant="secondary">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
