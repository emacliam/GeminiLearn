import { Image, StyleSheet, Platform, Pressable, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';

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
import { Text, XStack, YStack, View } from 'tamagui';
import LottieView from 'lottie-react-native';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';


export default function Speak() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const params = useLocalSearchParams()
    const animation = useRef(null)
    const { state, startRecognizing, stopRecognizing, cancelRecognizing, destroyRecognizing } = useVoiceRecognition()
    const [history, setHistory] = useState([])
    const [speaking, setSpeaking] = useState(false)


    const speak = (word) => {
        setSpeaking(true)
        Speech.speak(word, {
            onDone: () => {
                setSpeaking(false)
            }
        });
    }

    const stopSpeaking = () => {
        Speech.stop()
        setSpeaking(false)
    }


    const [availableVoices, setAvailableVoices] = useState([])
    useEffect(() => {
        (async () => {
            const voices = await Speech.getAvailableVoicesAsync()
            setAvailableVoices(voices)
        })()
    }, [])

    const ask1 = async () => {
        try {
            setGenerating(true)
            setResponse("")
            const msg = `${state.results}, Note: Remove emojis or any special characters`
            var response = ""
            if (history.length > 0) {
                response = await ask.multiconvo(history, msg)
            } else {
                const data = {
                    text: msg
                }

                let res = await ask.request(data)
                response = res.response.text()
            }
            console.log(response)
            setResponse(response)
            setGenerating(false)
            setHistory((prev) => [...prev, {
                role: "user",
                parts: [{
                    "text": msg
                }]
            }, {
                role: "model",
                parts: [{
                    "text": response
                }]
            }])
            destroyRecognizing()
            speak(response)
        } catch (error) {
            console.log(error)
        }
    }






    return (
        <View >

            <YStack justifyContent='space-between' alignItems='center' className="h-full py-10 bg-white ">
                <XStack className='items-center '>
                    <View className={"h-0 border-[1px] border-blue-600 flex-1"}></View>
                    <View className="items-center px-2 text-center border-2 border-blue-600 rounded-full">
                        {state.isRecording && <Text fontSize={16} m={10} color={"$black"} fontFamily={"NunitoMedium"}>Go ahead i'm listening</Text>}
                        {state.isRecording == false && <Text fontSize={16} m={10} color={"$black"} fontFamily={"NunitoMedium"}>Press and Hold the mic</Text>}
                    </View>

                    <View className={"h-0 border-[1px] flex-1 border-blue-600"}></View>
                </XStack>
                <View className="flex-1" ai={"center"}>
                    {speaking ? <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                            width: 300,
                            height: 300,
                            backgroundColor: "white",

                        }}
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={require("../../../assets/animations/geminitalk.json")}
                    /> : <LottieView
                        ref={animation}
                        style={{
                            width: state.isRecording ? 200 : 300,
                            height: state.isRecording ? 200 : 300,
                            backgroundColor: "white",

                        }}
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={require("../../../assets/animations/geminiTalk2.json")}
                    />}

                    <View className="">
                        <Text ai={"center"} fontSize={25} m={10} color={"$black"} fontFamily={"NunitoBold"}>{state.results}</Text>
                    </View>

                </View>
                <View className={"w-full px-10"}>
                    <XStack justifyContent='center'>
                        {speaking == false && <Pressable
                            onPressIn={() => {
                                startRecognizing()
                                animation.current?.play()
                            }}
                            onPressOut={() => {
                                stopRecognizing()
                                animation.current?.reset();

                                if (state.results.length > 0) {
                                    ask1()
                                }
                            }}
                        >
                            <Ionicons name="mic-circle" size={60} color={"blue"} />
                        </Pressable>}
                        {speaking && <Pressable onPress={() => {
                            stopSpeaking()
                        }}>
                            <Ionicons name='close-circle-outline' size={60} color={"blue"} />
                        </Pressable>}
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

