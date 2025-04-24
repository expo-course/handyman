import React, { useEffect, useState } from 'react'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';
import { View, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, useDrawerStatus } from '@react-navigation/drawer';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { Location } from '@/types/interfaces';
import Logo from '@/assets/images/logo.png';
import { Text } from 'react-native';
import { router } from 'expo-router';

// const db = SQLite.openDatabaseSync('reports.db');

const LOGO_IMAGE = Logo;



const Layout = () => {
  //useDrizzleStudio(db);
  

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const isDrawerOpen = useDrawerStatus() === 'open';
  const pathname = usePathname();

  useEffect(() => {
    if (isDrawerOpen) {
      loadLocations();
    }
  }, [isDrawerOpen]);
  
  const loadLocations = async () => {
    const locations = await db.getAllAsync<Location>('SELECT * FROM locations');
    setLocations(locations);
  };

  return (
    <View style={{ flex:1, paddingBottom: bottom }}>
      <DrawerContentScrollView>
        <Image 
        source={LOGO_IMAGE} 
        style={styles.logo} />
        <View style={styles.locationsContainer}>
          <DrawerItemList {...props} />
          <Text style={styles.title}>Locations</Text>
          {locations.map((location) => {
            const isActive = pathname === `/location/${location.id}`;
            return (
               <DrawerItem
               key={location.id}
               label={location.name}
               onPress={() => router.navigate({
                 pathname: '/location/[id]',
                 params: { id: location.id.toString() }
               })}
               focused={isActive}
               activeTintColor={isActive ? '#F2A310' : '#000'}
               />
            )
          })}
        </View>       
      </DrawerContentScrollView>
      <View style={{
        paddingBottom: 20 + bottom,
        borderTopWidth: 1,
        borderTopColor: '#dde3fe',
        padding: 16,
      }}>
        <Text style={{ color: '#a6a6a6' }}>Copyright Galaxies 2024</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: { 
    width: 100, 
    height: 100, 
    marginBottom: 20, 
    alignSelf: 'center' 
  },
  locationsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    paddingTop: 24,
    color: '#a6a6a6'
  },
});

return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer
    drawerContent={CustomDrawerContent}
    screenOptions={{
      drawerHideStatusBarOnOpen: true,
      drawerActiveTintColor: '#F2A310',
      headerTintColor: '#000',
    }}>
      <Drawer.Screen 
        name="index" 
        options={{
          title: 'Manage Locations',
        }} 
      />
      <Drawer.Screen 
        name="location" 
        options={{
          title: 'Location',
          headerShown: false,
          drawerItemStyle: {
            display: 'none',
          },
        }} 
      />
    </Drawer>
  </GestureHandlerRootView>
);
};

export default Layout;
