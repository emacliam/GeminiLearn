import { Image, StyleSheet, Platform, View, Pressable, Text, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ask from '@/services/Ask/ask';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import * as Speech from 'expo-speech';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import Loading from '@/components/Loading';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { XStack, YStack } from 'tamagui';
import LottieView from 'lottie-react-native';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

export default function Speak() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const params = useLocalSearchParams()
    const animation = useRef(null)
    const { state, startRecognizing, stopRecognizing, cancelRecognizing, destroyRecognizing } = useVoiceRecognition()



    return (
        <View >

            <YStack justifyContent='space-between' alignItems='center' className="h-full py-10 bg-white ">
                <XStack className='items-center '>
                    <View className={"h-0 border-[1px] border-blue-600 flex-1"}></View>
                    <View className="items-center px-2 text-center border-2 border-blue-600 rounded-full">
                        <Text>Go ahead i'm listening</Text>
                        <Text>Press and Hold the mic</Text>
                    </View>
                    <View className={"h-0 border-[1px] flex-1 border-blue-600"}></View>
                </XStack>
                <View>
                    <LottieView
                        ref={animation}
                        style={{
                            width: 300,
                            height: 300,
                            backgroundColor: "white",

                        }}
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={require("../../../assets/animations/geminiTalk2.json")}
                    />
                    <Text>{JSON.stringify(state, null, 2)}</Text>

                </View>
                <View className={"w-full px-10"}>
                    <XStack justifyContent='space-between'>
                        <Pressable onPressIn={() => {
                            startRecognizing()
                        }}
                            onPressOut={() => {
                                stopRecognizing()
                            }}
                        >
                            <Ionicons name="mic-circle" size={50} color={"blue"} />
                        </Pressable>
                        <Pressable>
                            <Ionicons name='close-circle-outline' size={50} color={"blue"} />
                        </Pressable>
                    </XStack>
                </View>
            </YStack>




        </View >
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    body: {
        fontFamily: "Nunito",
        fontSize: 17,
    }
})

