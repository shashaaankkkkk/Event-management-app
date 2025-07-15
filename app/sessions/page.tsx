"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, User, Search } from "lucide-react"
import { mockSessions } from "@/lib/mock-data"
import Link from "next/link"

export default function SessionsPage() {
  const [sessions, setSessions] = useState(mockSessions)
  const [filteredSessions, setFilteredSessions] = useState(mockSessions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDay, setSelectedDay] = useState("all")
  const [selectedTrack, setSelectedTrack] = useState("all")

  useEffect(() => {
    let filtered = sessions

    if (searchTerm) {
      filtered = filtered.filter(
        (session) =>
          session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.speaker.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDay !== "all") {
      filtered = filtered.filter((session) => session.day === selectedDay)
    }

    if (selectedTrack !== "all") {
      filtered = filtered.filter((session) => session.track === selectedTrack)
    }

    setFilteredSessions(filtered)
  }, [sessions, searchTerm, selectedDay, selectedTrack])

  const getTrackColor = (track: string) => {
    switch (track) {
      case "AI/ML":
        return "bg-gdg-blue text-white"
      case "Web":
        return "bg-gdg-red text-white"
      case "Mobile":
        return "bg-gdg-green text-white"
      case "Cloud":
        return "bg-gdg-yellow text-black"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sessions</h1>
          <p className="text-gray-600">Discover all sessions, workshops, and keynotes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search sessions or speakers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                <SelectItem value="Day 1">Day 1</SelectItem>
                <SelectItem value="Day 2">Day 2</SelectItem>
                <SelectItem value="Day 3">Day 3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Select track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracks</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Cloud">Cloud</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getTrackColor(session.track)}>{session.track}</Badge>
                  <Badge variant="outline">{session.day}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{session.title}</CardTitle>
                <CardDescription className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{session.speaker}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {session.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {session.location}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{session.description}</p>
                <div className="flex space-x-2">
                  <Link href={`/sessions/${session.id}`}>
                    <Button size="sm" className="flex-1 bg-gdg-blue hover:bg-blue-600">
                      View Details
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Add to Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
