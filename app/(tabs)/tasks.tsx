import { GroupedList } from '../../src/components/GroupedList';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { useItemDetail } from '../../src/hooks/useItemDetail';
import { useItems } from '../../src/hooks/useItems';

export default function Tasks() {
  const { items, loading, query, setQuery, saveText, toggleDone, remove, rename } =
    useItems(['task']);
  const detail = useItemDetail({ onSaveText: saveText, onDelete: remove, onToggleDone: toggleDone });

  return (
    <Screen title="Tasks" subtitle="Things to do.">
      <SearchBar value={query} onChange={setQuery} />
      <GroupedList
        items={items}
        loading={loading}
        emptyText={query ? 'No matches.' : 'No tasks yet. Capture one in the Inbox.'}
        onToggleDone={toggleDone}
        onDelete={remove}
        onRenameGroup={rename}
        onPressItem={detail.open}
      />
      {detail.element}
    </Screen>
  );
}