import { useCallback, useState } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { getTrips } from '@/lib/storage';
import { Trip } from '@/lib/types';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';

export default function LandingPage() {
  const [latestTrip, setLatestTrip] = useState<Trip | null>(null);
  const colorScheme = useColorScheme();

  const loadTrips = async () => {
    const tripsFromStorage = await getTrips();  const sorted = [...tripsFromStorage].sort((a, b) => {
    const aEnd = new Date(a.endDate ?? a.startDate).getTime();
    const bEnd = new Date(b.endDate ?? b.startDate).getTime();
    return bEnd - aEnd; 
    });
    setLatestTrip(sorted[0]);
  };

useFocusEffect(
  useCallback(() => {
    loadTrips();
  }, [])
);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/landing-background.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.content}>
        <Text style={styles.title}>Hei, 'käyttäjä' !</Text>

          {latestTrip ? (
            <>
            <Text style={[ styles.latestText, { backgroundColor: Colors[colorScheme ?? 'light'].tint} ]}>
              VIIMEISIN
            </Text>
            <View style={styles.tripSummary}>
              <Text style={styles.tripDate}>
                {new Date(latestTrip.startDate).toLocaleDateString()}
                {(latestTrip.endDate !== latestTrip.startDate) 
                ? `–${new Date(latestTrip.endDate).toLocaleDateString()}`
                : ''}
              </Text>
              <Text style={styles.tripLocation}>{latestTrip.name}</Text>

              <Link 
                href={`/add-catch?tripId=${latestTrip.id}`} 
                style={[ styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint } ]}
              >
                <Text style={styles.buttonText}>LISÄÄ KALA</Text>
              </Link>

              <Link href={`/trip-details?tripId=${latestTrip.id}`} 
                style={[ styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint } ]}
              >
                <Text style={styles.buttonText}>AVAA TIEDOT</Text>
              </Link>
            </View>
            </>
          ) : (
            <Text style={styles.noTripText}>Ei tallennettuja reissuja. Aloita lisäämällä uusi reissu!</Text>
          )}

          <Link href='/add-trip' style={[ styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint } ]}>
            <Text style={styles.buttonText}>LISÄÄ REISSU</Text>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingVertical: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    alignItems: 'center',
    width: '85%',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 40,
  },
  latestText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    letterSpacing: 0.5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  tripSummary: {
    marginBottom: 20,
    padding: 20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    width: '100%',
  },
  tripDate: {
    fontSize: 14,
    fontWeight: '400',
  },
  tripLocation: {
    fontSize: 22,
    fontWeight: '600',
  },
  noTripText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    paddingVertical: 10,
    borderRadius: 4,
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
    letterSpacing: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
