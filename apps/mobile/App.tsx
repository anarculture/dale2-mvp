import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@dale/ui';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dale Mobile</Text>
      <Button onPress={() => alert('Button clicked!')} text="Shared Button" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
