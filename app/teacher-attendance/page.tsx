"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Calendar, Clock, User, GraduationCap, Download } from "lucide-react"
import { authService } from "@/lib/auth"
import { attendanceService, type SharedAttendance, type AttendanceRecord } from "@/lib/attendance-service"
import { useRouter } from "next/navigation"

export default function TeacherAttendancePage() {
  const [sharedSessions, setSharedSessions] = useState<SharedAttendance[]>([])
  const [selectedSession, setSelectedSession] = useState<SharedAttendance | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRecords, setIsLoadingRecords] = useState(false)

  const user = authService.getCurrentUser()
  const router = useRouter()

  // Redirect if not a teacher
  useEffect(() => {
    if (user?.role !== "teacher") {
      router.push("/unauthorized")
      return
    }
    loadSharedSessions()
  }, [user, router])

  const loadSharedSessions = async () => {
    try {
      const sessions = await attendanceService.getSharedAttendanceSessions()
      setSharedSessions(sessions)
    } catch (error) {
      console.error("Failed to load shared sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewAttendance = async (session: SharedAttendance) => {
    setSelectedSession(session)
    setIsLoadingRecords(true)

    try {
      const records = await attendanceService.getSessionAttendanceRecords(session.sessionId)
      setAttendanceRecords(records)
    } catch (error) {
      console.error("Failed to load attendance records:", error)
      setAttendanceRecords([])
    } finally {
      setIsLoadingRecords(false)
    }
  }

  const handleBackToSessions = () => {
    setSelectedSession(null)
    setAttendanceRecords([])
    setSearchTerm("")
  }

  const handleDownloadAttendance = () => {
    if (!selectedSession || attendanceRecords.length === 0) return

    const csvContent = [
      ["Name", "Roll Number", "Attendance Time"],
      ...attendanceRecords.map((record) => [
        record.name,
        record.rollNumber || "N/A",
        record.timestamp.toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedSession.sessionTitle.replace(/\s+/g, "_")}_attendance.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredRecords = attendanceRecords.filter(
    (record) =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.rollNumber && record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (user?.role !== "teacher") {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gdg-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared attendance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gdg-blue rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Shared Attendance</h1>
          </div>
          <p className="text-gray-600">View attendance records shared by organizers</p>
        </div>

        {!selectedSession ? (
          /* Sessions List */
          <>
            {sharedSessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Shared Attendance</h3>
                  <p className="text-gray-600">
                    Organizers haven't shared any session attendance yet. Check back later.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedSessions.map((session) => (
                  <Card key={session.sessionId} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-gdg-blue text-white">Shared</Badge>
                        <Badge variant="outline" className="text-xs">
                          {session.sharedAt.toLocaleDateString()}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{session.sessionTitle}</CardTitle>
                      <CardDescription>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {session.sessionSpeaker}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {session.sessionTime}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Shared {session.sharedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleViewAttendance(session)}
                        className="w-full bg-gdg-blue hover:bg-blue-600"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        View Attendance
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Attendance Records */
          <>
            {/* Session Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{selectedSession.sessionTitle}</CardTitle>
                    <CardDescription className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedSession.sessionSpeaker} • {selectedSession.sessionTime}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleBackToSessions}>
                    ← Back to Sessions
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Search and Actions */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by name or roll number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={handleDownloadAttendance}
                    variant="outline"
                    disabled={attendanceRecords.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Attendance List */}
            {isLoadingRecords ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-gdg-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading attendance records...</p>
                </CardContent>
              </Card>
            ) : filteredRecords.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? "No matching records" : "No attendance records"}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "No students marked attendance for this session"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gdg-green">{filteredRecords.length}</div>
                        <div className="text-sm text-gray-600">Students Present</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gdg-blue">
                          {new Date(Math.min(...filteredRecords.map((r) => r.timestamp.getTime()))).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </div>
                        <div className="text-sm text-gray-600">First Check-in</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gdg-yellow">
                          {new Date(Math.max(...filteredRecords.map((r) => r.timestamp.getTime()))).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Last Check-in</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Student List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRecords.map((record) => (
                    <Card key={record.userId} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">{record.name}</h3>
                            <p className="text-sm text-gray-600">Roll: {record.rollNumber || "N/A"}</p>
                          </div>
                          <Badge className="bg-gdg-green text-white">Present</Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {record.timestamp.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
