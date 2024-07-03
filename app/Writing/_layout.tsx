import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import 'react-native-reanimated';

export default function WritingLayout() {
    return (
        <Stack screenOptions={{
            headerLeft: () => {
                return (
                    <Pressable className={"pr-5"} onPress={() => {
                        router.back()
                    }}>
                        <Ionicons name='arrow-back' size={30} />

                    </Pressable>
                )
            },

        }}>
            <Stack.Screen name="index" options={{
                headerShown: true, title: "Write & Improve"
            }} />
            <Stack.Screen name="cat" options={{ headerShown: true, title: "Task", headerBackTitleVisible: false }} />
            <Stack.Screen name="Write & Improve" options={{
                headerShown: true, title: "Write", headerBackTitleVisible: false
            }} />
        </Stack>
    );
}
