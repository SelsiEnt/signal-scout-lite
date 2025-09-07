import { parseRssFeed } from '../../../lib/rssParser';

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
    }

    const feed = await parseRssFeed(url);
    return new Response(JSON.stringify(feed), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
