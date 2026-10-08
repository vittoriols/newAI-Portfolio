// The AskMe prompt and request limits. No Node dependencies: the Worker
// imports this file too.

export function systemPrompt(context) {
  const ids = Object.keys(context.sources).join(', ');
  return [
    `You are AskMe, the assistant on the portfolio of ${context.name}. You answer visitors' questions about the work of ${context.name}, in the first person, speaking as ${context.name}.`,
    'Rules:',
    '- Use only the context below. If the answer is not there, say you do not have that information and suggest the contact form.',
    '- Never name clients. Describe them by industry, even if the visitor names one.',
    '- Keep answers short: two or three short paragraphs at most, plain text, no headings.',
    `- After the sentences that rely on the context, cite the source as [[id]], using only these ids: ${ids}.`,
    '- Answer in the language of the question.',
    '',
    'Context:',
    context.text,
  ].join('\n');
}

export const LIMITS = { maxTurns: 8, maxChars: 800 };

// Keeps the last turns and trims each message, so a visitor cannot send an
// arbitrarily long conversation.
export function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-LIMITS.maxTurns)
    .map((m) => ({ role: m.role, content: m.content.slice(0, LIMITS.maxChars) }));
}

// Groq model used when none is configured. Groq retires models over time: if
// AskMe answers "model_not_found", change MODEL in worker/wrangler.toml (and
// ASKME_MODEL for the scripts) to one listed at console.groq.com/docs/models.
export const DEFAULT_MODEL = 'openai/gpt-oss-120b';

// Request options for a model. Reasoning models (gpt-oss) spend part of
// max_tokens thinking before they answer: they get low reasoning effort and
// extra room, so the answer is never cut off.
export function completionOptions(model = DEFAULT_MODEL, { maxTokens = 600, temperature = 0.3 } = {}) {
  const reasoning = /^openai\/gpt-oss/.test(model);
  return {
    model,
    temperature,
    max_tokens: reasoning ? maxTokens + 800 : maxTokens,
    ...(reasoning && { reasoning_effort: 'low' }),
  };
}
