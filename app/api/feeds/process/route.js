import { NextResponse } from 'next/server'
import { processAllFeeds, processSingleFeed } from '@/lib/rssService'

// POST /api/feeds/process - Process all RSS feeds or a specific feed
export async function POST(request) {
  try {
    const body = await request.json()
    const { feedId, processAll = false } = body

    let result

    if (processAll) {
      // Process all active feeds
      result = await processAllFeeds()
    } else if (feedId) {
      // Process a specific feed
      result = await processSingleFeed(feedId)
    } else {
      return NextResponse.json({ 
        error: 'Either feedId or processAll=true is required' 
      }, { status: 400 })
    }

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/feeds/process - Get processing status (placeholder for future implementation)
export async function GET(request) {
  try {
    return NextResponse.json({ 
      message: 'RSS feed processing endpoint',
      endpoints: {
        'POST /api/feeds/process': 'Process RSS feeds',
        'POST /api/feeds/process with { processAll: true }': 'Process all active feeds',
        'POST /api/feeds/process with { feedId: "uuid" }': 'Process specific feed'
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
