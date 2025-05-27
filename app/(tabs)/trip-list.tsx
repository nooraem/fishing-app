import React, { useCallback,  useState } from 'react';
import { FlatList, Button, StyleSheet, Alert, TouchableOpacity, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getTrips, removeTrip } from '@/lib/storage';
import { Trip } from '@/lib/types';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function TripListScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const loadTrips = async () => {
    const tripsFromStorage = await getTrips();  const sorted = [...tripsFromStorage].sort((a, b) => {
    const aEnd = new Date(a.endDate ?? a.startDate).getTime();
    const bEnd = new Date(b.endDate ?? b.startDate).getTime();
    return bEnd - aEnd; 
    });
    setTrips(sorted);
  };

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  const handleDeleteTrip = (tripId: string) => {
    Alert.alert(
      'Poista reissu',
      `Haluatko varmasti poistaa reissun?`,
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            await removeTrip(tripId);
            loadTrips();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        renderItem={({ item }) => (
          <View
            style={[
              styles.tripItem,
              { backgroundColor: Colors[colorScheme ?? 'light'].altBackground },
            ]}
          >
            <RNView style={{ flex: 1 }}>
              <Text style={styles.tripTitle}>{item.name}</Text>
              <Text style={styles.tripDate}>
                {new Date(item.startDate).toLocaleDateString()}
                {item.endDate && item.endDate !== item.startDate
                  ? `–${new Date(item.endDate).toLocaleDateString()}`
                  : ''}
              </Text>
            </RNView>

            <RNView style={styles.buttons}>
              <Button
                title="Tiedot"
                color={Colors[colorScheme ?? 'light'].tint}
                onPress={() => router.push(`/trip-details?tripId=${item.id}`)}
              />

              <TouchableOpacity onPress={() => handleDeleteTrip(item.id)}>
                <FontAwesome name="trash-o" size={20} color="grey" />
              </TouchableOpacity>
            </RNView>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  tripDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
});
