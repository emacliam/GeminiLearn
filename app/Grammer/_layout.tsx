import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function GrammerLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="notes" options={{ headerShown: false }} />
        </Stack>
    );
}
