import React from 'react'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('reports.db');

const Layout = () => {
  useDrizzleStudio(db);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{
        drawerHideStatusBarOnOpen: true,
        drawerActiveTintColor: '#F2A310',
        headerTintColor: '#000',
      }}>
        <Drawer.Screen 
          name="index" 
          options={{
            title: 'Home',
          }} 
        />
        <Drawer.Screen 
          name="location" 
          options={{
            title: 'Manage Locations',
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default Layout;