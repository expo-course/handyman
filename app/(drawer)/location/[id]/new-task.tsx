import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Task } from '../../../../types/interfaces';

const Page = () => {
    const {id: locationId, taskId} = useLocalSearchParams<{
        id: string,
        taskId: string
    }>();
    const router = useRouter();
    const db = useSQLiteContext();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    
    const stackTitle = taskId ? 'Edit Task' : 'New Task';

    useEffect(() => {
        if (taskId) {
            loadTaskData();
        }
    }, [taskId]);


    const loadTaskData = async () => {
        const task = await db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', [Number(taskId)]);
        if(task) {
            setTitle(task.title);
            setDescription(task.description);
            setIsUrgent(task.isUrgent);
            setImageUri(task.imageUri || null);
        }
    }

    const handleSaveTask = async () => {
        if (taskId) {
            //UPDATE
            await db.runAsync('UPDATE tasks SET title = ?, description = ?, isUrgent = ?, imageUri = ? WHERE id = ?', [title, description, isUrgent, imageUri, Number(taskId)]);
        } else {
            // INSERT
            await db.runAsync('INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)', [title, description, isUrgent, Number(locationId)]);
        }
        router.back();
    };

  return (
    <View style={styles.container}>
    <Stack.Screen options={{ title: stackTitle }} />
      <TextInput style={styles.input} placeholder='Title' placeholderTextColor='#ccc' value={title} onChangeText={setTitle} />
      <TextInput 
      style={[styles.input, styles.multilineInput]} 
      placeholder='Description' 
      placeholderTextColor='#ccc'
      value={description} 
      onChangeText={setDescription} 
      multiline
      />
      <View style={styles.row}>
        <Text>Urgent</Text>
        <Switch value={isUrgent} onValueChange={setIsUrgent}
        trackColor={{
            true: '#F2A310',
            false: '#76577',
        }}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSaveTask}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
    </View>
  )
}

export default Page;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#F2A310',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    }
})
