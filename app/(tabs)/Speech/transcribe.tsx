import { Image, StyleSheet, Platform, Pressable, ScrollView, TextInput, KeyboardAvoidingView, PermissionsAndroid, Dimensions } from 'react-native';

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
import { Text, XStack, YStack, View, Button } from 'tamagui';
import LottieView from 'lottie-react-native';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { moderateVerticalScale } from 'react-native-size-matters';
import rmd from "remove-markdown";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import ActionSheet from "react-native-actions-sheet";



export default function Speak() {
    const insets = useSafeAreaInsets()

    const [generating, setGenerating] = useState(false)
    const params = useLocalSearchParams()
    const animation = useRef(null)
    const { state, startRecognizing, stopRecognizing, cancelRecognizing, destroyRecognizing } = useVoiceRecognition()
    const [history, setHistory] = useState([])
    const [speaking, setSpeaking] = useState(false)
    const [recording, setRecording] = useState();
    const [gettingHint, setGettingHint] = useState(false)
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const actionSheetRef = useRef<ActionSheet>(null);
    const [response, setResponse] = useState("")



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

    async function startRecording() {
        try {
            if (permissionResponse.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync({
                isMeteringEnabled: true,
                android: {
                    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
                    extension: '.mp3',
                    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
                    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
                },
                ios: {
                    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
                    extension: '.wav',
                    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
                },
                web: {
                    mimeType: 'audio/wav',
                    bitsPerSecond: 128000,
                },
            }
            );
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );
        const uri = recording.getURI();
        transcribe(uri)
        console.log('Recording stopped and stored at', uri);
    }


    const transcribe = async (uri) => {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        actionSheetRef.current?.show();
        setGettingHint(true)
        try {
            const data = {
                uri: base64,
                text: "Give me a transcription(Present it as a transcription with time).Evaluate my english, give me feedback and areas i should improve vocabulary wise"
            }
            const response = await ask.multimediaAudio(data)
            setResponse(response.response.text())
            setGettingHint(false)
        } catch (error) {
            actionSheetRef.current?.hide();
            setGettingHint(false)
            console.log(error)
        }
    }











    return (
        <View pb={moderateVerticalScale(60)} bg={"white"}>

            <YStack justifyContent='space-between' alignItems='center' className="h-full py-10 ">
                <XStack className='items-center '>
                    <View className={"h-0 border-[1px] border-black-600 flex-1"}></View>
                    <View className="items-center px-2 text-center bg-black border-2 rounded-full">
                        {state.isRecording && <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoMedium"}>Go ahead i'm listening</Text>}
                        {state.isRecording == false && generating == false && speaking == false && <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoMedium"}>Press and Start Speaking</Text>}
                        {generating && <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoMedium"}>Getting response</Text>}
                        {speaking && <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoMedium"}>AI is speaking</Text>}
                    </View>
                    <View className={"h-0 border-[1px] flex-1 border-black-600"}></View>
                </XStack>
                <ActionSheet ref={actionSheetRef} gestureEnabled={false} containerStyle={{ height: Dimensions.get("screen").height - 100, backgroundColor: "#098756" }}>
                    <XStack alignItems="center" mx={10} justifyContent="space-between">
                        <Text fontSize={20} m={10} color={"white"} fontFamily={"NunitoBold"}>Gemini Speech Evaluation 🤔</Text>
                        <Pressable onPress={() => {
                            actionSheetRef.current?.hide();
                        }}>
                            <Ionicons name='close-circle' size={25} color={"white"} />
                        </Pressable>
                    </XStack>
                    <ScrollView className='h-full'>
                        {gettingHint && <View className="flex-col items-center justify-center p-10 h-100">
                            <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoBold"}>Gemini is generating a transcription and evaluation</Text>
                        </View>
                        }
                        {gettingHint == false && <Markdown style={styles} >
                            {response}
                        </Markdown>}
                    </ScrollView>

                </ActionSheet>

                <View className={"w-full px-10"}>
                    <XStack justifyContent='center'>
                        <Button
                            bg={recording ? "#ff0002" : "#098756"}
                            borderRadius={30}
                            onPress={recording ? stopRecording : startRecording}
                        >
                            <Text fontFamily={"NunitoMedium"} color={"white"}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>

                        </Button>
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
        padding: 10,
        color: "white"
    }
})

