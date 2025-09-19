// This is a placeholder for a more robust Substack API integration.
// Substack does not have a public API for searching publications directly.
// A real implementation would likely involve scraping or using a third-party service.

// Search logs storage (in a real app, this would be in a database)
let searchLogs = [];

const DUMMY_SUBSTACK_PUBLICATIONS = [
  {
    id: 'substack-1',
    name: 'The Dispatch',
    url: 'https://thedispatch.com/',
    rss_url: 'https://thedispatch.com/feed/',
    description: 'News and commentary from a conservative perspective.',
    category: 'Politics',
  },
  {
    id: 'substack-2',
    name: 'Platformer',
    url: 'https://www.platformer.news/',
    rss_url: 'https://www.platformer.news/feed',
    description: 'On the intersection of tech, power, and democracy.',
    category: 'Technology',
  },
  {
    id: 'substack-3',
    name: 'Popular Information',
    url: 'https://popular.info/',
    rss_url: 'https://popular.info/feed',
    description: 'Accountability journalism from Judd Legum.',
    category: 'Investigative Journalism',
  },
  {
    id: 'substack-4',
    name: 'Culture Study',
    url: 'https://annehelen.substack.com/',
    rss_url: 'https://annehelen.substack.com/feed',
    description: 'Thoughts on culture, work, and life.',
    category: 'Culture',
  },
];

export async function searchSubstackPublications(query) {
  // Log the search
  const searchLog = {
    id: Date.now(),
    query: query || '',
    timestamp: new Date().toISOString(),
    resultsCount: 0,
    ip: '127.0.0.1', // In a real app, this would come from the request
    userAgent: 'Admin Panel'
  };

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let results = [];
  if (!query) {
    results = DUMMY_SUBSTACK_PUBLICATIONS;
  } else {
    const lowerCaseQuery = query.toLowerCase();
    results = DUMMY_SUBSTACK_PUBLICATIONS.filter(pub =>
      pub.name.toLowerCase().includes(lowerCaseQuery) ||
      pub.description.toLowerCase().includes(lowerCaseQuery) ||
      pub.category.toLowerCase().includes(lowerCaseQuery)
    );
  }

  // Update search log with results count
  searchLog.resultsCount = results.length;
  searchLogs.unshift(searchLog); // Add to beginning of array

  // Keep only last 100 searches to prevent memory issues
  if (searchLogs.length > 100) {
    searchLogs = searchLogs.slice(0, 100);
  }

  return results;
}

export async function getPopularSubstackPublications() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return DUMMY_SUBSTACK_PUBLICATIONS;
}

export function getSubstackSearchLogs() {
  return searchLogs;
}

export function clearSubstackSearchLogs() {
  searchLogs = [];
  return { message: 'Search logs cleared successfully' };
}

