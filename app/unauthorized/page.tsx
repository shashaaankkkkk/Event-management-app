export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
        <a href="/" className="text-gdg-blue hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  )
}
