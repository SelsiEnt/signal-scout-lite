'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const recentSearchesKey = 'signalscout_recent_searches'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [hideMajor, setHideMajor] = useState(false)
  const [recent, setRecent] = useState(
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem(recentSearchesKey) || '[]')
      : []
  )

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    // Save to localStorage
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, 5)
    localStorage.setItem(recentSearchesKey, JSON.stringify(updated))
    setRecent(updated)
    router.push(`/results?topic=${encodeURIComponent(query)}&hideMajor=${hideMajor ? 1 : 0}`)
  }

  function handleRecent(q) {
    setQuery(q)
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Search for Niche Coverage
          </h2>
          <p className="text-gray-600 text-lg">Find journalists and outlets covering your specific topics</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder='e.g. "Medicaid cuts Georgia"'
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </form>

        {/* Filter Option */}
        <div className="mb-6">
          <label className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
            <input
              type="checkbox"
              checked={hideMajor}
              onChange={e => setHideMajor(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
            />
            <span className="text-gray-700 font-medium">Hide Major Outlets</span>
            <span className="ml-2 text-sm text-gray-500">(Focus on niche voices)</span>
          </label>
        </div>

        {/* Recent Searches */}
        {recent.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Recent Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recent.map((q, i) => (
                <button
                  key={i}
                  className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  onClick={() => handleRecent(q)}
                  type="button"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Search Tips</h4>
              <p className="text-sm text-gray-600">Try specific topics, locations, or policy areas. The more specific your search, the better the results!</p>
            </div>
          </div>
        </div>

        {/* Sources Management */}
        <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Manage Sources</h4>
                <p className="text-sm text-gray-600">Add RSS feeds and discover Substack publications to expand your search coverage.</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/sources'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Manage Sources
            </button>
          </div>
        </div>

        {/* Donate Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Help us support independent journalism
            </p>
            <button
              onClick={() => alert('Thank you for supporting Signal Scout Lite! Contact us at support@signalscoutlite.com to arrange a donation.')}
              className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Support Independent Journalism
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

