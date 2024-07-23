import { Image, StyleSheet, Platform, Pressable, ScrollView, TextInput, KeyboardAvoidingView, PermissionsAndroid } from 'react-native';
import ask from '@/services/Ask/ask';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import * as Speech from 'expo-speech';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, View, Button } from 'tamagui';
import LottieView from 'lottie-react-native';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { moderateVerticalScale } from 'react-native-size-matters';
import rmd from "remove-markdown";
import { Audio } from 'expo-av';




export default function Speak() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const params = useLocalSearchParams()
    const animation = useRef(null)
    const { state, startRecognizing, stopRecognizing, cancelRecognizing, destroyRecognizing } = useVoiceRecognition()
    const [history, setHistory] = useState([])
    const [speaking, setSpeaking] = useState(false)



    useEffect(() => {
        const requestPermissions = async () => {

            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Voice Recognition Permission',
                        message: 'This app needs access to your microphone to recognize speech.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('RECORD_AUDIO permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        };

        requestPermissions();
    }, []);

    useEffect(() => {
        if (state.results.length > 0) {
            stopRecognizing()
            ask1()
        }
    }, [state.results]);






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
        animation.current?.reset();
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
            const msg = `${state.results[0]}, Note: Remove emojis or any special characters from your response`
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
            const plain = rmd(response, {
                stripListLeaders: true,
                listUnicodeChar: '',
                gfm: true,
                useImgAltText: true
            })
            speak(plain.replace(/[*_~`]/g, '').trim())
        } catch (error) {
            console.log(error)
        }
    }





    return (
        <View pb={moderateVerticalScale(60)} bg={"white"}>

            <YStack justifyContent='space-between' alignItems='center' className="h-full py-10 ">
                <XStack className='items-center '>
                    <View className={"h-0 border-[1px] border-black-600 flex-1"}></View>
                    <View className="items-center px-2 text-center bg-black border-2 rounded-full">
                        {state.isRecording && <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoMedium"}>Go ahead speak i'm listening</Text>}
                        {state.isRecording == false && generating == false && speaking == false && <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoMedium"}>Press and Start Speaking</Text>}
                        {generating && <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoMedium"}>Getting response</Text>}
                        {speaking && <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoMedium"}>AI is speaking</Text>}
                    </View>

                    <View className={"h-0 border-[1px] flex-1 border-black-600"}></View>
                </XStack>
                {state.isRecording && <Text fontSize={16} m={10} color={"black"} fontFamily={"NunitoMedium"}>Press Stop when you are done speaking</Text>}
                {state.isRecording && <Text fontSize={16} m={10} color={"black"} fontFamily={"NunitoMedium"}>If you pose for a long time, i will stop listening </Text>}


                <View className="flex-1" ai={"center"}>
                    {speaking && <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                            width: 300,
                            height: 300,
                            backgroundColor: "white",
                        }}
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={require("../../../assets/animations/geminitalk.json")}
                    />}
                    {generating && <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                            width: 200,
                            height: 200,
                            backgroundColor: "white",
                        }}
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={require("../../../assets/animations/geminiTalk2.json")}
                    />}
                    <View className="">
                        <Text ai={"center"} fontSize={25} m={10} color={"black"} fontFamily={"NunitoBold"}>{state.results[0]}</Text>
                    </View>

                </View>
                <View className={"w-full px-10"}>
                    <XStack justifyContent='center'>
                        {speaking == false && state.isRecording == false && generating == false && <XStack>
                            <Pressable
                                onPressIn={() => {
                                    startRecognizing()
                                }}
                            >
                                <YStack gap={1} alignItems='center'>
                                    <Ionicons name="mic-circle-outline" size={80} color={"#098756"} />
                                    <Text ai={"center"} fontSize={25} color={"#098756"} fontFamily={"NunitoBold"}>Start</Text>
                                </YStack>
                            </Pressable>


                        </XStack>}

                        {speaking == false && state.isRecording == true && <XStack>
                            <Pressable

                                onPressIn={() => {
                                    cancelRecognizing()
                                    stopRecognizing()
                                    destroyRecognizing()
                                }}
                            >
                                <View className="px-4 py-1 border-4 border-[#ff0002] rounded-full">
                                    <Text ai={"center"} fontSize={25} color={"#ff0002"} fontFamily={"NunitoBold"}>Stop</Text>
                                </View>
                            </Pressable>


                        </XStack>}
                        {speaking && <Pressable onPress={() => {
                            stopSpeaking()
                        }}>
                            <Ionicons name='close-circle-outline' size={80} color={"#098756"} />
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
        fontFamily: "NunitoMedium",
        fontSize: 17,
    }
})

