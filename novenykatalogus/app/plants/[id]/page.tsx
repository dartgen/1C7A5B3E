"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

type Plant = {
  name: string
  type?: string
  description?: string
}

export default function PlantDetail() {
  const params = useParams()
  const id = params.id as string
  const [plant, setPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/plants", { cache: "no-store" })
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`)
        }
        const data = await res.json()
        const list = Array.isArray(data) ? data : data?.plants || data?.items || []
        const normalized = list.map((it: any) => ({
          name: it?.name || it?.név || "Ismeretlen",
          type: it?.type || it?.típus || "",
          description: it?.description || it?.leírás || ""
        }))
        const idx = parseInt(id)
        if (isNaN(idx) || idx < 0 || idx >= normalized.length) {
          throw new Error("Növény nem található")
        }
        setPlant(normalized[idx])
      } catch (err: any) {
        console.error("Hiba a backend lekérésekor:", err)
        setError(err?.message || String(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[--background] flex items-center justify-center">
        <p className="text-gray-600">Betöltés…</p>
      </div>
    )
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-[--background] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Hiba: {error || "Növény nem található"}</div>
          <Link href="/" className="text-green-600 hover:underline">Vissza a főoldalra</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--background]">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-green-600 hover:underline mb-6 inline-block">&larr; Vissza</Link>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={`https://picsum.photos/600/400?random=${id}`}
                alt={plant.name}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4">
                {plant.name}
              </h1>
              {plant.type && (
                <div className="text-lg text-gray-600 italic mb-4">
                  Típus: {plant.type}
                </div>
              )}
              <div className="text-gray-700 leading-relaxed">
                {plant.description || "Nincs leírás elérhető."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}