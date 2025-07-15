"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { geminiService } from "@/lib/gemini"

export function GeminiDebug() {
  const [testResult, setTestResult] = useState<string>("")
  const [isTesting, setIsTesting] = useState(false)

  const testConnection = async () => {
    setIsTesting(true)
    setTestResult("Testing...")
    
    try {
      const result = await geminiService.getInstance().testConnection()
      setTestResult(result.success ? "✅ Connected" : "❌ Failed")
    } catch (error) {
      setTestResult("❌ Error")
    } finally {
      setIsTesting(false)
    }
  }

  const checkConfig = () => {
    const isConfigured = geminiService.getInstance().isConfigured()
    setTestResult(isConfigured ? "✅ Configured" : "❌ Not configured")
  }

  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-700">Gemini Status:</span>
        <span className={testResult.includes("✅") ? "text-green-600" : testResult.includes("❌") ? "text-red-600" : "text-gray-500"}>
          {testResult || "Not tested"}
        </span>
      </div>
      
      <div className="flex space-x-1">
        <Button 
          onClick={checkConfig} 
          variant="outline" 
          size="sm" 
          className="h-6 px-2 text-xs"
        >
          Config
        </Button>
        <Button 
          onClick={testConnection} 
          disabled={isTesting} 
          size="sm" 
          className="h-6 px-2 text-xs"
        >
          {isTesting ? "..." : "Test"}
        </Button>
      </div>
    </div>
  )
} 