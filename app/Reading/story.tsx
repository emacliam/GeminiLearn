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

export default function Story() {
    const insets = useSafeAreaInsets()
    const [generating, setGenerating] = useState(false)
    const { response } = useLocalSearchParams()



    return (
        <View >
            <ScrollView
                className="px-4 pt-10 bg-white"
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                style={{ height: '100%' }}

            >
                <Markdown style={styles} >
                    {response}
                </Markdown>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        fontFamily: "Nunito",
        fontSize: 17
    },
    heading1: {
        textDecorationLine: "underline",
        fontFamily: "NunitoBlack"
    },

    heading2: {
        textDecorationLine: "underline",
        fontFamily: "NunitoBold"
    }
})

