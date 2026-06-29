import { GroupedList } from '../../src/components/GroupedList';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { useDeleteConfirm } from '../../src/hooks/useDeleteConfirm';
import { useItemDetail } from '../../src/hooks/useItemDetail';
import { useItems } from '../../src/hooks/useItems';
import { usePullRefresh } from '../../src/hooks/usePullRefresh';

export default function Notes() {
  const { items, loading, query, setQuery, saveText, remove, rename, refresh } =
    useItems(['note', 'idea']);
  const detail = useItemDetail({ onSaveText: saveText, onDelete: remove });
  const del = useDeleteConfirm(remove);
  const pull = usePullRefresh(refresh);

  return (
    <Screen title="Notes" subtitle="Things to keep.">
      <SearchBar value={query} onChange={setQuery} />
      <GroupedList
        items={items}
        loading={loading}
        emptyText={query ? 'No matches.' : 'No notes or ideas yet.'}
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