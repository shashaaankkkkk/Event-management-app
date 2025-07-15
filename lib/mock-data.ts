export interface Session {
  id: string
  title: string
  speaker: string
  time: string
  location: string
  day: string
  track: string
  description: string
}

export interface Resource {
  id: string
  title: string
  sessionTitle: string
  speaker: string
  type: "slides" | "pdf" | "link"
  url: string
  description: string
  day: string
  uploadedAt: Date
}

export const mockSessions: Session[] = [
  {
    id: "1",
    title: "Machine Learning with TensorFlow",
    speaker: "Dr. Sarah Chen",
    time: "9:00 AM - 10:30 AM",
    location: "Main Auditorium",
    day: "Day 1",
    track: "AI/ML",
    description:
      "Dive deep into machine learning fundamentals using TensorFlow. Learn about neural networks, training models, and deploying ML solutions in production environments.",
  },
  {
    id: "2",
    title: "Building Progressive Web Apps",
    speaker: "Alex Rodriguez",
    time: "11:00 AM - 12:30 PM",
    location: "Room A",
    day: "Day 1",
    track: "Web",
    description:
      "Learn how to build fast, reliable, and engaging Progressive Web Apps using modern web technologies and best practices.",
  },
  {
    id: "3",
    title: "Flutter for Cross-Platform Development",
    speaker: "Maria Santos",
    time: "2:00 PM - 3:30 PM",
    location: "Room B",
    day: "Day 1",
    track: "Mobile",
    description:
      "Master Flutter development and create beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
  },
  {
    id: "4",
    title: "Cloud Architecture with Google Cloud",
    speaker: "James Wilson",
    time: "9:00 AM - 10:30 AM",
    location: "Main Auditorium",
    day: "Day 2",
    track: "Cloud",
    description:
      "Explore cloud architecture patterns and best practices using Google Cloud Platform services for scalable applications.",
  },
  {
    id: "5",
    title: "AI Ethics and Responsible Development",
    speaker: "Dr. Priya Patel",
    time: "11:00 AM - 12:30 PM",
    location: "Room A",
    day: "Day 2",
    track: "AI/ML",
    description:
      "Understand the ethical implications of AI development and learn frameworks for building responsible AI systems.",
  },
  {
    id: "6",
    title: "Modern JavaScript and Web APIs",
    speaker: "Tom Anderson",
    time: "2:00 PM - 3:30 PM",
    location: "Room B",
    day: "Day 2",
    track: "Web",
    description:
      "Explore the latest JavaScript features and powerful Web APIs that enable rich, interactive web experiences.",
  },
  {
    id: "7",
    title: "Keynote: The Future of Technology",
    speaker: "Dr. Lisa Chang",
    time: "9:00 AM - 10:00 AM",
    location: "Main Auditorium",
    day: "Day 3",
    track: "Keynote",
    description:
      "Join our keynote speaker as she explores emerging technologies and their potential impact on society and business.",
  },
  {
    id: "8",
    title: "Android Development Best Practices",
    speaker: "Michael Kim",
    time: "10:30 AM - 12:00 PM",
    location: "Room A",
    day: "Day 3",
    track: "Mobile",
    description:
      "Learn advanced Android development techniques, architecture patterns, and performance optimization strategies.",
  },
  {
    id: "9",
    title: "Design Thinking Workshop",
    speaker: "Emma Thompson",
    time: "1:00 PM - 2:30 PM",
    location: "Workshop Room",
    day: "Day 3",
    track: "Design",
    description:
      "Interactive workshop on design thinking methodology and how to apply it to technology product development.",
  },
]

export const mockResources: Resource[] = [
  {
    id: "1",
    title: "TensorFlow ML Slides",
    sessionTitle: "Machine Learning with TensorFlow",
    speaker: "Dr. Sarah Chen",
    type: "slides",
    url: "/resources/tensorflow-ml-slides.pdf",
    description: "Complete slide deck covering TensorFlow basics, neural networks, and practical examples.",
    day: "Day 1",
    uploadedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "ML Code Examples",
    sessionTitle: "Machine Learning with TensorFlow",
    speaker: "Dr. Sarah Chen",
    type: "link",
    url: "https://github.com/gdg-ml-examples",
    description: "GitHub repository with all code examples and exercises from the ML workshop.",
    day: "Day 1",
    uploadedAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    title: "PWA Development Guide",
    sessionTitle: "Building Progressive Web Apps",
    speaker: "Alex Rodriguez",
    type: "pdf",
    url: "/resources/pwa-guide.pdf",
    description: "Comprehensive guide to Progressive Web App development with practical examples.",
    day: "Day 1",
    uploadedAt: new Date("2024-01-15"),
  },
  {
    id: "4",
    title: "Flutter Starter Project",
    sessionTitle: "Flutter for Cross-Platform Development",
    speaker: "Maria Santos",
    type: "link",
    url: "https://github.com/gdg-flutter-starter",
    description: "Complete Flutter starter project with examples of common UI patterns and state management.",
    day: "Day 1",
    uploadedAt: new Date("2024-01-15"),
  },
  {
    id: "5",
    title: "Cloud Architecture Diagrams",
    sessionTitle: "Cloud Architecture with Google Cloud",
    speaker: "James Wilson",
    type: "slides",
    url: "/resources/cloud-architecture-slides.pdf",
    description: "Architecture diagrams and best practices for Google Cloud Platform.",
    day: "Day 2",
    uploadedAt: new Date("2024-01-16"),
  },
  {
    id: "6",
    title: "AI Ethics Framework",
    sessionTitle: "AI Ethics and Responsible Development",
    speaker: "Dr. Priya Patel",
    type: "pdf",
    url: "/resources/ai-ethics-framework.pdf",
    description: "Framework and guidelines for ethical AI development and deployment.",
    day: "Day 2",
    uploadedAt: new Date("2024-01-16"),
  },
  {
    id: "7",
    title: "JavaScript API Reference",
    sessionTitle: "Modern JavaScript and Web APIs",
    speaker: "Tom Anderson",
    type: "link",
    url: "https://developer.mozilla.org/en-US/docs/Web/API",
    description: "Comprehensive reference for modern Web APIs and JavaScript features.",
    day: "Day 2",
    uploadedAt: new Date("2024-01-16"),
  },
  {
    id: "8",
    title: "Android Best Practices Checklist",
    sessionTitle: "Android Development Best Practices",
    speaker: "Michael Kim",
    type: "pdf",
    url: "/resources/android-best-practices.pdf",
    description: "Checklist and guidelines for Android development best practices.",
    day: "Day 3",
    uploadedAt: new Date("2024-01-17"),
  },
]
