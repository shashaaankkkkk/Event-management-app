"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, MessageCircle, Users, Archive, Star, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { authService } from "@/lib/auth"

const getNavItems = (userRole: string | undefined) => {
  const baseItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/sessions", icon: Calendar, label: "Sessions" },
    { href: "/assistant", icon: MessageCircle, label: "Assistant" },
  ]

  if (userRole === "teacher") {
    return [
      ...baseItems,
      { href: "/teacher-attendance", icon: GraduationCap, label: "Attendance" },
      { href: "/resources", icon: Archive, label: "Resources" },
      { href: "/feedback", icon: Star, label: "Feedback" },
    ]
  }

  return [
    ...baseItems,
    { href: "/attendance", icon: Users, label: "Attendance" },
    { href: "/resources", icon: Archive, label: "Resources" },
    { href: "/feedback", icon: Star, label: "Feedback" },
  ]
}

export function Navigation() {
  const pathname = usePathname()
  const user = authService.getCurrentUser()
  const navItems = getNavItems(user?.role)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors",
                isActive ? "text-gdg-blue bg-blue-50" : "text-gray-600 hover:text-gdg-blue",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
