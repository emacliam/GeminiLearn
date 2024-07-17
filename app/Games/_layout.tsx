import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import 'react-native-reanimated';

export default function GamesLayout() {
    return (
        <Stack
            screenOptions={{
                headerLeft: () => {
                    return (
                        <Pressable className={"pr-5"}
                            onPress={() => {
                                router.back()
                            }}>
                            <Ionicons name='arrow-back' size={30} />
                        </Pressable>
                    )
                }
            }}>
            <Stack.Screen name="index" options={{ headerShown: true, title: "Games" }} />
            <Stack.Screen name="wheel" options={{ title: "Spinning The Wheel", headerShown: true }} />
            <Stack.Screen name="cross" options={{ title: "Cross Word", headerShown: true }} />
            <Stack.Screen name="crossIndex" options={{ title: "Cross Word", headerShown: true }} />
            <Stack.Screen name="wordCoach" options={{ title: "Word Coach", headerShown: true }} />
            <Stack.Screen name="wordCoachIndex" options={{ title: "Word Coach", headerShown: true }} />
            <Stack.Screen name="wordleIndex" options={{ title: "Wordle", headerShown: true }} />
            <Stack.Screen name="wordle" options={{ title: "Wordle", headerShown: true }} />
            <Stack.Screen name="sentenceConstruction" options={{ title: "Construct", headerShown: true }} />
            <Stack.Screen name="sentenceConstructionIndex" options={{ title: "Sentence Construction", headerShown: true }} />

        </Stack>
    );
}
