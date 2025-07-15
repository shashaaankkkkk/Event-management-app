// Gemini AI integration using Google's Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface GeminiResponse {
  text: string
  confidence: number
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null
  private isInitialized = false

  constructor() {
    // Don't initialize in constructor to avoid SSR issues
  }

  private initialize() {
    if (this.isInitialized) return

    try {
      // Get API key from environment variables
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
      
      if (!apiKey) {
        console.warn('Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY environment variable.')
        return
      }

      // Check if API key looks valid (basic validation)
      if (apiKey.length < 10) {
        console.warn('Gemini API key appears to be invalid (too short).')
        return
      }

      console.log('Initializing Gemini service with API key...')
      
      // Initialize the Google Generative AI
      this.genAI = new GoogleGenerativeAI(apiKey)
      
      // Get the model
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      
      // Verify the model was created successfully
      if (!this.model) {
        throw new Error('Failed to create Gemini model')
      }
      
      this.isInitialized = true
      console.log('Gemini service initialized successfully!')
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error)
      this.isInitialized = false
      this.model = null
      this.genAI = null
    }
  }

  // Method to check if service is properly configured
  isConfigured(): boolean {
    this.initialize()
    return this.isInitialized && this.model !== null
  }

  // Method to test the service configuration
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      this.initialize()
      
      if (!this.isInitialized || !this.model) {
        return {
          success: false,
          message: 'Service not initialized. Check API key configuration.'
        }
      }

      // Try a simple test prompt
      const result = await this.model.generateContent('Hello')
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        message: `Connection successful! Response: ${text}`
      }
    } catch (error) {
      console.error('Test connection failed:', error)
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<GeminiResponse> {
    try {
      // Initialize if not already done
      this.initialize()

      if (!this.isInitialized || !this.model) {
        console.error('Gemini model not initialized. Check API key configuration.')
        return {
          text: "AI service is not configured. Please check your API key setup.",
          confidence: 0.0,
        }
      }

      // Create context-aware prompt
      const fullPrompt = this.buildPrompt(prompt, context)
      
      // Generate response using Gemini API
      const result = await this.model.generateContent(fullPrompt)
      const response = await result.response
      const text = response.text()

      return {
        text: text || "I'm sorry, I couldn't generate a response at the moment.",
        confidence: 0.9, // Gemini doesn't provide confidence scores, using default
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          return {
            text: "AI service is not configured. Please set up your Gemini API key in the environment variables.",
            confidence: 0.0,
          }
        }
        if (error.message.includes('quota') || error.message.includes('rate limit')) {
          return {
            text: "AI service is currently busy. Please try again in a moment.",
            confidence: 0.0,
          }
        }
        if (error.message.includes('model') || error.message.includes('generateContent')) {
          return {
            text: "AI service is not properly initialized. Please check your configuration.",
            confidence: 0.0,
          }
        }
      }
      
      return {
        text: "I'm having trouble connecting to my AI service right now. Please try again later.",
        confidence: 0.0,
      }
    }
  }

  private buildPrompt(prompt: string, context?: any): string {
    const baseContext = `You are an AI assistant for a GDG (Google Developer Group) event companion app. 
    You help attendees with information about sessions, schedules, locations, speakers, and resources.
    Be helpful, concise, and friendly in your responses.`

    const eventContext = context ? `\n\nEvent Context: ${JSON.stringify(context)}` : ''
    
    return `${baseContext}${eventContext}\n\nUser Question: ${prompt}\n\nPlease provide a helpful response:`
  }
}

// Create a singleton instance
let geminiServiceInstance: GeminiService | null = null

export const geminiService = {
  getInstance: () => {
    if (!geminiServiceInstance) {
      geminiServiceInstance = new GeminiService()
    }
    return geminiServiceInstance
  }
}
