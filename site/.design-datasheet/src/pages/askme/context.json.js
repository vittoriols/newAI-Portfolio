// Published as /askme/context.json. The AskMe Worker reads it, so updating
// the content updates the assistant without redeploying the Worker.
import { loadAll } from '../../lib/content.mjs';
import { buildContextFromContent } from '../../lib/askme.mjs';

export async function GET() {
  const context = await buildContextFromContent(await loadAll());
  return new Response(JSON.stringify(context), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
