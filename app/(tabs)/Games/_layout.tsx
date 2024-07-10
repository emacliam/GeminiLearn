import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function GamesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: true, title: "Games" }} />
            <Stack.Screen name="wheel" options={{ title: "Spinning the wheel", headerShown: true }} />
            <Stack.Screen name="cross" options={{ title: "Cross Word", headerShown: true }} />
            <Stack.Screen name="wordCoach" options={{ title: "Word Coach", headerShown: true }} />
        </Stack>
    );
}
