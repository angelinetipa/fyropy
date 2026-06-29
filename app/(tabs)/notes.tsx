import { GroupedList } from '../../src/components/GroupedList';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { useItems } from '../../src/hooks/useItems';

export default function Notes() {
  const { items, loading, query, setQuery, remove } = useItems(['note', 'idea']);

  return (
    <Screen title="Notes" subtitle="Things to keep.">
      <SearchBar value={query} onChange={setQuery} />
      <GroupedList
        items={items}
        loading={loading}
        emptyText={query ? 'No matches.' : 'No notes or ideas yet.'}
        onDelete={remove}
      />
    </Screen>
  );
}