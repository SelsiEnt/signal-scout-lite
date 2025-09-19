import { getSubstackSearchLogs, clearSubstackSearchLogs } from '../../../../lib/substackAPI';

export async function GET(request) {
  try {
    const logs = getSubstackSearchLogs();
    return new Response(JSON.stringify(logs), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

export async function DELETE(request) {
  try {
    const result = clearSubstackSearchLogs();
    return new Response(JSON.stringify(result), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}
