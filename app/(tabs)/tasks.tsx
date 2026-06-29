import { GroupedList } from '../../src/components/GroupedList';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { useDeleteConfirm } from '../../src/hooks/useDeleteConfirm';
import { useItemDetail } from '../../src/hooks/useItemDetail';
import { useItems } from '../../src/hooks/useItems';
import { usePullRefresh } from '../../src/hooks/usePullRefresh';

export default function Tasks() {
  const { items, loading, query, setQuery, saveText, toggleDone, remove, rename, refresh } =
    useItems(['task']);
  const detail = useItemDetail({ onSaveText: saveText, onDelete: remove, onToggleDone: toggleDone });
  const del = useDeleteConfirm(remove);
  const pull = usePullRefresh(refresh);

  return (
    <Screen title="Tasks" subtitle="Things to do.">
      <SearchBar value={query} onChange={setQuery} />
      <GroupedList
        items={items}
        loading={loading}
        emptyText={query ? 'No matches.' : 'No tasks yet. Capture one in the Inbox.'}
        onToggleDone={toggleDone}
        onDelete={del.requestDelete}
        onRenameGroup={rename}
        onPressItem={detail.open}
        refreshControl={pull.control}
      />
      {detail.element}
      {del.element}
    </Screen>
  );
}