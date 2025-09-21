import { NextResponse } from 'next/server'

// Additional RSS feeds that are available for searching (beyond what's in localStorage)
const ADDITIONAL_SEARCHABLE_FEEDS = [
  {
    id: 'searchable-1',
    name: 'The UnPopulist',
    url: 'https://www.theunpopulist.net/feed',
    description: 'Democracy, authoritarianism, civil liberties, and institutions',
    source: 'Substack',
    category: 'Democracy',
    domain: 'www.theunpopulist.net',
    region: 'US',
    topic_hints: ['democracy', 'authoritarianism', 'civil liberties', 'institutions'],
    status: 'active'
  },
  {
    id: 'searchable-2',
    name: 'DemocracySOS',
    url: 'https://democracysos.substack.com/feed',
    description: 'Democracy reform, elections, voting systems, and institutions',
    source: 'Substack',
    category: 'Democracy',
    domain: 'democracysos.substack.com',
    region: 'US',
    topic_hints: ['democracy reform', 'elections', 'voting systems', 'institutions'],
    status: 'active'
  },
  {
    id: 'searchable-3',
    name: 'DemocracyNext Newsletter',
    url: 'https://demnext.substack.com/feed',
    description: 'Deliberative democracy, citizens assemblies, and institutional design',
    source: 'Substack',
    category: 'Democracy',
    domain: 'demnext.substack.com',
    region: 'US',
    topic_hints: ['deliberative democracy', 'citizens assemblies', 'institutional design'],
    status: 'active'
  },
  {
    id: 'searchable-4',
    name: 'Democracy Notes',
    url: 'https://democracynotes.substack.com/feed',
    description: 'Voting rights, civic engagement, and elections',
    source: 'Substack',
    category: 'Democracy',
    domain: 'democracynotes.substack.com',
    region: 'US',
    topic_hints: ['voting rights', 'civic engagement', 'elections'],
    status: 'active'
  },
  {
    id: 'searchable-5',
    name: 'Democracy of Hope',
    url: 'https://democracyofhope.substack.com/feed',
    description: 'History of democracy, civic culture, and institutions',
    source: 'Substack',
    category: 'Democracy',
    domain: 'democracyofhope.substack.com',
    region: 'US',
    topic_hints: ['history of democracy', 'civic culture', 'institutions'],
    status: 'active'
  },
  {
    id: 'searchable-6',
    name: 'Democracy for Sale',
    url: 'https://democracyforsale.substack.com/feed',
    description: 'Dark money, campaign finance, and transparency',
    source: 'Substack',
    category: 'Democracy',
    domain: 'democracyforsale.substack.com',
    region: 'US',
    topic_hints: ['dark money', 'campaign finance', 'transparency'],
    status: 'active'
  },
  {
    id: 'searchable-7',
    name: 'The Present Age',
    url: 'https://www.readtpa.com/feed',
    description: 'Media criticism, disinformation, and democracy',
    source: 'Substack',
    category: 'Media',
    domain: 'www.readtpa.com',
    region: 'US',
    topic_hints: ['media criticism', 'disinformation', 'democracy'],
    status: 'active'
  },
  {
    id: 'searchable-8',
    name: 'Popular Information',
    url: 'https://popular.info/feed',
    description: 'Political accountability, money in politics, and voting rights',
    source: 'Substack',
    category: 'Investigative',
    domain: 'popular.info',
    region: 'US',
    topic_hints: ['political accountability', 'money in politics', 'voting rights'],
    status: 'active'
  },
  {
    id: 'searchable-9',
    name: 'Center for Democracy & Civic Engagement',
    url: 'https://cdce.substack.com/feed',
    description: 'Civic research, participation, and pro-democracy content',
    source: 'Substack',
    category: 'Research',
    domain: 'cdce.substack.com',
    region: 'US',
    topic_hints: ['civic research', 'participation', 'pro-democracy'],
    status: 'active'
  },
  {
    id: 'searchable-10',
    name: 'Democracy Is Hard',
    url: 'https://ruthbraunstein.substack.com/feed',
    description: 'Religion and politics, civic norms, and democracy',
    source: 'Substack',
    category: 'Democracy',
    domain: 'ruthbraunstein.substack.com',
    region: 'US',
    topic_hints: ['religion and politics', 'civic norms', 'democracy'],
    status: 'active'
  },
  {
    id: 'searchable-11',
    name: 'Letters from an American',
    url: 'https://heathercoxrichardson.substack.com/feed',
    description: 'US history, democracy, and institutions',
    source: 'Substack',
    category: 'History',
    domain: 'heathercoxrichardson.substack.com',
    region: 'US',
    topic_hints: ['US history', 'democracy', 'institutions'],
    status: 'active'
  },
  {
    id: 'searchable-12',
    name: 'America, America (Dan Rather)',
    url: 'https://america.substack.com/feed',
    description: 'Media and democracy, civic norms, and politics',
    source: 'Substack',
    category: 'Media',
    domain: 'america.substack.com',
    region: 'US',
    topic_hints: ['media and democracy', 'civic norms', 'politics'],
    status: 'active'
  }
]

export async function GET(request) {
  try {
    // In a real application, this would fetch from your database
    // For now, we'll return the predefined searchable feeds
    return NextResponse.json({ 
      feeds: ADDITIONAL_SEARCHABLE_FEEDS,
      total: ADDITIONAL_SEARCHABLE_FEEDS.length,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}
