import { View, Text } from 'react-native'
import { StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
const Page= () => {
    const {id} = useLocalSearchParams();
  return (
    <View>
      <Text>My Id: {id}</Text>
    </View>
  )
}

export default Page;

const styles = StyleSheet.create({});