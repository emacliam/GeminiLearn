import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function WritingLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: true, title: "Write & Improve" }} />
            <Stack.Screen name="cat" options={{ headerShown: true, title: "Task", headerBackTitleVisible: false }} />
            <Stack.Screen name="write" options={{ headerShown: true, title: "Write & Improve", headerBackTitleVisible: false }} />
        </Stack>
    );
}
