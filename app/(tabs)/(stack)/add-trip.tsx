import { TextInput, Button, StyleSheet, Platform, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { saveTrip } from '@/lib/storage';
import { useRouter } from 'expo-router';
import { Trip } from '@/lib/types';
import { Text, View } from '@/components/Themed';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTripScreen() {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const router = useRouter();

  const handleAddTrip = async () => {
    if (!name.trim()) {
      Alert.alert('Puuttellinen nimi', 'Anna reissun nimi/sijainti.');
      return;
    }

    if (endDate < startDate) {
      Alert.alert('Virheellinen päivämäärä', 'Loppupäivä ei voi olla ennen alkupäivää.');
      return;
    }

    const newTrip: Trip = {
      id: new Date().toISOString(),
      name,
      startDate: startDate,
      endDate: endDate,
      notes,
      catches: [],
    };

    await saveTrip(newTrip);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nimi / sijainti</Text>
      <TextInput
        style={styles.input}
        placeholder='esim. "Lappeenranta", "Juhannus", ...'
        placeholderTextColor="#6B705C"
        value={name}
        onChangeText={setName}
      />
      

      <View style={styles.datesContainer}>
        <View style={styles.date}>
          <Text style={styles.label}>Alku päivämäärä</Text>
          <Pressable onPress={() => setShowStartPicker(true)} style={styles.input}>
            <Text style={styles.placeholder}>{startDate.toLocaleDateString()}</Text>
          </Pressable>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.date}>
          <Text style={styles.label}>Loppu päivämäärä</Text>
          <Pressable onPress={() => setShowEndPicker(true)} style={styles.input}>
            <Text style={styles.placeholder}>{endDate.toLocaleDateString()}</Text>
          </Pressable>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </View>
      </ View>

      <Text style={styles.label}>Muistiinpanot / muut huomiot</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="(valinnainen)"
        placeholderTextColor="#6B705C"
        value={notes}
        multiline={true}
        onChangeText={setNotes}
      />

      <Button title="Tallenna reissu" color="#6B705C" onPress={handleAddTrip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  datesContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  date: {
    width: '100%',
    flexShrink: 1,
  },
  label: {
    marginBottom: 4,
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    height: 40,
    borderColor: '#B7B7A4',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top', 
    borderColor: '#B7B7A4',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  placeholder: {
    color: '#6B705C',
  }
});
