// Attendance sharing service
export interface AttendanceRecord {
  userId: string
  sessionId: string
  name: string
  rollNumber?: string
  timestamp: Date
  present: boolean
}

export interface SharedAttendance {
  sessionId: string
  shared: boolean
  sharedBy: string
  sharedAt: Date
  sessionTitle: string
  sessionSpeaker: string
  sessionTime: string
}

class AttendanceService {
  // Share attendance with teachers
  async shareAttendanceWithTeachers(sessionId: string, sharedBy: string, sessionDetails: any): Promise<void> {
    const sharedData: SharedAttendance = {
      sessionId,
      shared: true,
      sharedBy,
      sharedAt: new Date(),
      sessionTitle: sessionDetails.title,
      sessionSpeaker: sessionDetails.speaker,
      sessionTime: sessionDetails.time,
    }

    // In real implementation, save to Firestore
    localStorage.setItem(`shared_attendance_${sessionId}`, JSON.stringify(sharedData))
  }

  // Get shared attendance sessions (for teachers)
  async getSharedAttendanceSessions(): Promise<SharedAttendance[]> {
    const sharedSessions: SharedAttendance[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("shared_attendance_")) {
        const data = localStorage.getItem(key)
        if (data) {
          const sharedData = JSON.parse(data)
          if (sharedData.shared) {
            sharedSessions.push({
              ...sharedData,
              sharedAt: new Date(sharedData.sharedAt),
            })
          }
        }
      }
    }

    return sharedSessions.sort((a, b) => b.sharedAt.getTime() - a.sharedAt.getTime())
  }

  // Check if attendance is shared for a session
  async isAttendanceShared(sessionId: string): Promise<boolean> {
    const stored = localStorage.getItem(`shared_attendance_${sessionId}`)
    if (stored) {
      const data = JSON.parse(stored)
      return data.shared === true
    }
    return false
  }

  // Get attendance records for a shared session
  async getSessionAttendanceRecords(sessionId: string): Promise<AttendanceRecord[]> {
    const isShared = await this.isAttendanceShared(sessionId)
    if (!isShared) {
      throw new Error("Attendance not shared for this session")
    }

    const attendanceRecords: AttendanceRecord[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(`attendance_${sessionId}_`)) {
        const data = localStorage.getItem(key)
        if (data) {
          const attendance = JSON.parse(data)

          // Get user profile to fetch name and roll number
          const userProfile = this.getUserProfileFromStorage(attendance.userId)

          attendanceRecords.push({
            userId: attendance.userId,
            sessionId: attendance.sessionId,
            name: userProfile?.name || "Unknown Student",
            rollNumber: userProfile?.rollNumber,
            timestamp: new Date(attendance.timestamp),
            present: attendance.present,
          })
        }
      }
    }

    return attendanceRecords.sort((a, b) => a.name.localeCompare(b.name))
  }

  // Helper to get user profile from localStorage
  private getUserProfileFromStorage(userId: string): any {
    // In real implementation, this would query Firestore
    // For now, we'll create mock student data
    const mockStudents = [
      { uid: userId, name: "Aarav Sharma", rollNumber: "21CS001" },
      { uid: userId, name: "Priya Patel", rollNumber: "21CS002" },
      { uid: userId, name: "Arjun Kumar", rollNumber: "21CS003" },
      { uid: userId, name: "Sneha Reddy", rollNumber: "21CS004" },
      { uid: userId, name: "Vikram Singh", rollNumber: "21CS005" },
    ]

    // Return a random student for demo purposes
    return mockStudents[Math.floor(Math.random() * mockStudents.length)]
  }

  // Get attendance statistics for organizers
  async getAttendanceStats(sessionId: string): Promise<{ total: number; present: number; percentage: number }> {
    const records = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(`attendance_${sessionId}_`)) {
        const data = localStorage.getItem(key)
        if (data) {
          records.push(JSON.parse(data))
        }
      }
    }

    const present = records.filter((r) => r.present).length
    const total = records.length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0

    return { total, present, percentage }
  }
}

export const attendanceService = new AttendanceService()
