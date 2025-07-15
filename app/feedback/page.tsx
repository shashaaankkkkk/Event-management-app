"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, Send, CheckCircle, MessageSquare } from "lucide-react"
import { mockSessions } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface FeedbackData {
  sessionId: string
  rating: number
  comment: string
  submitted: boolean
}

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([])
  const { toast } = useToast()

  const getFeedbackForSession = (sessionId: string): FeedbackData => {
    return (
      feedbackData.find((f) => f.sessionId === sessionId) || {
        sessionId,
        rating: 0,
        comment: "",
        submitted: false,
      }
    )
  }

  const updateFeedback = (sessionId: string, updates: Partial<FeedbackData>) => {
    setFeedbackData((prev) => {
      const existing = prev.find((f) => f.sessionId === sessionId)
      if (existing) {
        return prev.map((f) => (f.sessionId === sessionId ? { ...f, ...updates } : f))
      } else {
        return [...prev, { sessionId, rating: 0, comment: "", submitted: false, ...updates }]
      }
    })
  }

  const submitFeedback = (sessionId: string) => {
    const feedback = getFeedbackForSession(sessionId)
    if (feedback.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting feedback.",
        variant: "destructive",
      })
      return
    }

    updateFeedback(sessionId, { submitted: true })
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! It helps us improve future events.",
    })
  }

  const StarRating = ({
    rating,
    onRatingChange,
    disabled = false,
  }: {
    rating: number
    onRatingChange: (rating: number) => void
    disabled?: boolean
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onRatingChange(star)}
            className={`p-1 rounded transition-colors ${disabled ? "cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            <Star className={`w-6 h-6 ${star <= rating ? "fill-gdg-yellow text-gdg-yellow" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    )
  }

  // Separate sessions into completed and upcoming
  const completedSessions = mockSessions.slice(0, 2) // Mock: first 2 are completed
  const upcomingSessions = mockSessions.slice(2) // Mock: rest are upcoming

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gdg-blue rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
          </div>
          <p className="text-gray-600">Rate sessions and share your experience</p>
        </div>

        {/* Completed Sessions - Available for Feedback */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rate Completed Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedSessions.map((session) => {
              const feedback = getFeedbackForSession(session.id)

              return (
                <Card
                  key={session.id}
                  className={`${feedback.submitted ? "border-green-200 bg-green-50" : "border-l-4 border-gdg-blue"}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      {feedback.submitted ? (
                        <Badge className="bg-green-500 text-white mb-2">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Submitted
                        </Badge>
                      ) : (
                        <Badge className="bg-gdg-blue text-white mb-2">Feedback Needed</Badge>
                      )}
                      <Badge variant="outline">{session.day}</Badge>
                    </div>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <CardDescription>
                      <span>by {session.speaker}</span>
                      <br />
                      <span className="text-sm">
                        {session.time} • {session.location}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                        <StarRating
                          rating={feedback.rating}
                          onRatingChange={(rating) => updateFeedback(session.id, { rating })}
                          disabled={feedback.submitted}
                        />
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comments (Optional)</label>
                        <Textarea
                          placeholder="Share your thoughts about this session..."
                          value={feedback.comment}
                          onChange={(e) => updateFeedback(session.id, { comment: e.target.value })}
                          disabled={feedback.submitted}
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Submit Button */}
                      {!feedback.submitted ? (
                        <Button
                          onClick={() => submitFeedback(session.id)}
                          className="w-full bg-gdg-blue hover:bg-blue-600"
                          disabled={feedback.rating === 0}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Submit Feedback
                        </Button>
                      ) : (
                        <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center text-green-800">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span className="font-medium">Feedback Submitted</span>
                          </div>
                          <p className="text-sm text-green-600 mt-1">Thank you for your feedback!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary">Upcoming</Badge>
                    <Badge variant="outline">{session.day}</Badge>
                  </div>
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <CardDescription>
                    <span>by {session.speaker}</span>
                    <br />
                    <span className="text-sm">
                      {session.time} • {session.location}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Feedback will be available after the session</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feedback Summary */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Star className="w-5 h-5 text-gdg-blue mt-0.5" />
            <div>
              <h3 className="font-medium text-gdg-blue">Your Feedback Matters</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your feedback helps us improve future GDG events and ensures we deliver the best possible experience for
                our community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
