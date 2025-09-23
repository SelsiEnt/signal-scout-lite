'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function JournalistSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated')
    const adminEmail = localStorage.getItem('admin_email')
    
    if (authStatus === 'true' && adminEmail === 'selsi21@gmail.com') {
      setIsAuthenticated(true)
      loadSuggestions()
    } else {
      router.push('/admin/login')
    }
  }, [router])

  // Load suggestions from localStorage
  const loadSuggestions = () => {
    setLoading(true)
    try {
      const savedSuggestions = localStorage.getItem('journalist_suggestions')
      if (savedSuggestions) {
        setSuggestions(JSON.parse(savedSuggestions))
      } else {
        setSuggestions([])
      }
    } catch (err) {
      setError('Failed to load suggestions')
    }
    setLoading(false)
  }

  // Update suggestion status
  const updateSuggestionStatus = (suggestionId, status, notes = '') => {
    try {
      const updatedSuggestions = suggestions.map(suggestion => {
        if (suggestion.id === suggestionId) {
          return {
            ...suggestion,
            status,
            reviewedAt: new Date().toISOString(),
            reviewerNotes: notes
          }
        }
        return suggestion
      })
      
      setSuggestions(updatedSuggestions)
      localStorage.setItem('journalist_suggestions', JSON.stringify(updatedSuggestions))
      
      const statusText = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'marked as pending'
      setMessage(`Suggestion ${statusText} successfully`)
      setTimeout(() => setMessage(''), 3000)
      
    } catch (err) {
      setError('Failed to update suggestion')
    }
  }

  // Add approved suggestion to RSS feeds
  const addToRSSFeeds = (suggestion) => {
    try {
      const savedFeeds = localStorage.getItem('rss_feeds')
      const feeds = savedFeeds ? JSON.parse(savedFeeds) : []
      
      const newFeed = {
        id: Date.now(),
        name: suggestion.journalistName,
        url: `${suggestion.substackUrl}/feed`,
        description: suggestion.description,
        addedAt: new Date().toISOString(),
        source: 'Substack',
        category: 'User Suggested',
        suggestedBy: suggestion.yourName || 'Anonymous',
        suggestionId: suggestion.id
      }
      
      feeds.push(newFeed)
      localStorage.setItem('rss_feeds', JSON.stringify(feeds))
      
      // Update suggestion status
      updateSuggestionStatus(suggestion.id, 'approved', 'Added to RSS feeds')
      setMessage(`Added "${suggestion.journalistName}" to RSS feeds`)
      setTimeout(() => setMessage(''), 3000)
      
    } catch (err) {
      setError('Failed to add to RSS feeds')
    }
  }

  // Filter suggestions
  const getFilteredSuggestions = () => {
    if (filter === 'all') return suggestions
    return suggestions.filter(s => s.status === filter)
  }

  // Get statistics
  const getStats = () => {
    const total = suggestions.length
    const pending = suggestions.filter(s => s.status === 'pending' || !s.status).length
    const approved = suggestions.filter(s => s.status === 'approved').length
    const rejected = suggestions.filter(s => s.status === 'rejected').length

    return { total, pending, approved, rejected }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_email')
    router.push('/admin/login')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const stats = getStats()
  const filteredSuggestions = getFilteredSuggestions()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Journalist Suggestions
              </h1>
              <p className="text-gray-600">
                Review and manage journalist suggestions from users
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadSuggestions}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-700">Total Suggestions</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-yellow-700">Pending Review</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-green-700">Approved</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Suggestions</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        )}

        {/* Suggestions List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Suggestions ({filteredSuggestions.length} entries)
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading suggestions...</p>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-gray-500">No suggestions found</p>
              <p className="text-gray-400 text-sm">
                {suggestions.length === 0 
                  ? 'No journalist suggestions have been submitted yet'
                  : 'No suggestions match the current filter criteria'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{suggestion.journalistName}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          suggestion.status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : suggestion.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {suggestion.status || 'pending'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 font-mono text-sm">{suggestion.substackUrl}</p>
                      
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">Description:</h4>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        
                        {suggestion.whyImportant && (
                          <>
                            <h4 className="font-medium text-gray-900 mb-1">Why Important:</h4>
                            <p className="text-sm text-gray-600 mb-2">{suggestion.whyImportant}</p>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span>Submitted: {formatDate(suggestion.submittedAt)}</span>
                        {suggestion.yourName && <span>• By: {suggestion.yourName}</span>}
                        {suggestion.yourAffiliation && <span>• {suggestion.yourAffiliation}</span>}
                      </div>

                      {suggestion.reviewerNotes && (
                        <div className="bg-gray-50 rounded p-3 mb-3">
                          <h4 className="font-medium text-gray-900 mb-1">Reviewer Notes:</h4>
                          <p className="text-sm text-gray-600">{suggestion.reviewerNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <a
                        href={suggestion.substackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Substack"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      
                      {suggestion.status !== 'approved' && (
                        <button
                          onClick={() => addToRSSFeeds(suggestion)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Approve & Add to RSS Feeds"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      
                      {suggestion.status !== 'rejected' && (
                        <button
                          onClick={() => updateSuggestionStatus(suggestion.id, 'rejected', 'Not suitable for inclusion')}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Reject Suggestion"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <a
              href="/admin/dashboard"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Back to Dashboard
            </a>
            <a
              href="/admin/rss-feeds"
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              View RSS Feeds
            </a>
            <a
              href="/admin/searchable-feeds"
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Searchable Feeds
            </a>
            <a
              href="/suggest-journalist"
              className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Suggest Journalist Page
            </a>
            <a
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Main Site
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
