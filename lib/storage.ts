import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip, Catch } from '../lib/types';

const STORAGE_KEY = 'fishing-trips';

// Get all trips
export async function getTrips(): Promise<Trip[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
};

// Save a new trip
export async function saveTrip(trip: Trip): Promise<void> {
  const trips = await getTrips(); // Get existing trips
  trips.push(trip); // Add the new trip
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips)); // Save updated list
};

// Get a trip by Id
export async function getTripById(tripId: string): Promise<Trip | undefined> {
  const trips = await getTrips();
  return trips.find((trip) => trip.id === tripId);
};

// Remove a trip by Id
export async function removeTrip(tripId: string): Promise<void> {
  const trips = await getTrips();
  const filteredTrips = trips.filter(trip => trip.id !== tripId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTrips));
}

// Add a new catch to a trip
export async function saveCatch(tripId: string, newCatch: Catch): Promise<void> {
  const trips = await getTrips();

  const updatedTrips = trips.map((trip) => {
    if (trip.id === tripId) {
      const updatedCatches = trip.catches ? [...trip.catches, newCatch] : [newCatch];
      return { ...trip, catches: updatedCatches };
    }
    return trip;
  });

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
}

// Remove a catch from a trip
export async function removeCatch(tripId: string, catchId: string): Promise<void> {
  const trips = await getTrips();

  const updatedTrips = trips.map(trip => {
    if (trip.id === tripId) {
      return {
        ...trip,
        catches: trip.catches?.filter(c => c.id !== catchId) || [],
      };
    }
    return trip;
  });

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
}
