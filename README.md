# GDG Event Companion - Smart Attendee Assistant

A comprehensive web application for managing GDG events with role-based authentication, QR code attendance tracking, and AI-powered assistance.

## Features

### Authentication System
- **Multi-role Authentication**: Organizer, Teacher, Student, Community Member
- **Phone OTP Authentication**: Firebase phone verification for students
- **Email/Password Authentication**: For organizers, teachers, and community members
- **Role-based Access Control**: Different UI and permissions per role

### QR Code Attendance System
- **Real-time QR Generation**: Organizers create time-limited attendance windows (10 minutes)
- **Mobile QR Scanning**: Students scan QR codes to mark attendance
- **Live Attendance Tracking**: Real-time counts and statistics
- **Attendance Sharing**: Organizers can share session attendance with teachers

### Teacher Dashboard
- **Shared Attendance View**: Teachers can view attendance shared by organizers
- **Session-wise Records**: Detailed attendance with student names and roll numbers
- **CSV Export**: Download attendance reports
- **Search & Filter**: Find specific students or sessions

### AI Assistant
- **Context-aware Responses**: Smart Q&A about sessions, locations, and event info
- **Quick Questions**: Pre-defined common queries
- **Session Information**: Get details about speakers, timings, and locations

### Resource Management
- **Session Materials**: Access slides, PDFs, and links
- **Search & Filter**: Filter by type, day, or session
- **Download Support**: Easy access to session resources

### Feedback System
- **Star Ratings**: Rate completed sessions (1-5 stars)
- **Comments**: Provide detailed feedback
- **Session Status**: Different UI for completed vs upcoming sessions

## Demo Credentials

### Email-based Authentication:
```
Organizer: organizer@gdg.dev / dev123
Teacher: teacher@gdg.dev / dev123
Community: community@gdg.dev / dev123
```

### Student Phone Authentication:
```
Phone: +91 9999999999 (or 9999999999)
OTP: 000000
Roll Number: Any (e.g., 21CS001)
Name: Any name
```

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS** with custom GDG color scheme
- **shadcn/ui** components
- **Firebase** (Auth & Firestore ready)
- **Google Gemini AI** for intelligent assistance
- **Lucide React** icons

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gdg-event-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Gemini AI API Key**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Edit .env.local and add your Gemini API key
   # Get your API key from: https://makersuite.google.com/app/apikey
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
app/
├── attendance/              # QR attendance system
│   ├── qr-scanner.tsx      # Student QR scanning
│   ├── qr-generator.tsx    # Organizer QR generation
│   └── page.tsx            # Main attendance page
├── assistant/              # AI assistant
├── feedback/               # Session feedback system
├── login/                  # Authentication
├── resources/              # Session materials
├── sessions/               # Session management
│   └── [id]/              # Individual session details
├── teacher-attendance/     # Teacher dashboard
├── unauthorized/           # Access denied page
├── globals.css            # Global styles with GDG colors
├── layout.tsx             # Root layout with auth guard
└── page.tsx               # Home dashboard

components/
├── ui/                    # shadcn/ui components
├── auth-guard.tsx         # Route protection
├── navigation.tsx         # Mobile bottom navigation
└── user-header.tsx        # User info header

lib/
├── auth.ts                # Authentication service
├── attendance-service.ts  # Attendance management
├── firebase.ts            # Firebase configuration
├── gemini.ts              # AI service integration
├── mock-data.ts           # Development data
└── utils.ts               # Utility functions
```

## Role-Based Access

### Page Access:
- **Home**: All roles
- **Sessions**: All roles
- **Attendance**: Organizers (manage), Students (mark)
- **Teacher Attendance**: Teachers only
- **Resources**: All roles
- **Feedback**: All roles
- **AI Assistant**: All roles

### Features by Role:

**Organizer:**
- Create attendance polls with QR codes
- Share attendance with teachers
- View attendance statistics
- Full session management

**Teacher:**
- View shared attendance records
- Download attendance CSV
- Access all session resources
- Provide feedback

**Student:**
- Scan QR codes to mark attendance
- View personal attendance history
- Access session resources
- Rate and review sessions

**Community Member:**
- View session information
- Access public resources
- Use AI assistant
- Provide feedback

## Key Components

### Authentication (`lib/auth.ts`)
```typescript
// Phone OTP for students
await authService.sendOTP(phoneNumber)
await authService.verifyOTP(confirmationResult, otp)

// Email/password for other roles
await authService.signInWithEmail(email, password)
```

### Attendance System (`lib/attendance-service.ts`)
```typescript
// Create attendance window (Organizers)
await attendanceService.shareAttendanceWithTeachers(sessionId, organizerUid, sessionDetails)

// Mark attendance (Students)
await authService.markAttendance(sessionId, studentUid)

// View shared attendance (Teachers)
await attendanceService.getSessionAttendanceRecords(sessionId)
```

### QR Code Flow
1. **Organizer** creates attendance window → generates QR code
2. **Student** scans QR code → marks attendance
3. **Organizer** shares attendance → teachers can view
4. **Teacher** views shared attendance → downloads reports

## Development Features

- **Mock Data**: Pre-populated sessions and resources for development
- **Hardcoded Credentials**: Easy testing with development accounts
- **Local Storage**: Simulates Firebase for development
- **Responsive Design**: Mobile-first with bottom navigation
- **Loading States**: Proper loading indicators throughout
- **Error Handling**: Toast notifications for user feedback

## Styling

- **GDG Brand Colors**: Blue (#4285F4), Red (#EA4335), Green (#34A853), Yellow (#FBBC05)
- **Mobile-First**: Responsive design with mobile bottom navigation
- **shadcn/ui**: Consistent component library
- **Tailwind CSS**: Utility-first styling approach

## Firebase Integration Ready

The app is structured for easy Firebase integration:
- Authentication service abstraction
- Firestore data structure defined
- Environment variables configured
- Mock services for development

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- **Google Developer Groups** for inspiration
- **shadcn/ui** for the beautiful component library
- **Vercel** for the amazing deployment platform
- **Firebase** for backend services
- **Next.js** team for the fantastic framework

## Support

If you have any questions or need help:

- 📧 **Email**: shashankshekhar8534@gmail.com)


