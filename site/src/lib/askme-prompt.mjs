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
