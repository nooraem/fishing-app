import { StyleSheet, Button } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>( work in progress )</Text>
      <Button 
        title="Kirjaudu ulos" 
        color={Colors[colorScheme ?? 'light'].tint}
        onPress={() => router.push('/sign-in') }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 40,
    letterSpacing: 0.5,
  }
});
