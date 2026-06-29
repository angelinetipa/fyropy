import { supabase } from '../lib/supabase';
import { Item } from '../types';
import { Triage } from './ai';

export async function listItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Item[];
}

export async function createItem(rawText: string): Promise<Item> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error('Not signed in');

  const { data, error } = await supabase
    .from('items')
    .insert({ user_id: user.id, raw_text: rawText, url: extractUrl(rawText) })
    .select()
    .single();
  if (error) throw error;
  return data as Item;
}

export async function updateItemTriage(id: string, t: Triage): Promise<void> {
  const { error } = await supabase
    .from('items')
    .update({ type: t.type, tags: t.tags, summary: t.summary })
    .eq('id', id);
  if (error) throw error;
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
}