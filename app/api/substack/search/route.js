import { searchSubstackPublications } from '../../../lib/substackAPI';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    const publications = await searchSubstackPublications(query);
    return new Response(JSON.stringify(publications), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

