import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Task } from '@/types/interfaces';
import React, { useCallback, useState } from 'react'
import { Link, Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import TaskListItem from '@/components/TaskListItem';
const Page= () => {
    const {id} = useLocalSearchParams<{id: string}>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [locationName, setLocationName] = useState<string>('');

    const loadLocationData = useCallback(async () => {
        const [location] = await db.getAllAsync<{name: string}>('SELECT * FROM locations WHERE id = ?', [Number(id)]);
        console.log('🚀 ~ loadLocationData ~ location:', location);
        if(location) {
            setLocationName(location.name);
        }

        //Load tasks
        const tasks = await db.getAllAsync<Task>('SELECT * FROM tasks WHERE locationId = ?', [
            Number(id),
        ]);
        setTasks(tasks);
    }, [id, db])

    useFocusEffect(
        useCallback(() => {
            loadLocationData();
        }, [loadLocationData])
    )
    
    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ title: locationName || 'Tasks' }} />
            <FlatList 
            ListEmptyComponent={<Text>No Tasks Found</Text>}
            data={tasks} 
            renderItem={({item}) => <TaskListItem task={item} />} 
            />
            <Link href={`/location/${id}/new-task`} asChild>
                <TouchableOpacity style={styles.fab}>
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}

export default Page;

const styles = StyleSheet.create({
    fab:{
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#F2A310',
        borderRadius: 28,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
    },
    fabText:{
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    }
});