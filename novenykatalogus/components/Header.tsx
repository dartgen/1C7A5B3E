import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo és cím */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <span className="text-4xl">🌿</span>
            <div>
              <h1 className="text-2xl font-bold">Növénykalauz</h1>
              <p className="text-sm text-green-200">A természet kincsei</p>
            </div>
          </Link>
          
          {/* Navigáció */}
          <nav className="flex gap-6">
            <Link 
              href="/" 
              className="hover:text-green-200 transition-colors font-medium"
            >
              Főoldal
            </Link>
            <Link 
              href="/add-plant"
              className="bg-green-600 hover:bg-green-500 px-6 py-2.5 rounded-lg transition-colors font-medium"
            >
              + Új növény
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
