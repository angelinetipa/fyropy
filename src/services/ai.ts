import { ItemType } from '../types';
import { getSettings } from './settings';

export type Triage = {
  type: ItemType;
  group: string;
  tags: string[];
  summary: string;
};

const SYSTEM = `You sort a user's captured thought. Reply ONLY with JSON:
{"type":"note|task|idea","group":"broad topic, Title Case, 1-3 words","tags":["lowercase","max 3"],"summary":"one short sentence"}
- "task": something to do or remember to do.
- "idea": a thought, plan, or thing to explore.
- "note": a fact, link, or reference to keep.
- "group": a GENERAL subject many items could share (e.g. "Big Data", "Errands",
  "Friends", "Job Search"). Reuse common topics; do NOT invent a unique group per item.
If it's a link, summarize what the page is likely about. Keep summary under 12 words.`;

const ORGANIZE = `You tidy a single captured note.
Reorganize the user's text into a clean, scannable structure:
- Group related points together.
- Use short bullet lines, each starting with "• ".
- Add a brief plain heading only if it clearly helps (no markdown symbols like # or **).
- Keep ALL the user's information and wording where possible.
Do NOT add new ideas, opinions, or commentary. Do NOT explain what you did.
Reply with ONLY the reorganized note text and nothing else.`;

export async function triage(rawText: string): Promise<Triage> {
  const { ai_provider, ai_key } = await getSettings();
  if (!ai_key) throw new Error('No AI key saved in Settings.');
  return ai_provider === 'gemini'
    ? triageGemini(rawText, ai_key)
    : triageGroq(rawText, ai_key);
}

export async function organizeText(rawText: string): Promise<string> {
  const { ai_provider, ai_key } = await getSettings();
  if (!ai_key) throw new Error('No AI key saved in Settings.');
  const out =
    ai_provider === 'gemini'
      ? await organizeGemini(rawText, ai_key)
      : await organizeGroq(rawText, ai_key);
  const clean = out.trim();
  return clean || rawText;
}

async function triageGroq(text: string, key: string): Promise<Triage> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: text },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq error ${res.status}`);
  const data = await res.json();
  return parseTriage(data.choices?.[0]?.message?.content ?? '{}');
}

async function triageGemini(text: string, key: string): Promise<Triage> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ parts: [{ text }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  const data = await res.json();
  return parseTriage(data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}');
}

async function organizeGroq(text: string, key: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      messages: [
        { role: 'system', content: ORGANIZE },
        { role: 'user', content: text },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

async function organizeGemini(text: string, key: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: ORGANIZE }] },
      contents: [{ parts: [{ text }] }],
      generationConfig: { temperature: 0.3 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

function parseTriage(raw: string): Triage {
  let parsed: any = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }
  const valid: ItemType[] = ['note', 'task', 'idea'];
  const type: ItemType = valid.includes(parsed.type) ? parsed.type : 'note';
  const group =
    typeof parsed.group === 'string' && parsed.group.trim()
      ? parsed.group.trim()
      : 'General';
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.map((t: any) => String(t).toLowerCase().trim()).slice(0, 3)
    : [];
  const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
  return { type, group, tags, summary };
}