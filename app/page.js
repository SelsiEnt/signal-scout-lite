'use client'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  async function signInWithGoogle() {
    setLoading(true)
    setError('Supabase not configured. Please use Demo Mode.')
    setLoading(false)
  }

  async function signInWithEmail(e) {
    e.preventDefault()
    setLoading(true)
    setError('Supabase not configured. Please use Demo Mode.')
    setLoading(false)
  }

  function demoMode() {
    router.push('/search?demo=1')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-10 border border-gray-200">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Signal Scout Lite
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">Find Niche Voices. Connect Where It Matters.</p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700">Smart Search</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700">Analytics</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700">Export Data</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700">Fast Results</div>
          </div>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mb-4 hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <form onSubmit={signInWithEmail} className="mb-6">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-4 focus:border-blue-500 focus:outline-none transition-colors"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium flex items-center justify-center gap-2"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {loading ? 'Sending magic link...' : 'Sign in with Email'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </div>
        )}

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">or</span>
          </div>
        </div>

        <button
          onClick={demoMode}
          className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Try Demo Mode
        </button>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>No account required • Start exploring immediately</p>
        </div>
      </div>
    </main>
  )
}

