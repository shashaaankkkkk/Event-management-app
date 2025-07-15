"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("organizer")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [eventTitle, setEventTitle] = useState("")
  const [eventDate, setEventDate] = useState("")
  const router = useRouter()

  // Fetch users
  useEffect(() => {
    getDocs(collection(db, "users")).then(snap =>
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )
    getDocs(collection(db, "sessions")).then(snap =>
      setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )
  }, [])

  // Add organizer/teacher
  const handleAddUser = async (e: any) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email,
        role,
      })
      setUsers([...users, { uid: cred.user.uid, email, role }])
      setEmail("")
      setPassword("")
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  // Add event (organizer only)
  const handleAddEvent = async (e: any) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await addDoc(collection(db, "sessions"), {
        title: eventTitle,
        date: eventDate,
      })
      setEvents([...events, { title: eventTitle, date: eventDate }])
      setEventTitle("")
      setEventDate("")
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-gdg-blue">Admin Dashboard</h1>
      <button onClick={() => { signOut(auth); router.push("/admin/login") }} className="mb-4 text-sm text-red-500 underline">Logout</button>

      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <h2 className="font-semibold mb-2">Add Organizer/Teacher</h2>
        <form onSubmit={handleAddUser} className="space-y-2">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" required />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" required />
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full border p-2 rounded">
            <option value="organizer">Organizer</option>
            <option value="teacher">Teacher</option>
          </select>
          <button type="submit" className="w-full bg-gdg-blue text-white py-2 rounded" disabled={loading}>{loading ? "Adding..." : "Add User"}</button>
        </form>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <h2 className="font-semibold mb-2">All Users</h2>
        <ul>
          {users.map(u => (
            <li key={u.uid || u.id} className="mb-1">{u.email} <span className="text-xs text-gray-500">({u.role})</span></li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <h2 className="font-semibold mb-2">Create Event (Organizer Only)</h2>
        <form onSubmit={handleAddEvent} className="space-y-2">
          <input value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="Event Title" className="w-full border p-2 rounded" required />
          <input value={eventDate} onChange={e => setEventDate(e.target.value)} placeholder="Date (YYYY-MM-DD)" className="w-full border p-2 rounded" required />
          <button type="submit" className="w-full bg-gdg-green text-white py-2 rounded" disabled={loading}>{loading ? "Creating..." : "Create Event"}</button>
        </form>
        <ul className="mt-4">
          {events.map(ev => (
            <li key={ev.id || ev.title} className="mb-1">{ev.title} <span className="text-xs text-gray-500">({ev.date})</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
} 