import { Slot } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import { AppNav } from '../../src/components/AppNav';
import { colors } from '../../src/constants/colors';

const WIDE_BREAKPOINT = 768;

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const wide = width >= WIDE_BREAKPOINT;

  if (wide) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.bg }}>
        <AppNav wide />
        <View style={{ flex: 1, minHeight: 0 }}>
          <Slot />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, minHeight: 0 }}>
        <Slot />
      </View>
      <AppNav />
    </View>
  );
}