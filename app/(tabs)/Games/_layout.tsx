import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function GamesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: true, title: "Games" }} />
        </Stack>
    );
}
