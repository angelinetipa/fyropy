import { useState } from 'react';
import { RefreshControl } from 'react-native';
import { colors } from '../constants/colors';

/**
 * Pull-to-refresh helper. Pass a refresh fn, spread `control` onto any
 * FlatList/SectionList via `refreshControl={...}`.
 */
export function usePullRefresh(refresh: () => Promise<void> | void) {
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }

  const control = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.accent}
      colors={[colors.accent]}
    />
  );

  return { refreshing, onRefresh, control };
}