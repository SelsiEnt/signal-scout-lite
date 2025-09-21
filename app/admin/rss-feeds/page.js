'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RSSFeedsPage() {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filter, setFilter] = useState('all') // all, substack, manual
  const [sortBy, setSortBy] = useState('name') // name, date, source
  const [sortOrder, setSortOrder] = useState('asc') // asc, desc
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated')
    const adminEmail = localStorage.getItem('admin_email')
    
    if (authStatus === 'true' && adminEmail === 'selsi21@gmail.com') {
      setIsAuthenticated(true)
      loadFeeds()
    } else {
      router.push('/admin/login')
    }
  }, [router])

  // Load feeds from localStorage
  const loadFeeds = () => {
    setLoading(true)
    try {
      const savedFeeds = localStorage.getItem('rss_feeds')
      if (savedFeeds) {
        setFeeds(JSON.parse(savedFeeds))
      } else {
        setFeeds([])
      }
    } catch (err) {
      setError('Failed to load RSS feeds')
    }
    setLoading(false)
  }

  // Delete a feed
  const deleteFeed = (feedId) => {
    if (!confirm('Are you sure you want to delete this RSS feed?')) {
      return
    }

    try {
      const updatedFeeds = feeds.filter(feed => feed.id !== feedId)
      setFeeds(updatedFeeds)
      localStorage.setItem('rss_feeds', JSON.stringify(updatedFeeds))
      setMessage('RSS feed deleted successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError('Failed to delete RSS feed')
    }
  }

  // Export feeds to CSV
  const exportFeeds = () => {
    const csvData = [
      ['Name', 'URL', 'Description', 'Source', 'Category', 'Added Date'],
      ...feeds.map(feed => [
        feed.name,
        feed.url,
        feed.description || '',
        feed.source || '',
        feed.category || '',
        new Date(feed.addedAt).toLocaleDateString()
      ])
    ]
    
    const csv = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rss_feeds_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Clear all feeds
  const clearAllFeeds = () => {
    if (!confirm('Are you sure you want to delete ALL RSS feeds? This action cannot be undone.')) {
      return
    }

    try {
      setFeeds([])
      localStorage.removeItem('rss_feeds')
      setMessage('All RSS feeds deleted successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError('Failed to clear RSS feeds')
    }
  }

  // Filter and sort feeds
  const getFilteredAndSortedFeeds = () => {
    let filteredFeeds = feeds

    // Apply filter
    if (filter !== 'all') {
      filteredFeeds = feeds.filter(feed => 
        filter === 'substack' ? feed.source === 'Substack' : 
        filter === 'manual' ? feed.source !== 'Substack' : true
      )
    }

    // Apply sorting
    filteredFeeds.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'date':
          aValue = new Date(a.addedAt)
          bValue = new Date(b.addedAt)
          break
        case 'source':
          aValue = (a.source || '').toLowerCase()
          bValue = (b.source || '').toLowerCase()
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filteredFeeds
  }

  // Get statistics
  const getStats = () => {
    const totalFeeds = feeds.length
    const substackFeeds = feeds.filter(f => f.source === 'Substack').length
    const manualFeeds = feeds.filter(f => f.source !== 'Substack').length
    const categories = [...new Set(feeds.map(f => f.category).filter(Boolean))].length

    return { totalFeeds, substackFeeds, manualFeeds, categories }
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
  const filteredFeeds = getFilteredAndSortedFeeds()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                RSS Feeds Directory
              </h1>
              <p className="text-gray-600">
                View and manage all RSS feeds in Signal Scout Lite
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={exportFeeds}
                disabled={feeds.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Export CSV
              </button>
              <button
                onClick={loadFeeds}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={clearAllFeeds}
                disabled={feeds.length === 0}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Clear All
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
              <div className="text-sm text-blue-700">Total Feeds</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.substackFeeds}</div>
              <div className="text-sm text-purple-700">Substack Feeds</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.manualFeeds}</div>
              <div className="text-sm text-green-700">Manual Feeds</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.categories}</div>
              <div className="text-sm text-orange-700">Categories</div>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Feeds</option>
                <option value="substack">Substack Only</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="date">Date Added</option>
                <option value="source">Source</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Order:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
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

        {/* Feeds List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              RSS Feeds ({filteredFeeds.length} of {feeds.length} feeds)
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading RSS feeds...</p>
            </div>
          ) : filteredFeeds.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-500">No RSS feeds found</p>
              <p className="text-gray-400 text-sm">
                {feeds.length === 0 
                  ? 'Add your first RSS feed from the admin dashboard'
                  : 'No feeds match the current filter criteria'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFeeds.map((feed) => (
                <div key={feed.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{feed.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          feed.source === 'Substack' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {feed.source || 'Manual'}
                        </span>
                        {feed.category && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                            {feed.category}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{feed.url}</p>
                      
                      {feed.description && (
                        <p className="text-sm text-gray-500 mb-3">{feed.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Added: {formatDate(feed.addedAt)}</span>
                        {feed.website && (
                          <>
                            <span>•</span>
                            <a 
                              href={feed.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit Website
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <a
                        href={feed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View RSS Feed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <button
                        onClick={() => deleteFeed(feed.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Feed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="/admin/dashboard"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Back to Dashboard
            </a>
            <a
              href="/admin/substack-logs"
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              View Search Logs
            </a>
            <a
              href="/admin/login"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Admin Login
            </a>
            <a
              href="/"
              className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              View Main Site
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
