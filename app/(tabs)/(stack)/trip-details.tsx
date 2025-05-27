import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Image, SectionList, Button, Alert, TouchableOpacity, View as RNView } from "react-native";
import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, router } from "expo-router";
import { getTripById, removeCatch } from "@/lib/storage";
import { Trip, Catch } from "@/lib/types";
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from "@/constants/Colors";

export default function TripDetailsScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const colorScheme = useColorScheme();

  const loadTrip = async () => {
    if (!tripId) return;
    const data = await getTripById(tripId);
    setTrip(data || null);
  };

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const handleRemoveCatch = async (catchId: string) => {
    if (!trip?.id) return;

    Alert.alert("Poista", "Haluatko varmasti poistaa kalan?", [
      { text: "Peruuta", style: "cancel" },
      {
        text: "Poista",
        style: "destructive",
        onPress: async () => {
          await removeCatch(trip.id, catchId);
          await loadTrip();
        },
      },
    ]);
  };

  const groupedSections = useMemo(() => {
    if (!trip?.catches || trip.catches.length === 0) return [];

    const groups: Record<string, Catch[]> = {};
    trip.catches.forEach((c) => {
      const key = c.species;
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b)) // aakkosjärjestykseen
      .map(([title, data]) => ({ title, data }));
  }, [trip?.catches]);

  return (
    <View style={styles.container}>
      { trip
      ? <>
        <Text>
          {new Date(trip.startDate).toLocaleDateString()}
          {(trip.endDate !== trip.startDate)
            ? `–${new Date(trip.endDate).toLocaleDateString()}`
            : ''}
        </Text>
        <Text style={styles.title}>{trip?.name}</Text>
        {trip?.notes && <Text style={styles.notes}>{trip.notes}</Text>}
        </>
      : ''
      }
      <Button
        title="Uusi kala"
        color={Colors[colorScheme ?? 'light'].tint}
        onPress={() => router.push({ pathname: "/add-catch", params: { tripId } })}
      />

      <Text style={styles.sectionTitle}>Kalat</Text>

      {groupedSections.length > 0 ? (
        <SectionList
          sections={groupedSections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.groupTitle}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <CatchRow
              catchItem={item}
              onRemove={() => handleRemoveCatch(item.id)}
            />
          )}
        />
      ) : (
        <Text style={styles.noCatches}>Et ole vielä lisännyt kaloja.</Text>
      )}
    </View>
  );
}

function CatchRow({
  catchItem,
  onRemove,
}: {
  catchItem: Catch;
  onRemove: () => void;
}) {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.catch, { backgroundColor: Colors[colorScheme ?? 'light'].altBackground }]}>
      <RNView style={styles.xsContainer}>
      {catchItem.photoUri 
        ? <Image source={{ uri: catchItem.photoUri }} style={styles.catchImage} />
        : <FontAwesome name="picture-o" size={20} color="#B7B7A4" /> 
      }
      </RNView>

      <RNView style={styles.catchInfo}>
        <RNView style={styles.catchRow}>
          <Text>{catchItem.weightKg !== undefined ? (catchItem.weightKg.toFixed(3)) : '* '}kg</Text>
          <Text>{catchItem.lenghtCm !== undefined ? (catchItem.lenghtCm.toFixed(2)) : '* '}cm</Text>
        </RNView>

        {catchItem.location?.latitude && (
          <RNView style={styles.catchRow}>
            {catchItem.location && (
              <Text style={styles.locationText}>
                <FontAwesome name="map-marker"/>  {catchItem.location.latitude}, {catchItem.location.longitude}
              </Text>
            )}
          </RNView>
        )}
      </RNView>
        
      <RNView style={styles.xsContainer}>
        <TouchableOpacity onPress={onRemove}>
          <FontAwesome name="trash-o" size={20} color="grey" />
        </TouchableOpacity>
      </RNView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    marginBottom: 10,
    fontSize: 22,
    fontWeight: "500",
  },
  notes: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "500",
  },
  noCatches: {
    marginTop: 10,
    fontStyle: "italic",
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 6,
  },
  catch: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
    marginBottom: 15,
  },
  catchImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: '',
  },
  catchInfo: {
    width: "76%",
    flexDirection: "column",
    padding: 10,
    gap: 4,
    backgroundColor: '',
  },
  catchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: '',
  },
  locationText: {
    fontSize: 12,
  },
  xsContainer: {
    width: "12%",
    backgroundColor: '',
    alignItems: 'center'
  },
});
