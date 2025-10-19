"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddPlant() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}`
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, try to get text
          try {
            const textResponse = await res.text()
            errorMessage = textResponse || errorMessage
          } catch {
            // If we can't get text either, use the status
            errorMessage = `HTTP ${res.status}: ${res.statusText}`
          }
        }
        throw new Error(errorMessage)
      }

      // Success - redirect to home page
      router.push("/")
    } catch (err: any) {
      console.error("Error adding plant:", err)
      setError(err.message || "Hiba történt a növény hozzáadásakor. Lehet, hogy a backend még nem támogatja ezt a funkciót.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[--background]">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-green-600 hover:underline mb-6 inline-block">&larr; Vissza</Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-green-800 mb-8 text-center">
            Új növény hozzáadása
          </h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Növény neve *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 shadow-sm px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-300 text-slate-900"
                  placeholder="pl. Fikusz, Pozsgás..."
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Típus
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 shadow-sm px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-300 text-slate-900"
                  placeholder="pl. Szobanövény, Külső..."
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Leírás
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 shadow-sm px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-300 text-slate-900 resize-vertical"
                  placeholder="Írjon leírást a növényről..."
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Hozzáadás..." : "Növény hozzáadása"}
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Mégse
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}