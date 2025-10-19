import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('http://localhost:3001', { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Forward the POST request to the backend server
    const res = await fetch('http://localhost:3001/plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await res.json().catch(async () => {
      // If response is not JSON, return the text response
      const text = await res.text().catch(() => 'Unknown response')
      return { error: text || `HTTP ${res.status}: ${res.statusText}` }
    })
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
