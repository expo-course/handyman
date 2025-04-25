import { View, Text, StyleSheet, TextInput, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
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
        let newTaskId: 
        Number;
        if (taskId) {
            //UPDATE
        } else {
            // INSERT
        }
    };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder='Title' value={title} onChangeText={setTitle} />
      <TextInput 
      style={[styles.input, styles.multilineInput]} 
      placeholder='Description' 
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
    }
})
