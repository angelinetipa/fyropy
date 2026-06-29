import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { radius, space, transition, type } from '../constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

type NavItem = {
  href: Href;
  label: string;
  icon: IconName;
  activeIcon: IconName;
};

const ITEMS: NavItem[] = [
  { href: '/', label: 'Inbox', icon: 'flash-outline', activeIcon: 'flash' },
  { href: '/tasks', label: 'Tasks', icon: 'checkbox-outline', activeIcon: 'checkbox' },
  { href: '/notes', label: 'Notes', icon: 'document-text-outline', activeIcon: 'document-text' },
];

const SETTINGS: NavItem = {
  href: '/settings',
  label: 'Settings',
  icon: 'settings-outline',
  activeIcon: 'settings',
};

export function AppNav({ wide }: { wide?: boolean }) {
  return wide ? <Sidebar /> : <BottomBar />;
}

/* ---------- Web sidebar ---------- */
function Sidebar() {
  const pathname = usePathname();
  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>Fyropy</Text>
      <View style={styles.sideItems}>
        {ITEMS.map((it) => (
          <SideRow key={String(it.href)} item={it} active={pathname === it.href} />
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <SideRow item={SETTINGS} active={pathname === SETTINGS.href} />
    </View>
  );
}

function SideRow({ item, active }: { item: NavItem; active: boolean }) {
  const router = useRouter();
  const go = () => (item.href === '/settings' ? router.push('/settings') : router.replace(item.href));
  return (
    <Pressable
      onPress={go}
      style={({ hovered }) => [
        styles.sideRow,
        transition,
        active && styles.sideRowActive,
        hovered && !active && styles.sideRowHover,
      ]}
    >
      <Ionicons
        name={active ? item.activeIcon : item.icon}
        size={20}
        color={active ? colors.accent : colors.inkSoft}
      />
      <Text style={[styles.sideLabel, active && styles.sideLabelActive]}>{item.label}</Text>
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
            <Ionicons
              name={active ? it.activeIcon : it.icon}
              size={22}
              color={active ? colors.accent : colors.inkFaint}
            />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  /* sidebar */
  sidebar: {
    width: 232,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    paddingHorizontal: space.md,
    paddingTop: space.xl,
    paddingBottom: space.lg,
  },
  logo: { ...type.display, color: colors.accent, fontSize: 26, paddingHorizontal: space.sm, marginBottom: space.xl },
  sideItems: { gap: space.xs },
  sideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    borderRadius: radius.md,
  },
  sideRowActive: { backgroundColor: 'rgba(255,122,47,0.12)' },
  sideRowHover: { backgroundColor: colors.surfaceSunk },
  sideLabel: { ...type.label, color: colors.inkSoft },
  sideLabelActive: { color: colors.accent },

  /* bottom bar */
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