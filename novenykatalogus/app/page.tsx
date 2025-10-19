"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Plant = {
  name: string
  type?: string
  description?: string
}

export default function Home() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

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
        setPlants(normalized)
      } catch (err: any) {
        console.error("Hiba a backend lekérésekor:", err)
        setError(err?.message || String(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="bg-[--background]">
  <section className="hero pt-8 pb-16 min-h-[30vh] flex items-center justify-center">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="w-full max-w-3xl text-center flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 leading-tight">
              növénykalauz
            </h1>

            <div className="mt-6 flex gap-3 justify-center">
              <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 mx-auto">
                <input
                  aria-label="Keresés növények között"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Keresés: például 'fikusz', 'pozsgás'..."
                  className="w-full rounded-lg border border-gray-200 shadow-sm px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-300 text-slate-900 placeholder-slate-600"
                />
              </div>
              <div className="hidden sm:block">
                <button
                  onClick={() => setQuery("")}
                  className="px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-500"
                >
                  Törlés
                </button>
              </div>
            </div>

          
          </div>
        </div>
      </section>

  <main className="container mx-auto px-4 pt-32 pb-10 flex flex-col items-center ">
        {loading ? (
          <p className="text-gray-600">Betöltés…</p>
        ) : error ? (
          <div className="text-red-600">Hiba: {error}</div>
        ) : (
          <>
            <div className="w-full max-w-6xl mx-auto flex justify-center mt-20 sm:mt-28 md:mt-32">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto justify-items-center">
                {plants.filter(p => (
                  p.name.toLowerCase().includes(query.toLowerCase()) ||
                  (p.type || '').toLowerCase().includes(query.toLowerCase()) ||
                  (p.description || '').toLowerCase().includes(query.toLowerCase())
                )).map((p, idx) => (
                  <Link key={idx} href={`/plants/${idx}`} className="block">
                    <article
                      className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:scale-[1.01] transition-transform mx-auto"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center text-2xl">🌿</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-green-800 truncate">{p.name}</h3>
                          {p.type && <div className="text-xs text-gray-500 italic">{p.type}</div>}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-700 line-clamp-4 readable">{p.description}</p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
