import React from 'react';
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center'
      }}
    >
      <Stack.Screen
        name="add-catch"
        options={{
          title: 'Lisää uusi kala',
        }}
      />
      <Stack.Screen
        name="trip-details"
        options={{
          title: 'Reissun tiedot',
        }}
      />
      <Stack.Screen
        name="add-trip"
        options={{
          title: 'Lisää uusi reissu',
        }}
      />
    </Stack>
  );
}
