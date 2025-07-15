// Authentication service with Firebase integration
export interface UserProfile {
  uid: string
  role: "organizer" | "teacher" | "student" | "community"
  name?: string
  email?: string
  phone?: string
  rollNumber?: string
  createdAt: Date
}

export interface AttendanceWindow {
  sessionId: string
  active: boolean
  openedAt: Date
  expiresAt: Date
  createdBy: string
}

class AuthService {
  private currentUser: UserProfile | null = null

  // Mock Firebase Auth functions
  async sendOTP(phoneNumber: string): Promise<any> {
    // Development hardcoded phone number for testing
    if (phoneNumber === "+91 9999999999" || phoneNumber === "9999999999") {
      console.log(`Sending OTP to ${phoneNumber} (DEV MODE)`)
      return Promise.resolve({
        verificationId: "dev-verification-id",
        phoneNumber,
        isDev: true,
      })
    }

    // In real implementation, use Firebase Phone Auth
    console.log(`Sending OTP to ${phoneNumber}`)
    return Promise.resolve({
      verificationId: "mock-verification-id",
      phoneNumber,
    })
  }

  async verifyOTP(confirmationResult: any, otp: string): Promise<{ uid: string }> {
    // Development OTP for testing
    if (confirmationResult.isDev && otp === "000000") {
      return { uid: `student_dev_${Date.now()}` }
    }

    // In real implementation, verify OTP with Firebase
    if (otp === "123456") {
      // Mock OTP for demo
      return { uid: `student_${Date.now()}` }
    }
    throw new Error("Invalid OTP")
  }

  async signInWithEmail(email: string, password: string): Promise<{ uid: string }> {
    // Development hardcoded credentials for testing
    const devCredentials = [
      { email: "organizer@gdg.dev", password: "dev123", role: "organizer", name: "Dev Organizer" },
      { email: "teacher@gdg.dev", password: "dev123", role: "teacher", name: "Dev Teacher" },
      { email: "community@gdg.dev", password: "dev123", role: "community", name: "Dev Community" },
    ]

    // Check hardcoded dev credentials first
    const devUser = devCredentials.find((cred) => cred.email === email && cred.password === password)
    if (devUser) {
      const uid = `${devUser.role}_dev_${Date.now()}`
      // Auto-create profile for dev user
      await this.createUserProfile(uid, {
        role: devUser.role as any,
        name: devUser.name,
        email: devUser.email,
      })
      return { uid }
    }

    // Original mock authentication logic
    if (password === "password123") {
      const role = email.includes("organizer") ? "organizer" : email.includes("teacher") ? "teacher" : "community"
      return { uid: `${role}_${Date.now()}` }
    }
    throw new Error("Invalid credentials")
  }

  async createUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    // In real implementation, save to Firestore
    const userProfile: UserProfile = {
      uid,
      role: profile.role!,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      rollNumber: profile.rollNumber,
      createdAt: new Date(),
    }

    this.currentUser = userProfile
    localStorage.setItem("userProfile", JSON.stringify(userProfile))
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    // In real implementation, fetch from Firestore
    const stored = localStorage.getItem("userProfile")
    if (stored) {
      const profile = JSON.parse(stored)
      if (profile.uid === uid) {
        this.currentUser = profile
        return profile
      }
    }
    return null
  }

  getCurrentUser(): UserProfile | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem("userProfile")
      if (stored) {
        this.currentUser = JSON.parse(stored)
      }
    }
    return this.currentUser
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem("userProfile")
  }

  // Attendance Window Management
  async createAttendanceWindow(sessionId: string, createdBy: string): Promise<AttendanceWindow> {
    const window: AttendanceWindow = {
      sessionId,
      active: true,
      openedAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      createdBy,
    }

    // In real implementation, save to Firestore
    localStorage.setItem(`attendance_window_${sessionId}`, JSON.stringify(window))
    return window
  }

  async getAttendanceWindow(sessionId: string): Promise<AttendanceWindow | null> {
    const stored = localStorage.getItem(`attendance_window_${sessionId}`)
    if (stored) {
      const window = JSON.parse(stored)
      // Check if window is still active
      if (new Date() > new Date(window.expiresAt)) {
        window.active = false
        localStorage.setItem(`attendance_window_${sessionId}`, JSON.stringify(window))
      }
      return window
    }
    return null
  }

  async markAttendance(sessionId: string, userId: string): Promise<void> {
    const window = await this.getAttendanceWindow(sessionId)
    if (!window || !window.active) {
      throw new Error("Attendance window is not active")
    }

    // In real implementation, save to Firestore
    const attendance = {
      sessionId,
      userId,
      timestamp: new Date(),
      present: true,
    }

    localStorage.setItem(`attendance_${sessionId}_${userId}`, JSON.stringify(attendance))
  }

  async getUserAttendance(userId: string): Promise<any[]> {
    // In real implementation, query Firestore
    const attendance = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("attendance_") && key.includes(userId)) {
        const data = localStorage.getItem(key)
        if (data) {
          attendance.push(JSON.parse(data))
        }
      }
    }
    return attendance
  }
}

export const authService = new AuthService()
