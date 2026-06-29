import { supabase } from '../lib/supabase';
import { Item, ItemType } from '../types';
import { Triage } from './ai';

export async function listItems(types?: ItemType[]): Promise<Item[]> {
  let q = supabase.from('items').select('*').order('created_at', { ascending: false });
  if (types && types.length) q = q.in('type', types);
  const { data, error } = await q;
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

export async function updateItemText(id: string, rawText: string): Promise<void> {
  const { error } = await supabase
    .from('items')
    .update({ raw_text: rawText, url: extractUrl(rawText) })
    .eq('id', id);
  if (error) throw error;
}

export async function updateItemTriage(id: string, t: Triage): Promise<void> {
  const { error } = await supabase
    .from('items')
    .update({ type: t.type, tags: t.tags, summary: t.summary, group_name: t.group })
    .eq('id', id);
  if (error) throw error;
}

export async function setDone(id: string, done: boolean): Promise<void> {
  const { error } = await supabase.from('items').update({ done }).eq('id', id);
  if (error) throw error;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw error;
}

export async function renameGroup(from: string, to: string): Promise<void> {
  const { error } = await supabase
    .from('items')
    .update({ group_name: to })
    .eq('group_name', from);
  if (error) throw error;
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
}