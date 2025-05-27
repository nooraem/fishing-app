import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, useThemeColor, View } from '@/components/Themed';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const router = useRouter();
  const buttonPrimary = useThemeColor({}, 'primary');
  const inputBorder = useThemeColor({}, 'inputBorder');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KalaAPP</Text>

      <TextInput
        style={[styles.input, { borderColor: inputBorder }]}
        placeholder="Sähköposti"
        placeholderTextColor="#6B705C"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { borderColor: inputBorder }]}
        placeholder="Salasana"
        placeholderTextColor="#6B705C"
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: buttonPrimary }]} 
        onPress={() => { router.push('/') }}
      >
        <Text style={styles.buttonText}>Kirjaudu sisään</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 50,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 60,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: 0.25,
    color: '#fff',
  },
});
