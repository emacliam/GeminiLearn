import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import 'react-native-reanimated';

export default function GrammerLayout() {
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
            }
        }}>
            <Stack.Screen name="index" options={{ title: "Grammer", headerShown: true }} />
            <Stack.Screen name="notes" options={{ title: "Notes", headerShown: true }} />
            <Stack.Screen name="test" options={{ title: "Test", headerShown: true }} />
            <Stack.Screen name="testResults" options={{ title: "Results", headerShown: true }} />


        </Stack>
    );
}
