"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"

export default function EventsPage() {
  const [role, setRole] = useState<"organizer" | "student">("student")
  const [sessions, setSessions] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [desc, setDesc] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDetails, setShowDetails] = useState<any | null>(null)

  // Fetch sessions
  useEffect(() => {
    getDocs(collection(db, "sessions")).then(snap =>
      setSessions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )
  }, [])

  // Add session
  const handleAdd = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const docRef = await addDoc(collection(db, "sessions"), { title, date, desc })
      setSessions([...sessions, { id: docRef.id, title, date, desc }])
      setTitle("")
      setDate("")
      setDesc("")
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  // Delete session
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "sessions", id))
    setSessions(sessions.filter(e => e.id !== id))
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-gdg-blue">Sessions</h1>
      {/* Role Toggle */}
      <div className="flex justify-center mb-6 gap-2">
        <button
          className={`px-4 py-2 rounded-l-full border ${role === "organizer" ? "bg-gdg-blue text-white" : "bg-white text-gdg-blue"}`}
          onClick={() => setRole("organizer")}
        >Organizer</button>
        <button
          className={`px-4 py-2 rounded-r-full border ${role === "student" ? "bg-gdg-green text-white" : "bg-white text-gdg-green"}`}
          onClick={() => setRole("student")}
        >Student</button>
      </div>

      {/* Organizer: Add Session */}
      {role === "organizer" && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-4 mb-6 space-y-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Session Title" className="w-full border p-2 rounded" required />
          <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date (YYYY-MM-DD)" className="w-full border p-2 rounded" required />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full border p-2 rounded" rows={2} />
          <button type="submit" className="w-full bg-gdg-blue text-white py-2 rounded" disabled={loading}>{loading ? "Adding..." : "Add Session"}</button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      )}

      {/* List Sessions */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">All Sessions</h2>
        <ul>
          {sessions.map(ev => (
            <li key={ev.id} className="mb-2 flex items-center justify-between">
              <span>
                <span className="font-semibold">{ev.title}</span> <span className="text-xs text-gray-500">({ev.date})</span>
              </span>
              <div className="flex gap-2">
                <button
                  className="text-xs text-blue-500 underline"
                  onClick={() => setShowDetails(ev)}
                >Details</button>
                {role === "organizer" && (
                  <button onClick={() => handleDelete(ev.id)} className="text-xs text-red-500 underline ml-2">Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Session Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowDetails(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs animate-fade-in-up">
            <h2 className="text-xl font-bold mb-2 text-gdg-blue">{showDetails.title}</h2>
            <div className="text-sm text-gray-600 mb-2">{showDetails.date}</div>
            <div className="mb-4 text-gray-800 whitespace-pre-line">{showDetails.desc || "No description."}</div>
            <button onClick={() => setShowDetails(null)} className="w-full bg-gdg-blue text-white py-2 rounded font-semibold mt-2">Close</button>
          </div>
        </div>
      )}
    </div>
  )
} 