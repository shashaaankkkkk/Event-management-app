"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Calendar as CalendarIcon, Users, Archive, Star, Shield } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import clsx from "clsx"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

const CalendarComponent = dynamic(() => import("react-calendar"), { ssr: false }) as any;

// Mock event data
const eventData = [
  { date: "2024-07-15", time: "09:00", title: "Opening Keynote", color: "bg-gdg-blue" },
  { date: "2024-07-15", time: "10:30", title: "ML Workshop", color: "bg-gdg-green" },
  { date: "2024-07-15", time: "12:00", title: "Flutter for Web", color: "bg-gdg-red" },
  { date: "2024-07-16", time: "09:30", title: "Cloud Functions", color: "bg-gdg-yellow" },
  { date: "2024-07-16", time: "11:00", title: "PWA Deep Dive", color: "bg-gdg-blue" },
  { date: "2024-07-17", time: "10:00", title: "Closing Panel", color: "bg-gdg-green" },
]

function getEventsForDate(date: Date) {
  const d = date.toISOString().slice(0, 10)
  return eventData.filter(e => e.date === d)
}

// Remove all admin modal/login/card logic

export default function HomePage() {
  const [greeting] = useState("Welcome to GDG DevFest 2024!")
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const eventsForSelected = getEventsForDate(calendarDate)
  const router = useRouter()

  // Helper for calendar tile content (dots for events)
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null
    const events = getEventsForDate(date)
    if (!events.length) return null
    return (
      <div className="flex justify-center mt-1 space-x-0.5">
        {events.slice(0, 3).map((e, i) => (
          <span key={i} className={clsx("w-1.5 h-1.5 rounded-full", e.color)}></span>
        ))}
      </div>
    )
  }

  // Helper for calendar tile class (highlight today, selected, event days)
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    let classes = "!rounded-xl text-xs"
    const today = new Date()
    if (date.toDateString() === today.toDateString()) classes += " border-2 border-gdg-blue !font-bold"
    if (date.toDateString() === calendarDate.toDateString()) classes += " bg-gdg-blue/10 !font-semibold"
    if (getEventsForDate(date).length) classes += " ring-2 ring-gdg-blue/20"
    return classes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-24">
      <div className="container mx-auto px-2 py-4 max-w-lg">
        {/* Modern App Bar / Hero Section */}
        <div className="text-center mb-6 pt-2">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gdg-blue rounded-full flex items-center justify-center shadow-lg">
              <img src="/placeholder-logo.png" alt="Mascot" className="w-12 h-12 object-contain" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 tracking-tight">GDG Event Companion</h1>
          <p className="text-base text-gray-600 mb-4">Your Smart Attendee Assistant</p>
          <div className="bg-white/70 backdrop-blur rounded-lg p-3 shadow border-l-4 border-gdg-blue animate-fade-in-up">
            <p className="text-gdg-blue font-medium">{greeting}</p>
          </div>
        </div>

        {/* Events Calendar Card */}
        <div className="mb-4 animate-fade-in-up">
          <div className="rounded-2xl shadow-xl bg-white/80 backdrop-blur border border-blue-100 p-4 flex flex-col items-center">
            <div className="flex items-center mb-2">
              <CalendarIcon className="w-5 h-5 text-gdg-blue mr-2" />
              <span className="font-semibold text-gdg-blue text-lg">Event Calendar</span>
            </div>
            <CalendarComponent
              onChange={(date: Date) => setCalendarDate(date)}
              value={calendarDate}
              className="w-full rounded-lg border-0"
              tileContent={tileContent}
              tileClassName={tileClassName}
            />
          </div>
        </div>

        {/* Event List for Selected Day */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-gray-700 text-base">
              {calendarDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          {eventsForSelected.length ? (
            <div className="space-y-2">
              {eventsForSelected.map((event, idx) => (
                <div key={idx} className="flex items-center bg-white rounded-xl shadow px-4 py-3 border border-gray-100">
                  <span className={clsx("w-2 h-2 rounded-full mr-3", event.color)}></span>
                  <span className="text-xs text-gray-500 font-medium mr-3">{event.time}</span>
                  <span className="font-semibold text-gray-800 text-sm leading-tight">{event.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-400">
              <CalendarIcon className="w-8 h-8 mb-2" />
              <span className="text-sm">No events for this day</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/assistant">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-gdg-blue">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gdg-blue rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Ask Assistant</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/sessions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-gdg-red">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gdg-red rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Sessions</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/attendance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-gdg-green">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gdg-green rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Attendance</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/resources">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-gdg-yellow">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gdg-yellow rounded-lg flex items-center justify-center">
                    <Archive className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Resources</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/feedback">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-gdg-blue">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gdg-blue rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Feedback</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Event Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gdg-blue">12</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gdg-red">8</div>
            <div className="text-sm text-gray-600">Speakers</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gdg-green">150+</div>
            <div className="text-sm text-gray-600">Attendees</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gdg-yellow">3</div>
            <div className="text-sm text-gray-600">Days</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tailwind custom animations (add to your tailwind.config.js)
// .animate-fade-in-up { @apply transition-all duration-300 ease-out opacity-0 translate-y-4; animation: fadeInUp 0.3s forwards; }
// @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
// .scrollbar-hide::-webkit-scrollbar { display: none; }
