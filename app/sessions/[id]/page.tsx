"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Share2, Users, CheckCircle } from "lucide-react"
import { mockSessions } from "@/lib/mock-data"
import { authService } from "@/lib/auth"
import { attendanceService } from "@/lib/attendance-service"
import { useToast } from "@/hooks/use-toast"
import { useParams, useRouter } from "next/navigation"

export default function SessionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [session, setSession] = useState<any>(null)
  const [isShared, setIsShared] = useState(false)
  const [attendanceStats, setAttendanceStats] = useState({ total: 0, present: 0, percentage: 0 })
  const [isLoading, setIsLoading] = useState(false)

  const user = authService.getCurrentUser()
  const isOrganizer = user?.role === "organizer"

  useEffect(() => {
    const sessionId = params.id as string
    const foundSession = mockSessions.find((s) => s.id === sessionId)

    if (foundSession) {
      setSession(foundSession)
      loadAttendanceData(sessionId)
    } else {
      router.push("/sessions")
    }
  }, [params.id, router])

  const loadAttendanceData = async (sessionId: string) => {
    try {
      const shared = await attendanceService.isAttendanceShared(sessionId)
      setIsShared(shared)

      const stats = await attendanceService.getAttendanceStats(sessionId)
      setAttendanceStats(stats)
    } catch (error) {
      console.error("Failed to load attendance data:", error)
    }
  }

  const handleShareAttendance = async () => {
    if (!session || !user) return

    setIsLoading(true)
    try {
      await attendanceService.shareAttendanceWithTeachers(session.id, user.uid, {
        title: session.title,
        speaker: session.speaker,
        time: session.time,
      })

      setIsShared(true)
      toast({
        title: "Attendance Shared",
        description: "Session attendance is now visible to all teachers",
      })
    } catch (error) {
      toast({
        title: "Sharing Failed",
        description: "Failed to share attendance with teachers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gdg-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    )
  }

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
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          ← Back to Sessions
        </Button>

        {/* Session Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <Badge className={getTrackColor(session.track)}>{session.track}</Badge>
              <Badge variant="outline">{session.day}</Badge>
            </div>
            <CardTitle className="text-2xl mb-2">{session.title}</CardTitle>
            <CardDescription className="flex items-center space-x-1 text-lg">
              <User className="w-5 h-5" />
              <span>{session.speaker}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{session.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>{session.day}</span>
                </div>
              </div>

              {/* Attendance Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Attendance Overview
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gdg-blue">{attendanceStats.present}</div>
                    <div className="text-xs text-gray-600">Present</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">{attendanceStats.total}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gdg-green">{attendanceStats.percentage}%</div>
                    <div className="text-xs text-gray-600">Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{session.description}</p>
            </div>

            {/* Organizer Actions */}
            {isOrganizer && (
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Organizer Actions</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleShareAttendance}
                    disabled={isLoading || isShared}
                    className={`flex-1 ${isShared ? "bg-green-500 hover:bg-green-600" : "bg-gdg-blue hover:bg-blue-600"}`}
                  >
                    {isShared ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Shared with Teachers
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 mr-2" />
                        {isLoading ? "Sharing..." : "Share Attendance with Teachers"}
                      </>
                    )}
                  </Button>

                  <Button variant="outline" onClick={() => router.push("/attendance")} className="flex-1">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Attendance
                  </Button>
                </div>
              </div>
            )}

            {/* Shared Status */}
            {isShared && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Attendance Shared</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  This session's attendance list is now visible to all teachers
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
