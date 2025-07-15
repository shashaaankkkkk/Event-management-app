"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Clock, Users, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRGeneratorProps {
  sessionId: string
  sessionTitle: string
  onClose: () => void
}

export function QRGenerator({ sessionId, sessionTitle, onClose }: QRGeneratorProps) {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [attendanceCount, setAttendanceCount] = useState(0)
  const [qrData, setQrData] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Generate QR data
    const qrContent = JSON.stringify({
      sessionId,
      timestamp: Date.now(),
      type: "attendance",
    })
    setQrData(qrContent)

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          toast({
            title: "Attendance Window Closed",
            description: "The 10-minute attendance window has expired",
          })
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionId, onClose, toast])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const generateQRCodeURL = (data: string) => {
    // Using a QR code API service for demo
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-gdg-blue" />
              <span>Attendance QR Code</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>{sessionTitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Timer */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-gdg-red" />
              <span className="text-2xl font-bold text-gdg-red">{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="outline" className="text-sm">
              Time remaining
            </Badge>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <img
                src={generateQRCodeURL(qrData) || "/placeholder.svg"}
                alt="Attendance QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Attendance Count */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Users className="w-5 h-5 text-gdg-green" />
              <span className="text-xl font-bold text-gdg-green">{attendanceCount}</span>
            </div>
            <p className="text-sm text-gray-600">Students marked present</p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Students should scan this QR code with their app to mark attendance. The
              code will expire automatically after 10 minutes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
