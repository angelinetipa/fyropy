import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/constants/colors';
import { clay, space, type } from '../../src/constants/theme';

export default function Tasks() {
  return (
    <Screen title="Tasks" subtitle="Things to do.">
      <View style={[clay, styles.card]}>
        <Text style={styles.cardBody}>
          Tasks Fyropy spots in your captures will land here.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: space.lg, marginTop: space.sm },
  cardBody: { ...type.body, color: colors.inkSoft },
});
