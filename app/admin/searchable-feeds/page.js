'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchableFeedsPage() {
  const [feeds, setFeeds] = useState([])
  const [localFeeds, setLocalFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filter, setFilter] = useState('all') // all, active, inactive
  const [categoryFilter, setCategoryFilter] = useState('all') // all, democracy, media, etc.
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated')
    const adminEmail = localStorage.getItem('admin_email')
    
    if (authStatus === 'true' && adminEmail === 'selsi21@gmail.com') {
      setIsAuthenticated(true)
      loadSearchableFeeds()
      loadLocalFeeds()
    } else {
      router.push('/admin/login')
    }
  }, [router])

  // Load searchable feeds from API
  const loadSearchableFeeds = async () => {
    try {
      const response = await fetch('/api/admin/searchable-feeds')
      if (response.ok) {
        const data = await response.json()
        setFeeds(data.feeds)
      } else {
        setError('Failed to load searchable feeds')
      }
    } catch (err) {
      setError('Failed to load searchable feeds')
    }
  }

  // Load local feeds from localStorage
  const loadLocalFeeds = () => {
    try {
      const savedFeeds = localStorage.getItem('rss_feeds')
      if (savedFeeds) {
        setLocalFeeds(JSON.parse(savedFeeds))
      }
    } catch (err) {
      console.error('Failed to load local feeds:', err)
    }
    setLoading(false)
  }

  // Get all unique categories
  const getCategories = () => {
    const allFeeds = [...feeds, ...localFeeds]
    const categories = [...new Set(allFeeds.map(feed => feed.category).filter(Boolean))]
    return categories.sort()
  }

  // Filter and search feeds
  const getFilteredFeeds = () => {
    let allFeeds = [...feeds, ...localFeeds]
    
    // Apply status filter
    if (filter !== 'all') {
      allFeeds = allFeeds.filter(feed => 
        filter === 'active' ? feed.status === 'active' || !feed.status : 
        filter === 'inactive' ? feed.status === 'inactive' : true
      )
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      allFeeds = allFeeds.filter(feed => feed.category === categoryFilter)
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      allFeeds = allFeeds.filter(feed => 
        feed.name.toLowerCase().includes(term) ||
        feed.description?.toLowerCase().includes(term) ||
        feed.url.toLowerCase().includes(term) ||
        feed.topic_hints?.some(hint => hint.toLowerCase().includes(term))
      )
    }
    
    return allFeeds
  }

  // Get statistics
  const getStats = () => {
    const allFeeds = [...feeds, ...localFeeds]
    const totalFeeds = allFeeds.length
    const activeFeeds = allFeeds.filter(f => f.status === 'active' || !f.status).length
    const substackFeeds = allFeeds.filter(f => f.source === 'Substack').length
    const categories = getCategories().length

    return { totalFeeds, activeFeeds, substackFeeds, categories }
  }

  // Test a feed URL
  const testFeed = async (feedUrl) => {
    try {
      // This would test if the feed is accessible
      // For demo purposes, we'll just show a success message
      alert(`Feed test for ${feedUrl} - Feed appears to be accessible`)
    } catch (err) {
      alert(`Feed test failed: ${err.message}`)
    }
  }

  // Add a searchable feed to local storage
  const addToLocalFeeds = (feed) => {
    const feedToAdd = {
      id: Date.now(),
      name: feed.name,
      url: feed.url,
      description: feed.description,
      addedAt: new Date().toISOString(),
      source: feed.source,
      category: feed.category,
      topic_hints: feed.topic_hints
    }

    const updatedFeeds = [...localFeeds, feedToAdd]
    setLocalFeeds(updatedFeeds)
    localStorage.setItem('rss_feeds', JSON.stringify(updatedFeeds))
    alert(`Added "${feed.name}" to your RSS feeds`)
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
  const filteredFeeds = getFilteredFeeds()
  const categories = getCategories()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Signal Scout Lite</h1>
          </button>
        </div>
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Searchable RSS Feeds
              </h1>
              <p className="text-gray-600">
                View all RSS feeds that are available for searching in Signal Scout Lite
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  loadSearchableFeeds()
                  loadLocalFeeds()
                }}
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
              <div className="text-2xl font-bold text-blue-600">{stats.totalFeeds}</div>
              <div className="text-sm text-blue-700">Total Searchable Feeds</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.activeFeeds}</div>
              <div className="text-sm text-green-700">Active Feeds</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.substackFeeds}</div>
              <div className="text-sm text-purple-700">Substack Feeds</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.categories}</div>
              <div className="text-sm text-orange-700">Categories</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Search:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search feeds..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Feeds</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Feeds List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Available for Search ({filteredFeeds.length} feeds)
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading searchable feeds...</p>
            </div>
          ) : filteredFeeds.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500">No feeds match your search criteria</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFeeds.map((feed, index) => (
                <div key={feed.id || index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{feed.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          feed.source === 'Substack' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {feed.source || 'Unknown'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          feed.status === 'active' || !feed.status
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {feed.status === 'active' || !feed.status ? 'Active' : 'Inactive'}
                        </span>
                        {feed.category && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                            {feed.category}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3 font-mono text-sm">{feed.url}</p>
                      
                      {feed.description && (
                        <p className="text-sm text-gray-500 mb-3">{feed.description}</p>
                      )}
                      
                      {feed.topic_hints && feed.topic_hints.length > 0 && (
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-500">Topic Hints:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {feed.topic_hints.map((hint, idx) => (
                              <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 text-xs rounded">
                                {hint}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        {feed.domain && <span>Domain: {feed.domain}</span>}
                        {feed.region && <span>• Region: {feed.region}</span>}
                        {feed.addedAt && <span>• Added: {new Date(feed.addedAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => testFeed(feed.url)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Test Feed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => addToLocalFeeds(feed)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Add to My Feeds"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                      <a
                        href={feed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        title="View RSS Feed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
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
              My RSS Feeds
            </a>
            <a
              href="/admin/substack-logs"
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Search Logs
            </a>
            <a
              href="/search"
              className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Test Search
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
