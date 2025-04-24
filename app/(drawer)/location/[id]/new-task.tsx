import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const Page = () => {
    const {id: locationId, taskId} = useLocalSearchParams();
    console.log('🚀 ~ Page ~ locationId:', locationId);
    console.log('🚀 ~ Page ~ taskId:', taskId);
  return (
    <View>
      <Text>new-task</Text>
    </View>
  )
}

export default Page;
const styles = StyleSheet.create({})
