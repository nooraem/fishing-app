import React, { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import { TextInput, Button, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveCatch } from '@/lib/storage';
import { Trip, Catch } from '@/lib/types';
import { getTripById } from '@/lib/storage';
import uuid from 'react-native-uuid';
import DropDownPicker from 'react-native-dropdown-picker';
import { fishSpecies } from '@/lib/species';


export default function AddCatchScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [species, setSpecies] = useState('');
  const [lengthCm, setLengthCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [speciesItems, setSpeciesItems] = useState(
    fishSpecies.map((fish) => ({ label: fish, value: fish }))
  );


  useEffect(() => {
    requestPermissions();
    if (tripId) {
      (async () => {
        const data = await getTripById(tripId);
        setTrip(data || null);
      })();
    }
  }, [tripId]);

  const requestPermissions = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    await Location.requestForegroundPermissionsAsync();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const handleSaveCatch = async () => {
    if (!tripId || !species.trim()) {
      Alert.alert('Missing Data', 'Species is required.');
      return;
    }

    const newCatch: Catch = {
      id: uuid.v4().toString(),
      species,
      lenghtCm: parseFloat(lengthCm) || undefined,
      weightKg: parseFloat(weightKg) || undefined,
      photoUri: imageUri || undefined,
      location: location || undefined,
    };

    await saveCatch(tripId, newCatch);
    router.push(`/trip-details?tripId=${tripId}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Add a new catch to:</Text>
      { trip 
      ? <>
          <Text style={styles.title}>{trip.name}</Text>
          <Text style={styles.subTitle}>
            {new Date(trip.startDate).toLocaleDateString()}
            {(trip.endDate !== trip?.startDate) 
            ? `–${new Date(trip!.endDate).toLocaleDateString()}`
            : ''
            }
          </Text>
        </>
      : ''
      }
        <View style={styles.form}>
        <View style={{ zIndex: 1000 }}>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={species}
            setValue={setSpecies}
            items={speciesItems}
            setItems={setSpeciesItems}
            placeholder='Valitse laji...'
            searchPlaceholder='Hae...'
            searchPlaceholderTextColor='#B7B7A4'
            listMode='MODAL'
            modalProps={{
              animationType: "slide"
            }}
            searchable={true}
            style={styles.input}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Length (cm)"
          value={lengthCm}
          onChangeText={setLengthCm}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          value={weightKg}
          onChangeText={setWeightKg}
          keyboardType="numeric"
        />

        <Button title="Add Photo" color='#A5A58D'  onPress={pickImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        <Button title="Add Location" color='#A5A58D' onPress={getLocation} />
        {location && (
          <View style={styles.location}>
            <Button
              title={`Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`}
              disabled
            />
          </View>
        )}

        <Button title="Save Catch" color='#6B705C' onPress={handleSaveCatch} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6B705C',
  },
  subTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#6B705C',
    marginBottom: 10,
  },
  form: {
    gap: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#B7B7A4',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    borderRadius: 4,
    borderColor: '#B7B7A4',
    borderWidth: 1,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B7B7A4',
    padding: 13,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  location: {
    marginVertical: 10,
    alignItems: 'center',
  },
});
