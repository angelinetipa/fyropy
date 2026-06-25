import { supabase } from '../lib/supabase';

export type AiProvider = 'gemini' | 'groq';
export type Settings = { ai_provider: AiProvider | null; ai_key: string | null };

export async function getSettings(): Promise<Settings> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error('Not signed in');

  const { data, error } = await supabase
    .from('settings')
    .select('ai_provider, ai_key')
    .eq('user_id', u.user.id)
    .maybeSingle();
  if (error) throw error;

  return { ai_provider: data?.ai_provider ?? null, ai_key: data?.ai_key ?? null };
}

export async function saveSettings(s: Settings): Promise<void> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error('Not signed in');

  const { error } = await supabase
    .from('settings')
    .upsert({ user_id: u.user.id, ai_provider: s.ai_provider, ai_key: s.ai_key });
  if (error) throw error;
}