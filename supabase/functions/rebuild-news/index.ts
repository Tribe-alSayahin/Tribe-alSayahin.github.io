// Supabase Edge Function: trigger GitHub repository_dispatch rebuild for news posts
// Deploy: supabase functions deploy rebuild-news
// Set secrets: supabase secrets set GITHUB_TOKEN <repo-scope-pat> WEBHOOK_SECRET <random-secret>

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');
const REPO = 'Tribe-alSayahin/Tribe-alSayahin.github.io';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (WEBHOOK_SECRET) {
    const secretHeader = req.headers.get('x-webhook-secret');
    if (secretHeader !== WEBHOOK_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  if (!GITHUB_TOKEN) {
    return new Response('GITHUB_TOKEN is not configured', { status: 500 });
  }

  const response = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ event_type: 'rebuild-news' }),
  });

  if (!response.ok) {
    const text = await response.text();
    return new Response(`GitHub API error ${response.status}: ${text}`, { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
