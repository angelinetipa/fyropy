import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/constants/colors';
import { clay, space, type } from '../../src/constants/theme';

export default function Notes() {
  return (
    <Screen title="Notes" subtitle="Things to keep.">
      <View style={[clay, styles.card]}>
        <Text style={styles.cardBody}>
          Notes and ideas Fyropy saves will show up here.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: space.lg, marginTop: space.sm },
  cardBody: { ...type.body, color: colors.inkSoft },
});
