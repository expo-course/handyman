import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import { Location } from '@/types/interfaces';
import LocationForm from '@/components/LocationForm';
import LocationListItem from '@/components/LocationListItem';

const Page = () => {
const db = useSQLiteContext();
const [locations, setLocations] = useState<Location[]>([]);

useEffect(() => {
  loadLocations();
}, []);

const loadLocations = async () => {
  const locations = await db.getAllAsync<Location>('SELECT * FROM locations');
  setLocations(locations);
  console.log(locations);
};

const addLocation = async (name: string) => {
  await db.runAsync('INSERT INTO locations (name) VALUES (?)', name);
  loadLocations();
};

  return (
    <View style={styles.container}>
      <LocationForm onSubmit={addLocation} />
        <FlatList 
        data={locations}
        renderItem={({item}) => <LocationListItem location={item} onDelete={loadLocations}/>}
        ListEmptyComponent={<Text>No locations added yet</Text>}
        />

    </View>
  )
}

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

