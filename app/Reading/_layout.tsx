import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import 'react-native-reanimated';

export default function ReadingLayout() {
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
            <Stack.Screen name="index" options={{ headerShown: true }} />
            <Stack.Screen name="story" options={{ headerShown: false }} />
        </Stack>
    );
}
