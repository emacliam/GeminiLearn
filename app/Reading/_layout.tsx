import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import 'react-native-reanimated';

export default function ReadingLayout() {
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
            <Stack.Screen name="index" options={{ title: "Reading", headerShown: true }} />
            <Stack.Screen name="story" options={{ title: "Story", headerShown: true }} />
        </Stack>
    );
}
