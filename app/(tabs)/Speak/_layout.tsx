import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function SpeakLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: true, title: "Speak to Gemini" }} />
        </Stack>
    );
}
