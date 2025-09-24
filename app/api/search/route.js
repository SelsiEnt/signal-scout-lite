import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// POST /api/search - Search articles across RSS feeds
export async function POST(request) {
  try {
    const body = await request.json()
    const { query, filters = {} } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    // Log the search
    await supabase
      .from('search_logs')
      .insert([{
        query: query.trim(),
        search_type: 'article_search',
        filters,
        user_agent: request.headers.get('user-agent') || 'Unknown',
        ip_address: request.headers.get('x-forwarded-for') || 'Unknown'
      }])

    // Build the search query
    let searchQuery = supabase
      .from('articles')
      .select(`
        *,
        rss_feeds (
          id,
          name,
          source,
          category,
          domain,
          website_url
        )
      `)
      .textSearch('title', query.trim())
      .or(`description.ilike.%${query.trim()}%,content.ilike.%${query.trim()}%`)
      .order('published_at', { ascending: false })
      .limit(50)

    // Apply filters if provided
    if (filters.source) {
      searchQuery = searchQuery.eq('rss_feeds.source', filters.source)
    }

    if (filters.category) {
      searchQuery = searchQuery.eq('rss_feeds.category', filters.category)
    }

    if (filters.dateFrom) {
      searchQuery = searchQuery.gte('published_at', filters.dateFrom)
    }

    if (filters.dateTo) {
      searchQuery = searchQuery.lte('published_at', filters.dateTo)
    }

    const { data: articles, error } = await searchQuery

    if (error) {
      console.error('Error searching articles:', error)
      return NextResponse.json({ error: 'Failed to search articles' }, { status: 500 })
    }

    // Update search log with results count
    await supabase
      .from('search_logs')
      .update({ results_count: articles.length })
      .eq('query', query.trim())
      .order('created_at', { ascending: false })
      .limit(1)

    return NextResponse.json({ 
      articles: articles || [],
      totalResults: articles?.length || 0,
      query: query.trim()
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/search - Get search statistics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    // Get search statistics
    const { data: stats, error } = await supabase
      .from('search_logs')
      .select('query, results_count, created_at')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching search stats:', error)
      return NextResponse.json({ error: 'Failed to fetch search statistics' }, { status: 500 })
    }

    // Calculate statistics
    const totalSearches = stats.length
    const avgResultsPerSearch = stats.length > 0 
      ? stats.reduce((sum, s) => sum + (s.results_count || 0), 0) / stats.length 
      : 0

    const popularQueries = stats
      .reduce((acc, s) => {
        const query = s.query.toLowerCase()
        acc[query] = (acc[query] || 0) + 1
        return acc
      }, {})

    const topQueries = Object.entries(popularQueries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }))

    return NextResponse.json({
      totalSearches,
      avgResultsPerSearch: Math.round(avgResultsPerSearch * 100) / 100,
      topQueries,
      period: `${days} days`
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
