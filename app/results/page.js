'use client'
import { ResultCard } from '../../components/ResultCard'
import { useSearchParams } from 'next/navigation'

const DUMMY_RESULTS = [
  {
    journalist: { name: 'Alex Rivera' },
    outlet: { name: 'Peach State Watch', type: 'Indie News' },
    articles: [
      { id: 1, title: 'Georgia Medicaid Cuts: What You Need to Know', url: '#', published_at: '2024-06-01' },
      { id: 2, title: 'Local Voices on Healthcare Access', url: '#', published_at: '2024-05-28' },
      { id: 3, title: 'Grassroots Response to Policy Changes', url: '#', published_at: '2024-05-20' },
    ],
    sentiment: { label: 'negative', score: 0.2 },
  },
  {
    journalist: { name: 'Jamie Chen' },
    outlet: { name: 'Southern Dispatch', type: 'Substack' },
    articles: [
      { id: 4, title: 'Medicaid in the South: A Reporter\'s Notebook', url: '#', published_at: '2024-05-30' },
      { id: 5, title: 'Interview: Rural Health Advocates', url: '#', published_at: '2024-05-25' },
      { id: 6, title: 'Policy Shifts and Local Clinics', url: '#', published_at: '2024-05-18' },
    ],
    sentiment: { label: 'neutral', score: 0.5 },
  },
  {
    journalist: { name: null },
    outlet: { name: 'Georgia Policy Blog', type: 'Blog' },
    articles: [
      { id: 7, title: 'Understanding Medicaid Waivers', url: '#', published_at: '2024-05-29' },
      { id: 8, title: 'State Budget and Healthcare', url: '#', published_at: '2024-05-22' },
      { id: 9, title: 'Community Voices: Medicaid Stories', url: '#', published_at: '2024-05-15' },
    ],
    sentiment: { label: 'positive', score: 0.8 },
  },
]

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Your Topic'
  const hideMajor = searchParams.get('hideMajor') === '1'

  // In real app, fetch results from Supabase/Edge Function
  const results = DUMMY_RESULTS.filter(r =>
    !hideMajor || (r.outlet.name !== 'Major News Network')
  )

  function exportCSV() {
    const rows = [
      ['Journalist', 'Outlet', 'Type', 'Article Title', 'Published', 'Sentiment'],
      ...results.flatMap(r =>
        r.articles.slice(0, 3).map(a => [
          r.journalist?.name || '',
          r.outlet?.name || '',
          r.outlet?.type || '',
          a.title,
          a.published_at,
          r.sentiment?.label || '',
        ])
      ),
    ]
    const csv = rows.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `signal_scout_results.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-lg mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Search Results
          </h2>
          <p className="text-gray-600 text-lg">
            Results for: <span className="font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-lg">{topic}</span>
          </p>
        </div>

        {/* Stats and Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.length}</div>
              <div className="text-sm text-gray-600">Journalists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {results.reduce((total, r) => total + r.articles.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(results.map(r => r.outlet?.name)).size}
              </div>
              <div className="text-sm text-gray-600">Outlets</div>
            </div>
          </div>
          
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as CSV
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.map((r, i) => (
            <ResultCard
              key={i}
              journalist={r.journalist}
              outlet={r.outlet}
              articles={r.articles}
              sentiment={r.sentiment}
            />
          ))}
        </div>

        {/* No Results Message */}
        {results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
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

