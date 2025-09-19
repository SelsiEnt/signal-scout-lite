'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SubstackLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all') // all, today, this-week
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated')
    const adminEmail = localStorage.getItem('admin_email')
    
    if (authStatus === 'true' && adminEmail === 'selsi21@gmail.com') {
      setIsAuthenticated(true)
      fetchLogs()
    } else {
      router.push('/admin/login')
    }
  }, [router])

  // Fetch search logs from API
  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/substack-logs')
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      } else {
        setError('Failed to fetch search logs')
      }
    } catch (err) {
      setError('Failed to fetch search logs')
    }
    setLoading(false)
  }

  // Clear all logs
  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all search logs? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/substack-logs', {
        method: 'DELETE'
      })
      if (response.ok) {
        setLogs([])
        setMessage('Search logs cleared successfully')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError('Failed to clear logs')
      }
    } catch (err) {
      setError('Failed to clear logs')
    }
  }

  // Filter logs based on time period
  const getFilteredLogs = () => {
    const now = new Date()
    let filteredLogs = logs

    if (filter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      filteredLogs = logs.filter(log => new Date(log.timestamp) >= today)
    } else if (filter === 'this-week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredLogs = logs.filter(log => new Date(log.timestamp) >= weekAgo)
    }

    return filteredLogs
  }

  // Get statistics
  const getStats = () => {
    const filteredLogs = getFilteredLogs()
    const totalSearches = filteredLogs.length
    const uniqueQueries = new Set(filteredLogs.map(log => log.query.toLowerCase().trim())).size
    const avgResults = filteredLogs.length > 0 
      ? (filteredLogs.reduce((sum, log) => sum + log.resultsCount, 0) / filteredLogs.length).toFixed(1)
      : 0

    return { totalSearches, uniqueQueries, avgResults }
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
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
  const filteredLogs = getFilteredLogs()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Substack Search Logs
              </h1>
              <p className="text-gray-600">
                Monitor Substack publication searches from the backend
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={clearLogs}
                disabled={logs.length === 0}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Clear Logs
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.totalSearches}</div>
              <div className="text-sm text-blue-700">Total Searches</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.uniqueQueries}</div>
              <div className="text-sm text-green-700">Unique Queries</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.avgResults}</div>
              <div className="text-sm text-purple-700">Avg Results</div>
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
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
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

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Search History ({filteredLogs.length} entries)
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading search logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No search logs found</p>
              <p className="text-gray-400 text-sm">Search logs will appear here when users search for Substack publications</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Query
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Results
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.query || <span className="text-gray-400 italic">(empty search)</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.resultsCount > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.resultsCount} result{log.resultsCount !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.userAgent || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/dashboard"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg text-center transition-colors"
            >
              Back to Dashboard
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
