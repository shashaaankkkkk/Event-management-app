"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Users, GraduationCap, Shield, Phone, Mail, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [studentName, setStudentName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmationResult, setConfirmationResult] = useState<any>(null)

  const router = useRouter()
  const { toast } = useToast()

  const roleOptions = [
    {
      id: "organizer",
      title: "Organizer",
      description: "Manage events, create polls, view analytics",
      icon: Shield,
      color: "bg-gdg-red",
      authType: "email",
    },
    {
      id: "teacher",
      title: "Teacher",
      description: "Access sessions, resources, and feedback",
      icon: GraduationCap,
      color: "bg-gdg-blue",
      authType: "email",
    },
    {
      id: "student",
      title: "Student",
      description: "Mark attendance, access resources",
      icon: User,
      color: "bg-gdg-green",
      authType: "phone",
    },
    {
      id: "community",
      title: "Community Member",
      description: "Attend sessions, provide feedback",
      icon: Users,
      color: "bg-gdg-yellow",
      authType: "email",
    },
  ]

  const handleStudentPhoneAuth = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await authService.sendOTP(phoneNumber)
      setConfirmationResult(result)
      setOtpSent(true)
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerification = async () => {
    if (!otp || !rollNumber || !studentName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const user = await authService.verifyOTP(confirmationResult, otp)
      await authService.createUserProfile(user.uid, {
        role: "student",
        phone: phoneNumber,
        rollNumber,
        name: studentName,
      })

      toast({
        title: "Login Successful",
        description: `Welcome, ${studentName}!`,
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP or registration failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (role: string) => {
    if (!email || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter email and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const user = await authService.signInWithEmail(email, password)
      const profile = await authService.getUserProfile(user.uid)

      if (!profile || profile.role !== role) {
        toast({
          title: "Access Denied",
          description: "You don't have permission for this role",
          variant: "destructive",
        })
        await authService.signOut()
        return
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${profile.name || "User"}!`,
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials or account not found",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gdg-blue rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GDG Event Companion</h1>
          <p className="text-gray-600">Choose your role to continue</p>
        </div>

        {/* Development Credentials */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">🔧 Development Test Credentials</h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <div>
              <strong>Organizer:</strong> organizer@gdg.dev / dev123
            </div>
            <div>
              <strong>Teacher:</strong> teacher@gdg.dev / dev123
            </div>
            <div>
              <strong>Community:</strong> community@gdg.dev / dev123
            </div>
            <div>
              <strong>Student:</strong> Phone: +91 9999999999, OTP: 000000
            </div>
          </div>
        </div>

        <Tabs defaultValue="role-selection" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="role-selection">Select Role</TabsTrigger>
          </TabsList>

          <TabsContent value="role-selection" className="space-y-4">
            {roleOptions.map((role) => {
              const Icon = role.icon
              return (
                <Card
                  key={role.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-l-4"
                  style={{
                    borderLeftColor: role.color
                      .replace("bg-gdg-", "#")
                      .replace("blue", "4285F4")
                      .replace("red", "EA4335")
                      .replace("green", "34A853")
                      .replace("yellow", "FBBC05"),
                  }}
                  onClick={() => {
                    const tabs = document.querySelector('[role="tablist"]') as HTMLElement
                    const newTab = document.createElement("button")
                    newTab.setAttribute("data-state", "active")
                    newTab.setAttribute("value", role.id)
                    newTab.click = () => {
                      const tabsContent = document.querySelector(`[data-state="active"][data-orientation="horizontal"]`)
                      if (tabsContent) {
                        tabsContent.setAttribute("data-state", "inactive")
                      }
                      const newContent = document.querySelector(`[value="${role.id}"]`)
                      if (newContent) {
                        newContent.setAttribute("data-state", "active")
                      }
                    }

                    // Simple role selection - show appropriate auth form
                    const allCards = document.querySelectorAll("[data-role-card]")
                    allCards.forEach((card) => card.classList.add("hidden"))
                    const targetCard = document.querySelector(`[data-role-card="${role.id}"]`)
                    if (targetCard) {
                      targetCard.classList.remove("hidden")
                    }
                  }}
                  data-role-selector={role.id}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.title}</CardTitle>
                        <CardDescription className="text-sm">{role.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>

        {/* Student Authentication Form */}
        <Card className="mt-6 hidden" data-role-card="student">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gdg-green" />
              <span>Student Login</span>
            </CardTitle>
            <CardDescription>Verify your phone number and enter your details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!otpSent ? (
              <>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleStudentPhoneAuth}
                  disabled={isLoading}
                  className="w-full bg-gdg-green hover:bg-green-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    type="text"
                    placeholder="e.g., 21CS001"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="studentName">Full Name</Label>
                  <Input
                    id="studentName"
                    type="text"
                    placeholder="Enter your full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleOTPVerification}
                  disabled={isLoading}
                  className="w-full bg-gdg-green hover:bg-green-600"
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
                <Button variant="outline" onClick={() => setOtpSent(false)} className="w-full">
                  Change Phone Number
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Email Authentication Forms */}
        {["organizer", "teacher", "community"].map((role) => (
          <Card key={role} className="mt-6 hidden" data-role-card={role}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {role === "organizer" && <Shield className="w-5 h-5 text-gdg-red" />}
                {role === "teacher" && <GraduationCap className="w-5 h-5 text-gdg-blue" />}
                {role === "community" && <Users className="w-5 h-5 text-gdg-yellow" />}
                <span className="capitalize">{role} Login</span>
              </CardTitle>
              <CardDescription>Sign in with your email and password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`${role}-email`}>Email</Label>
                <Input
                  id={`${role}-email`}
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`${role}-password`}>Password</Label>
                <Input
                  id={`${role}-password`}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                onClick={() => handleEmailAuth(role)}
                disabled={isLoading}
                className={`w-full ${
                  role === "organizer"
                    ? "bg-gdg-red hover:bg-red-600"
                    : role === "teacher"
                      ? "bg-gdg-blue hover:bg-blue-600"
                      : "bg-gdg-yellow hover:bg-yellow-600 text-black"
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Back to Role Selection */}
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => {
            const allCards = document.querySelectorAll("[data-role-card]")
            allCards.forEach((card) => card.classList.add("hidden"))
          }}
        >
          ← Back to Role Selection
        </Button>
      </div>
    </div>
  )
}
