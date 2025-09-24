import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/journalist-suggestions - Get all journalist suggestions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('journalist_suggestions')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: suggestions, error } = await query

    if (error) {
      console.error('Error fetching suggestions:', error)
      return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/journalist-suggestions - Submit a new journalist suggestion
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      journalist_name, 
      substack_url, 
      description, 
      why_important, 
      submitter_name, 
      submitter_email, 
      submitter_affiliation 
    } = body

    // Validate required fields
    if (!journalist_name || !substack_url || !description) {
      return NextResponse.json({ 
        error: 'Journalist name, Substack URL, and description are required' 
      }, { status: 400 })
    }

    // Insert new suggestion
    const { data: newSuggestion, error } = await supabase
      .from('journalist_suggestions')
      .insert([{
        journalist_name,
        substack_url,
        description,
        why_important: why_important || null,
        submitter_name: submitter_name || null,
        submitter_email: submitter_email || null,
        submitter_affiliation: submitter_affiliation || null
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating suggestion:', error)
      return NextResponse.json({ error: 'Failed to submit suggestion' }, { status: 500 })
    }

    return NextResponse.json({ suggestion: newSuggestion }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/journalist-suggestions - Update a suggestion status
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, status, reviewer_notes, reviewed_by } = body

    if (!id || !status) {
      return NextResponse.json({ 
        error: 'Suggestion ID and status are required' 
      }, { status: 400 })
    }

    const updateData = {
      status,
      reviewer_notes: reviewer_notes || null,
      reviewed_by: reviewed_by || 'admin',
      reviewed_at: new Date().toISOString()
    }

    const { data: updatedSuggestion, error } = await supabase
      .from('journalist_suggestions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating suggestion:', error)
      return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 })
    }

    if (!updatedSuggestion) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 })
    }

    return NextResponse.json({ suggestion: updatedSuggestion })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
