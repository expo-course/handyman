import { View, Text } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{
        headerLeft: () => (
          <View style={{marginLeft: -16}}>
            <DrawerToggleButton tintColor="#000" />
          </View>
        ),
      }} />
    </Stack>
  )
}

export default Layout;