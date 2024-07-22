import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function SpeakLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: true, title: "Speech Practice" }} />
            <Stack.Screen name="transcribe" options={{ headerShown: true, title: "Transcribe" }} />
            <Stack.Screen name="speak" options={{ headerShown: true, title: "Speak To Gemini" }} />

        </Stack>
    );
}
