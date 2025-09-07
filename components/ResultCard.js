import React from 'react'

const sentimentColors = {
  positive: 'bg-green-100 text-green-800 border-green-200',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  negative: 'bg-red-100 text-red-800 border-red-200',
}

export function ResultCard({ journalist, outlet, articles, sentiment }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            {journalist?.name ? journalist.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <div className="font-bold text-xl text-gray-800 mb-1">
              {journalist?.name ? journalist.name : 'Unknown Journalist'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="font-medium">{outlet?.name}</span>
              {outlet?.type && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {outlet.type}
                </span>
              )}
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold border ${sentimentColors[sentiment?.label || 'neutral']}`}
        >
          {sentiment?.label ? sentiment.label.charAt(0).toUpperCase() + sentiment.label.slice(1) : 'Neutral'}
        </span>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="font-semibold text-gray-800">Latest Articles</h3>
        </div>
        <div className="space-y-3">
          {articles.slice(0, 3).map((a, index) => (
            <div key={a.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors">
              <a 
                href={a.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline block mb-1"
              >
                {a.title}
              </a>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{a.published_at ? new Date(a.published_at).toLocaleDateString() : 'No date'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

