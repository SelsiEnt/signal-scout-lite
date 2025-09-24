import Parser from 'rss-parser'
import { supabase } from './supabaseClient'

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Signal Scout Lite RSS Parser 1.0'
  }
})

// Fetch and parse RSS feed
export async function fetchRSSFeed(url) {
  try {
    const feed = await parser.parseURL(url)
    return {
      success: true,
      feed: {
        title: feed.title,
        description: feed.description,
        link: feed.link,
        items: feed.items.map(item => ({
          title: item.title,
          link: item.link,
          description: item.contentSnippet || item.content || item.description,
          content: item['content:encoded'] || item.content || item.description,
          author: item.creator || item.author,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          categories: item.categories || [],
          guid: item.guid || item.link
        }))
      }
    }
  } catch (error) {
    console.error(`Error parsing RSS feed ${url}:`, error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Store articles from RSS feed to database
export async function storeArticlesFromFeed(feedId, articles) {
  try {
    const articlesToInsert = articles.map(article => ({
      rss_feed_id: feedId,
      title: article.title,
      url: article.link,
      description: article.description,
      content: article.content,
      author: article.author,
      published_at: article.publishedAt,
      tags: article.categories,
      guid: article.guid
    }))

    // Use upsert to avoid duplicates
    const { data, error } = await supabase
      .from('articles')
      .upsert(articlesToInsert, {
        onConflict: 'url',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error('Error storing articles:', error)
      return { success: false, error: error.message }
    }

    return { 
      success: true, 
      storedCount: data.length,
      articles: data 
    }
  } catch (error) {
    console.error('Unexpected error storing articles:', error)
    return { success: false, error: error.message }
  }
}

// Process all active RSS feeds
export async function processAllFeeds() {
  try {
    // Get all active RSS feeds
    const { data: feeds, error: feedsError } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('status', 'active')

    if (feedsError) {
      console.error('Error fetching feeds:', feedsError)
      return { success: false, error: feedsError.message }
    }

    const results = []

    for (const feed of feeds) {
      console.log(`Processing feed: ${feed.name}`)
      
      // Fetch RSS content
      const feedResult = await fetchRSSFeed(feed.url)
      
      if (feedResult.success) {
        // Store articles
        const storeResult = await storeArticlesFromFeed(feed.id, feedResult.feed.items)
        
        results.push({
          feedId: feed.id,
          feedName: feed.name,
          success: storeResult.success,
          articlesCount: storeResult.storedCount || 0,
          error: storeResult.error
        })
      } else {
        results.push({
          feedId: feed.id,
          feedName: feed.name,
          success: false,
          articlesCount: 0,
          error: feedResult.error
        })
      }

      // Add delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return {
      success: true,
      processedFeeds: results.length,
      results
    }
  } catch (error) {
    console.error('Unexpected error processing feeds:', error)
    return { success: false, error: error.message }
  }
}

// Process a single RSS feed
export async function processSingleFeed(feedId) {
  try {
    // Get the specific feed
    const { data: feed, error: feedError } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('id', feedId)
      .single()

    if (feedError) {
      console.error('Error fetching feed:', feedError)
      return { success: false, error: feedError.message }
    }

    // Fetch RSS content
    const feedResult = await fetchRSSFeed(feed.url)
    
    if (!feedResult.success) {
      return { success: false, error: feedResult.error }
    }

    // Store articles
    const storeResult = await storeArticlesFromFeed(feed.id, feedResult.feed.items)
    
    return {
      success: storeResult.success,
      feedName: feed.name,
      articlesCount: storeResult.storedCount || 0,
      error: storeResult.error
    }
  } catch (error) {
    console.error('Unexpected error processing single feed:', error)
    return { success: false, error: error.message }
  }
}
