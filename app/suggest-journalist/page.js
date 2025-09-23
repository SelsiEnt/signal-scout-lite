'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SuggestJournalistPage() {
  const [formData, setFormData] = useState({
    journalistName: '',
    substackUrl: '',
    description: '',
    whyImportant: '',
    yourName: '',
    yourEmail: '',
    yourAffiliation: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Validate required fields
      if (!formData.journalistName || !formData.substackUrl || !formData.description) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Validate URL
      try {
        new URL(formData.substackUrl)
      } catch {
        setError('Please enter a valid Substack URL')
        setLoading(false)
        return
      }

      // Store suggestion in localStorage (in production, this would go to a database)
      const suggestions = JSON.parse(localStorage.getItem('journalist_suggestions') || '[]')
      const newSuggestion = {
        id: Date.now(),
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      }
      
      suggestions.push(newSuggestion)
      localStorage.setItem('journalist_suggestions', JSON.stringify(suggestions))
      
      setMessage('Thank you for your suggestion! We\'ll review it and consider adding this journalist to our database.')
      setFormData({
        journalistName: '',
        substackUrl: '',
        description: '',
        whyImportant: '',
        yourName: '',
        yourEmail: '',
        yourAffiliation: ''
      })
      
    } catch (err) {
      setError('Failed to submit suggestion. Please try again.')
    }
    
    setLoading(false)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Suggest a Journalist
            </h1>
            <p className="text-gray-600">
              Help us discover and highlight independent journalists on Substack who deserve recognition
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Our Mission</h2>
            <p className="text-blue-800 text-sm leading-relaxed">
              Signal Scout Lite is dedicated to amplifying independent voices and helping readers discover 
              quality journalism from independent journalists and outlets. Your suggestions help us build 
              a more diverse and comprehensive database of voices that deserve to be heard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="journalistName" className="block text-sm font-medium text-gray-700 mb-2">
                  Journalist Name *
                </label>
                <input
                  type="text"
                  id="journalistName"
                  name="journalistName"
                  value={formData.journalistName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Sarah Johnson"
                />
              </div>

              <div>
                <label htmlFor="substackUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Substack URL *
                </label>
                <input
                  type="url"
                  id="substackUrl"
                  name="substackUrl"
                  value={formData.substackUrl}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://sarahjohnson.substack.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="What does this journalist cover? What makes their work unique?"
              />
            </div>

            <div>
              <label htmlFor="whyImportant" className="block text-sm font-medium text-gray-700 mb-2">
                Why Should We Include Them?
              </label>
              <textarea
                id="whyImportant"
                name="whyImportant"
                value={formData.whyImportant}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Why do you think this journalist deserves to be featured? What impact do they have?"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Information (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="yourName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="yourName"
                    name="yourName"
                    value={formData.yourName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your name (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="yourEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="yourEmail"
                    name="yourEmail"
                    value={formData.yourEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your@email.com (optional)"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="yourAffiliation" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Affiliation
                </label>
                <input
                  type="text"
                  id="yourAffiliation"
                  name="yourAffiliation"
                  value={formData.yourAffiliation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Journalist, Reader, Academic (optional)"
                />
              </div>
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

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Suggestion'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              All suggestions are reviewed by our team. We appreciate your help in building a better media ecosystem.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
