import { useState } from 'react';
import { ConfirmModal } from '../components/ConfirmModal';
import { Item } from '../types';

/**
 * Wraps a delete action with a fire-opal confirm step.
 * Pass `requestDelete` to any card/list `onDelete`, and render `element`.
 */
export function useDeleteConfirm(remove: (item: Item) => void | Promise<void>) {
  const [target, setTarget] = useState<Item | null>(null);
  const [busy, setBusy] = useState(false);

  const requestDelete = (item: Item) => setTarget(item);

  async function confirm() {
    if (!target) return;
    setBusy(true);
    try {
      await remove(target);
    } finally {
      setBusy(false);
      setTarget(null);
    }
  }

  const element = (
    <ConfirmModal
      visible={!!target}
      title="Delete this?"
      message="This thought will be gone for good. You can't undo it."
      confirmLabel={busy ? 'Deleting…' : 'Delete'}
      danger
      onCancel={() => (busy ? null : setTarget(null))}
      onConfirm={confirm}
    />
  );

  return { requestDelete, element };
}