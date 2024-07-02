import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import 'react-native-reanimated';

export default function ListenLayout() {
    return (
        <Stack screenOptions={{
            headerLeft: () => {
                return (

                    <Pressable onPress={() => {
                        router.back()

                    }}>
                        <Ionicons name='chevron-back' size={30} />


                    </Pressable>
                )
            }
        }}>
            <Stack.Screen name="index" options={{ title: "Listening", headerShown: true }} />
            <Stack.Screen name="sentences" options={{ title: "Sentences", headerShown: true }} />
            <Stack.Screen name="words" options={{ title: "Words", headerShown: true }} />
        </Stack>
    );
}
