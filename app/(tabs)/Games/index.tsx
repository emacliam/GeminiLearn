import { Image, StyleSheet, Platform, View, Pressable, Text, ScrollView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ask from '@/services/Ask/ask';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import * as Speech from 'expo-speech';

export default function HomeScreen() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState("")

    const ask1 = async () => {
        try {
            const response = await ask.request()
            console.log("kkkkkk", response.data.candidates[0].content.parts[0].text)
            setResponse(response.data.candidates[0].content.parts[0].text)
        } catch (error) {
            console.log(error)
        }
    }

    const speak = () => {
        Speech.speak(response);
    }

    const stopSpeaking = () => {
        Speech.stop()
    }


    const [availableVoices, setAvailableVoices] = useState(null)
    useEffect(() => {
        (async () => {
            const voices = await Speech.getAvailableVoicesAsync()
            setAvailableVoices(voices)
        })()
    }, [])

    return (
        <View className="px-4" style={{ top: insets.top }}>
            <Pressable onPress={() => {
                ask1()
            }}>
                <Text>
                    Get Sample data
                </Text>
            </Pressable>
            <Pressable onPress={() => {
                speak()
            }}>
                <Text>
                    Speak
                </Text>
            </Pressable>
            <Pressable onPress={() => {
                stopSpeaking()
            }}>
                <Text>
                    Stop
                </Text>
            </Pressable>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={{ height: '100%' }}
            >
                <Markdown>
                    {response}
                </Markdown>
            </ScrollView>



        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
