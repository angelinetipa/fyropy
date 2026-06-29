import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { radius, space, transition, type } from '../constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;
type NavItem = { href: Href; label: string; icon: IconName; activeIcon: IconName };

const ITEMS: NavItem[] = [
  { href: '/', label: 'Inbox', icon: 'flash-outline', activeIcon: 'flash' },
  { href: '/tasks', label: 'Tasks', icon: 'checkbox-outline', activeIcon: 'checkbox' },
  { href: '/notes', label: 'Notes', icon: 'document-text-outline', activeIcon: 'document-text' },
];
const SETTINGS: NavItem = {
  href: '/settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings',
};

const STORE_KEY = 'fyropy:sidebar-collapsed';
const widthTransition = Platform.select({
  web: { transitionProperty: 'width', transitionDuration: '180ms' },
  default: {},
}) as object;

export function AppNav({ wide }: { wide?: boolean }) {
  return wide ? <Sidebar /> : <BottomBar />;
}

/* ---------- Web sidebar ---------- */
function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORE_KEY).then((v) => {
      if (v != null) setCollapsed(v === '1');
    });
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    AsyncStorage.setItem(STORE_KEY, next ? '1' : '0');
  };

  return (
    <View style={[styles.sidebar, widthTransition, { width: collapsed ? 76 : 232 }]}>
      <View style={[styles.brandRow, collapsed && styles.brandRowCollapsed]}>
        <Text style={collapsed ? styles.mark : styles.logo}>{collapsed ? 'F' : 'Fyropy'}</Text>
        <Pressable onPress={toggle} hitSlop={8} style={({ hovered }) => [styles.toggle, hovered && styles.toggleHover]}>
          <Ionicons name={collapsed ? 'chevron-forward' : 'chevron-back'} size={18} color={colors.inkSoft} />
        </Pressable>
      </View>

      <View style={styles.sideItems}>
        {ITEMS.map((it) => (
          <SideRow key={String(it.href)} item={it} active={pathname === it.href} collapsed={collapsed} />
        ))}
      </View>

      <View style={{ flex: 1 }} />
      <SideRow item={SETTINGS} active={pathname === SETTINGS.href} collapsed={collapsed} />
    </View>
  );
}

function SideRow({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const router = useRouter();
  const go = () => (item.href === '/settings' ? router.push('/settings') : router.replace(item.href));
  return (
    <Pressable
      onPress={go}
      style={({ hovered }) => [
        styles.sideRow,
        collapsed && styles.sideRowCollapsed,
        transition,
        active && styles.sideRowActive,
        hovered && !active && styles.sideRowHover,
      ]}
    >
      <Ionicons name={active ? item.activeIcon : item.icon} size={20} color={active ? colors.accent : colors.inkSoft} />
      {!collapsed && <Text style={[styles.sideLabel, active && styles.sideLabelActive]}>{item.label}</Text>}
    </Pressable>
  );
}

/* ---------- Mobile bottom bar ---------- */
function BottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottom, { paddingBottom: insets.bottom + 6 }]}>
      {ITEMS.map((it) => {
        const active = pathname === it.href;
        return (
          <Pressable key={String(it.href)} style={styles.tab} onPress={() => router.replace(it.href)}>
            <Ionicons name={active ? it.activeIcon : it.icon} size={22} color={active ? colors.accent : colors.inkFaint} />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    paddingHorizontal: space.md,
    paddingTop: space.xl,
    paddingBottom: space.lg,
    overflow: 'hidden',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.xl,
    paddingHorizontal: space.sm,
  },
  brandRowCollapsed: { flexDirection: 'column', gap: space.md, justifyContent: 'center' },
  logo: { ...type.display, color: colors.accent, fontSize: 26 },
  mark: { ...type.display, color: colors.accent, fontSize: 28 },
  toggle: { padding: 4, borderRadius: radius.sm },
  toggleHover: { backgroundColor: colors.surfaceSunk },

  sideItems: { gap: space.xs },
  sideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    borderRadius: radius.md,
  },
  sideRowCollapsed: { justifyContent: 'center', paddingHorizontal: 0 },
  sideRowActive: { backgroundColor: 'rgba(255,122,47,0.12)' },
  sideRowHover: { backgroundColor: colors.surfaceSunk },
  sideLabel: { ...type.label, color: colors.inkSoft },
  sideLabelActive: { color: colors.accent },

  bottom: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: space.sm,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  tabLabel: { ...type.mono, fontSize: 11, color: colors.inkFaint },
  tabLabelActive: { color: colors.accent },
});