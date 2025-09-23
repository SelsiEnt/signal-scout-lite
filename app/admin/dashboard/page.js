'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { searchSubstackPublications, getPopularSubstackPublications } from '../../../lib/substackAPI'

export default function AdminDashboard() {
  const [feeds, setFeeds] = useState([])
  const [newFeed, setNewFeed] = useState({ name: '', url: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [substackPublications, setSubstackPublications] = useState([])
  const [showSubstackSearch, setShowSubstackSearch] = useState(false)
  const [substackQuery, setSubstackQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
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

  // Load existing feeds from localStorage
  const loadFeeds = () => {
    const savedFeeds = localStorage.getItem('rss_feeds')
    if (savedFeeds) {
      setFeeds(JSON.parse(savedFeeds))
    }
  }

  // Load popular Substack publications
  const loadPopularSubstack = async () => {
    setSearchLoading(true)
    try {
      const publications = await getPopularSubstackPublications()
      setSubstackPublications(publications)
    } catch (err) {
      setError('Failed to load Substack publications')
    }
    setSearchLoading(false)
  }

  // Search Substack publications
  const searchSubstack = async (query) => {
    setSearchLoading(true)
    try {
      const publications = await searchSubstackPublications(query)
      setSubstackPublications(publications)
    } catch (err) {
      setError('Failed to search Substack publications')
    }
    setSearchLoading(false)
  }

  // Add Substack publication as RSS feed
  const addSubstackFeed = (publication) => {
    if (isDuplicateFeed(publication.rss_url)) {
      setError('This RSS feed already exists')
      return
    }

    const feedToAdd = {
      id: Date.now(),
      name: publication.name,
      url: publication.rss_url,
      description: publication.description,
      addedAt: new Date().toISOString(),
      source: 'Substack',
      category: publication.category,
      website: publication.url
    }

    const updatedFeeds = [...feeds, feedToAdd]
    setFeeds(updatedFeeds)
    localStorage.setItem('rss_feeds', JSON.stringify(updatedFeeds))
    setMessage(`Successfully added "${publication.name}" from Substack`)
    setShowSubstackSearch(false)
  }

  // Check for duplicate feeds
  const isDuplicateFeed = (url) => {
    return feeds.some(feed => feed.url.toLowerCase() === url.toLowerCase())
  }

  // Validate RSS feed URL
  const isValidRSSUrl = (url) => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  // Add new RSS feed
  const handleAddFeed = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Validation
    if (!newFeed.name.trim() || !newFeed.url.trim()) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (!isValidRSSUrl(newFeed.url)) {
      setError('Please enter a valid URL')
      setLoading(false)
      return
    }

    if (isDuplicateFeed(newFeed.url)) {
      setError('This RSS feed already exists')
      setLoading(false)
      return
    }

    try {
      // Create new feed object
      const feedToAdd = {
        id: Date.now(),
        name: newFeed.name.trim(),
        url: newFeed.url.trim(),
        description: newFeed.description.trim(),
        addedAt: new Date().toISOString(),
        source: 'Substack'
      }

      // Add to feeds array
      const updatedFeeds = [...feeds, feedToAdd]
      setFeeds(updatedFeeds)
      
      // Save to localStorage
      localStorage.setItem('rss_feeds', JSON.stringify(updatedFeeds))
      
      // Reset form
      setNewFeed({ name: '', url: '', description: '' })
      setMessage(`Successfully added "${feedToAdd.name}" RSS feed`)
      
    } catch (err) {
      setError('Failed to add RSS feed. Please try again.')
    }
    
    setLoading(false)
  }

  // Remove RSS feed
  const handleRemoveFeed = (feedId) => {
    const updatedFeeds = feeds.filter(feed => feed.id !== feedId)
    setFeeds(updatedFeeds)
    localStorage.setItem('rss_feeds', JSON.stringify(updatedFeeds))
    setMessage('RSS feed removed successfully')
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                RSS Feed Administration
              </h1>
              <p className="text-gray-600">
                Manage RSS feeds for Signal Scout Lite
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{feeds.length}</div>
              <div className="text-sm text-blue-700">Total RSS Feeds</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {feeds.filter(f => f.source === 'Substack').length}
              </div>
              <div className="text-sm text-green-700">Substack Feeds</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {feeds.filter(f => f.addedAt && new Date(f.addedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-purple-700">Added This Week</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Feed Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add New RSS Feed
            </h2>

            <form onSubmit={handleAddFeed} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Feed Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={newFeed.name}
                  onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., TechCrunch, The Verge"
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  RSS Feed URL *
                </label>
                <input
                  type="url"
                  id="url"
                  value={newFeed.url}
                  onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://example.com/feed.xml"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newFeed.description}
                  onChange={(e) => setNewFeed({ ...newFeed, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Brief description of this RSS feed..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-600 text-sm">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Feed...' : 'Add RSS Feed'}
              </button>
            </form>

            {/* Substack Integration */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Add from Substack
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowSubstackSearch(!showSubstackSearch)
                    if (!showSubstackSearch) {
                      loadPopularSubstack()
                    }
                  }}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  {showSubstackSearch ? 'Hide' : 'Browse'} Popular Substack Publications
                </button>

                {showSubstackSearch && (
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={substackQuery}
                        onChange={(e) => setSubstackQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            searchSubstack(substackQuery)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Search Substack publications..."
                      />
                      <button
                        onClick={() => searchSubstack(substackQuery)}
                        disabled={searchLoading}
                        className="mt-2 w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-200 transition-colors disabled:opacity-50"
                      >
                        {searchLoading ? 'Searching...' : 'Search'}
                      </button>
                    </div>

                    {substackPublications.length > 0 && (
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {substackPublications.map((pub) => (
                          <div key={pub.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{pub.name}</h4>
                                <p className="text-sm text-gray-600 mb-1">{pub.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    {pub.category}
                                  </span>
                                  <span>•</span>
                                  <a 
                                    href={pub.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Visit Site
                                  </a>
                                </div>
                              </div>
                              <button
                                onClick={() => addSubstackFeed(pub)}
                                className="ml-3 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                Add Feed
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Feeds List */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Current RSS Feeds
            </h2>

            {feeds.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-gray-500">No RSS feeds added yet</p>
                <p className="text-gray-400 text-sm">Add your first feed using the form on the left</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {feeds.map((feed) => (
                  <div key={feed.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{feed.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{feed.url}</p>
                        {feed.description && (
                          <p className="text-sm text-gray-500 mb-2">{feed.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {feed.source}
                          </span>
                          <span>
                            Added: {new Date(feed.addedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFeed(feed.id)}
                        className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove feed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <a
              href="/admin/journalist-suggestions"
              className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Journalist Suggestions
            </a>
            <a
              href="/admin/searchable-feeds"
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Searchable Feeds
            </a>
            <a
              href="/admin/rss-feeds"
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              View All Feeds
            </a>
            <a
              href="/admin/substack-logs"
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              View Search Logs
            </a>
            <a
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              View Main Site
            </a>
            <a
              href="/search"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Test Search
            </a>
            <a
              href="/sources"
              className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              View Sources
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
