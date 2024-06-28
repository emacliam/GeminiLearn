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
import { useLocalSearchParams } from 'expo-router';

export default function Notes() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const params = useLocalSearchParams()

    const ask1 = async (data: any) => {
        try {
            const response = await ask.request(data)
            console.log("kkkkkk", response.response.text())
            setResponse(response.response.text())
            setGenerating(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setGenerating(true)
        ask1({
            text: `Generate a lot of comprehensive notes on this topic to read: ${params.name}`
        })
    }, [])




    return (
        <View >
            <ScrollView
                className="px-4 pt-10"
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                style={{ height: '100%' }}
            >
                {generating && <View className="flex-col items-center justify-center flex-1 h-screen">
                    <Text >
                        Generating notes on {params.name} from Gemini
                    </Text></View>}
                {generating == false && <Markdown style={styles} >
                    {response}
                </Markdown>}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

})

