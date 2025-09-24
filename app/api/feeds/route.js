import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/feeds - Get all active RSS feeds
export async function GET(request) {
  try {
    const { data: feeds, error } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('status', 'active')
      .order('name')

    if (error) {
      console.error('Error fetching feeds:', error)
      return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 })
    }

    return NextResponse.json({ feeds })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/feeds - Add a new RSS feed
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, url, description, source, category, website_url, added_by } = body

    // Validate required fields
    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 })
    }

    // Check if URL already exists
    const { data: existingFeed } = await supabase
      .from('rss_feeds')
      .select('id')
      .eq('url', url)
      .single()

    if (existingFeed) {
      return NextResponse.json({ error: 'RSS feed with this URL already exists' }, { status: 409 })
    }

    // Extract domain from URL
    const domain = new URL(url).hostname

    // Insert new feed
    const { data: newFeed, error } = await supabase
      .from('rss_feeds')
      .insert([{
        name,
        url,
        description: description || null,
        source: source || 'Manual',
        category: category || null,
        website_url: website_url || null,
        domain,
        added_by: added_by || 'admin'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating feed:', error)
      return NextResponse.json({ error: 'Failed to create feed' }, { status: 500 })
    }

    return NextResponse.json({ feed: newFeed }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/feeds - Update an RSS feed
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, name, url, description, source, category, website_url, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Feed ID is required' }, { status: 400 })
    }

    const updateData = {}
    if (name) updateData.name = name
    if (url) updateData.url = url
    if (description !== undefined) updateData.description = description
    if (source) updateData.source = source
    if (category) updateData.category = category
    if (website_url !== undefined) updateData.website_url = website_url
    if (status) updateData.status = status

    const { data: updatedFeed, error } = await supabase
      .from('rss_feeds')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating feed:', error)
      return NextResponse.json({ error: 'Failed to update feed' }, { status: 500 })
    }

    if (!updatedFeed) {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 })
    }

    return NextResponse.json({ feed: updatedFeed })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/feeds - Delete an RSS feed
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Feed ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('rss_feeds')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting feed:', error)
      return NextResponse.json({ error: 'Failed to delete feed' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Feed deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
