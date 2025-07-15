"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, MapPin, QrCode, UserCheck, Camera, Play } from "lucide-react"
import { mockSessions } from "@/lib/mock-data"
import { authService } from "@/lib/auth"
import { QRScanner } from "./qr-scanner"
import { QRGenerator } from "./qr-generator"

interface AttendanceData {
  sessionId: string
  attendeeCount: number
  isActive: boolean
  userAttended: boolean
}

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([
    { sessionId: "1", attendeeCount: 45, isActive: false, userAttended: false },
    { sessionId: "2", attendeeCount: 32, isActive: false, userAttended: true },
    { sessionId: "3", attendeeCount: 28, isActive: false, userAttended: false },
  ])
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showQRGenerator, setShowQRGenerator] = useState<{ sessionId: string; title: string } | null>(null)

  const user = authService.getCurrentUser()
  const isOrganizer = user?.role === "organizer"
  const isStudent = user?.role === "student"

  const handleMarkAttendance = (sessionId: string) => {
    setAttendanceData((prev) =>
      prev.map((item) =>
        item.sessionId === sessionId ? { ...item, userAttended: true, attendeeCount: item.attendeeCount + 1 } : item,
      ),
    )
  }

  const handleStartAttendance = async (sessionId: string, sessionTitle: string) => {
    if (!isOrganizer) return

    try {
      await authService.createAttendanceWindow(sessionId, user!.uid)
      setAttendanceData((prev) =>
        prev.map((item) => (item.sessionId === sessionId ? { ...item, isActive: true } : { ...item, isActive: false })),
      )
      setShowQRGenerator({ sessionId, title: sessionTitle })
    } catch (error) {
      console.error("Failed to start attendance:", error)
    }
  }

  const getAttendanceForSession = (sessionId: string) => {
    return attendanceData.find((item) => item.sessionId === sessionId)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance</h1>
          <p className="text-gray-600">
            {isOrganizer && "Manage attendance polls and view live session data"}
            {isStudent && "Mark your attendance and view your attendance history"}
            {!isOrganizer && !isStudent && "View session attendance information"}
          </p>
        </div>

        {/* Student QR Scanner Button */}
        {isStudent && (
          <Card className="mb-6 border-l-4 border-gdg-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-gdg-green" />
                <span>Mark Attendance</span>
              </CardTitle>
              <CardDescription>Scan QR code to mark your attendance for active sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowQRScanner(true)} className="w-full bg-gdg-green hover:bg-green-600">
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR Code
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Organizer Controls */}
        {isOrganizer && (
          <Card className="mb-6 border-l-4 border-gdg-red">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-gdg-red" />
                <span>Organizer Controls</span>
              </CardTitle>
              <CardDescription>Start attendance polls for sessions (10-minute windows)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockSessions.slice(0, 3).map((session) => {
                  const attendance = getAttendanceForSession(session.id)
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{session.title}</p>
                        <p className="text-xs text-gray-600">{session.time}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleStartAttendance(session.id, session.title)}
                        disabled={attendance?.isActive}
                        className={attendance?.isActive ? "bg-gray-400" : "bg-gdg-red hover:bg-red-600"}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        {attendance?.isActive ? "Active" : "Start"}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Polls */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isOrganizer ? "Active Attendance Polls" : "Current Sessions"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockSessions.map((session) => {
              const attendance = getAttendanceForSession(session.id)
              if (!attendance?.isActive && !isOrganizer) return null

              return (
                <Card
                  key={session.id}
                  className={`border-l-4 ${attendance?.isActive ? "border-gdg-blue" : "border-gray-300"}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      {attendance?.isActive ? (
                        <Badge className="bg-gdg-blue text-white mb-2">Live Poll</Badge>
                      ) : (
                        <Badge variant="secondary" className="mb-2">
                          Inactive
                        </Badge>
                      )}
                      <Badge variant="outline">{session.day}</Badge>
                    </div>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <CardDescription>{session.speaker}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {session.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {session.location}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Current Attendance</span>
                          <span className="text-lg font-bold text-gdg-blue">{attendance?.attendeeCount || 0}</span>
                        </div>
                        <Progress value={((attendance?.attendeeCount || 0) / 60) * 100} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">
                          {Math.round(((attendance?.attendeeCount || 0) / 60) * 100)}% capacity
                        </p>
                      </div>

                      {isStudent && attendance?.isActive && !attendance.userAttended && (
                        <Button
                          onClick={() => setShowQRScanner(true)}
                          className="w-full bg-gdg-green hover:bg-green-600"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Scan to Mark Attendance
                        </Button>
                      )}

                      {isStudent && attendance?.userAttended && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center text-green-800">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span className="font-medium">Attendance Marked</span>
                          </div>
                          <p className="text-sm text-green-600 mt-1">You're checked in for this session</p>
                        </div>
                      )}

                      {isOrganizer && attendance?.isActive && (
                        <Button
                          onClick={() => setShowQRGenerator({ sessionId: session.id, title: session.title })}
                          variant="outline"
                          className="w-full"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Show QR Code
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Past Sessions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSessions.map((session) => {
              const attendance = getAttendanceForSession(session.id)
              if (attendance?.isActive) return null

              return (
                <Card key={session.id} className="opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary">Completed</Badge>
                      <Badge variant="outline">{session.day}</Badge>
                    </div>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <CardDescription>{session.speaker}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {session.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {session.location}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Final Attendance:</span>
                        <span className="font-medium">{attendance?.attendeeCount || 0}</span>
                      </div>

                      {isStudent &&
                        (attendance?.userAttended ? (
                          <div className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            You attended this session
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">You did not attend this session</div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onClose={() => setShowQRScanner(false)}
          onSuccess={(sessionId) => {
            handleMarkAttendance(sessionId)
            setShowQRScanner(false)
          }}
        />
      )}

      {/* QR Generator Modal */}
      {showQRGenerator && (
        <QRGenerator
          sessionId={showQRGenerator.sessionId}
          sessionTitle={showQRGenerator.title}
          onClose={() => setShowQRGenerator(null)}
        />
      )}
    </div>
  )
}
