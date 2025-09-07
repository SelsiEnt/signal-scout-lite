'use client'
import { useState, useEffect } from 'react'

export default function SourcesPage() {
  const [activeTab, setActiveTab] = useState('rss')
  const [rssFeeds, setRssFeeds] = useState([])
  const [substackSources, setSubstackSources] = useState([])
  const [newRssUrl, setNewRssUrl] = useState('')
  const [substackQuery, setSubstackQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Load saved feeds from localStorage
  useEffect(() => {
    const savedRssFeeds = JSON.parse(localStorage.getItem('rssFeeds') || '[]')
    const savedSubstackSources = JSON.parse(localStorage.getItem('substackSources') || '[]')
    setRssFeeds(savedRssFeeds)
    setSubstackSources(savedSubstackSources)
  }, [])

  const addRssFeed = async () => {
    if (!newRssUrl.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/feeds/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ singleUrl: newRssUrl })
      })
      
      const result = await response.json()
      
      if (result.success) {
        const newFeed = {
          id: Date.now(),
          url: newRssUrl,
          title: result.data.title,
          description: result.data.description,
          link: result.data.link,
          addedAt: new Date().toISOString()
        }
        
        const updatedFeeds = [...rssFeeds, newFeed]
        setRssFeeds(updatedFeeds)
        localStorage.setItem('rssFeeds', JSON.stringify(updatedFeeds))
        setNewRssUrl('')
      } else {
        alert('Failed to add RSS feed: ' + result.error)
      }
    } catch (error) {
      alert('Error adding RSS feed: ' + error.message)
    }
    setLoading(false)
  }

  const removeRssFeed = (id) => {
    const updatedFeeds = rssFeeds.filter(feed => feed.id !== id)
    setRssFeeds(updatedFeeds)
    localStorage.setItem('rssFeeds', JSON.stringify(updatedFeeds))
  }

  const searchSubstack = async () => {
    if (!substackQuery.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/substack/search?q=${encodeURIComponent(substackQuery)}`)
      const result = await response.json()
      
      if (result.success) {
        // For demo, we'll just show the results
        console.log('Substack search results:', result.data)
        alert(`Found ${result.data.length} Substack publications for "${substackQuery}"`)
      }
    } catch (error) {
      alert('Error searching Substack: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Manage Sources
          </h1>
          <p className="text-gray-600 text-lg">Add RSS feeds and discover Substack publications</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('rss')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'rss'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            RSS Feeds
          </button>
          <button
            onClick={() => setActiveTab('substack')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'substack'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Substack Publications
          </button>
        </div>

        {/* RSS Feeds Tab */}
        {activeTab === 'rss' && (
          <div>
            {/* Add RSS Feed */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add RSS Feed</h3>
              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="Enter RSS feed URL (e.g., https://example.com/feed.xml)"
                  className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  value={newRssUrl}
                  onChange={(e) => setNewRssUrl(e.target.value)}
                />
                <button
                  onClick={addRssFeed}
                  disabled={loading || !newRssUrl.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Feed'}
                </button>
              </div>
            </div>

            {/* Example RSS Feeds */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular RSS Feeds</h3>
              <p className="text-sm text-gray-600 mb-4">Click to add these popular RSS feeds:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: "TechCrunch", url: "https://techcrunch.com/feed/", description: "Technology news and startup coverage" },
                  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", description: "Technology, science, art, and culture" },
                  { name: "BBC News", url: "http://feeds.bbci.co.uk/news/rss.xml", description: "Latest news from BBC" },
                  { name: "Reuters", url: "https://feeds.reuters.com/reuters/topNews", description: "Breaking news and top stories" },
                  { name: "NPR News", url: "https://feeds.npr.org/1001/rss.xml", description: "National Public Radio news" },
                  { name: "Wired", url: "https://www.wired.com/feed/rss", description: "Technology, business, and culture" }
                ].map((feed, index) => (
                  <button
                    key={index}
                    onClick={() => setNewRssUrl(feed.url)}
                    className="text-left bg-white border border-blue-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="font-medium text-gray-800">{feed.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{feed.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* RSS Feeds List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your RSS Feeds ({rssFeeds.length})
              </h3>
              {rssFeeds.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <p>No RSS feeds added yet. Add your first feed above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rssFeeds.map((feed) => (
                    <div key={feed.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{feed.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{feed.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Added: {new Date(feed.addedAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => removeRssFeed(feed.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Substack Tab */}
        {activeTab === 'substack' && (
          <div>
            {/* Search Substack */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Substack Publications</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search for topics, authors, or publications..."
                  className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  value={substackQuery}
                  onChange={(e) => setSubstackQuery(e.target.value)}
                />
                <button
                  onClick={searchSubstack}
                  disabled={loading || !substackQuery.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Popular Substack Publications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Substack Publications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "The Dispatch", description: "Conservative news and analysis", category: "Politics" },
                  { name: "Platformer", description: "Tech industry news and analysis", category: "Technology" },
                  { name: "The Atlantic", description: "Long-form journalism and analysis", category: "News" },
                  { name: "The Bulwark", description: "Conservative commentary and analysis", category: "Politics" }
                ].map((pub, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800">{pub.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{pub.description}</p>
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium mt-2">
                      {pub.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back to Search */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </button>
        </div>
      </div>
    </main>
  )
}
