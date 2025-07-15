"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X } from "lucide-react"
import { authService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface QRScannerProps {
  onClose: () => void
  onSuccess: (sessionId: string) => void
}

export function QRScanner({ onClose, onSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (err) {
      setError("Camera access denied or not available")
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleManualInput = () => {
    // For demo purposes, simulate QR scan
    const sessionId = "1" // Mock session ID
    handleQRDetected(sessionId)
  }

  const handleQRDetected = async (sessionId: string) => {
    const user = authService.getCurrentUser()
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to mark attendance",
        variant: "destructive",
      })
      return
    }

    if (user.role !== "student") {
      toast({
        title: "Access Denied",
        description: "Only students can mark attendance",
        variant: "destructive",
      })
      return
    }

    try {
      await authService.markAttendance(sessionId, user.uid)
      toast({
        title: "Attendance Marked",
        description: "Your attendance has been recorded successfully",
      })
      onSuccess(sessionId)
    } catch (error) {
      toast({
        title: "Attendance Failed",
        description: "Attendance window may be closed or expired",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-gdg-green" />
              <span>Scan QR Code</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>Point your camera at the QR code to mark attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleManualInput} className="bg-gdg-green hover:bg-green-600">
                Simulate QR Scan (Demo)
              </Button>
            </div>
          ) : (
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-gray-100 rounded-lg object-cover" />
              {isScanning && (
                <div className="absolute inset-0 border-2 border-gdg-green rounded-lg">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 border-2 border-gdg-green border-dashed rounded-lg"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <Button onClick={handleManualInput} variant="outline" className="w-full bg-transparent">
              Demo: Mark Attendance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
