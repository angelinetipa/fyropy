export type ItemType = 'note' | 'task' | 'idea';

export type Item = {
  id: string;
  user_id: string;
  raw_text: string;
  type: ItemType | null;
  tags: string[];
  summary: string | null;
  url: string | null;
  group_name: string | null;
  done: boolean;
  created_at: string;
};