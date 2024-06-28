import { Image, StyleSheet, Platform, View, Pressable, Text, ScrollView, TextInput, KeyboardAvoidingView, SafeAreaView, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ask from '@/services/Ask/ask';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import * as Speech from 'expo-speech';
import { Link, useLocalSearchParams } from 'expo-router';
import { EditorHelper, RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';

export default function Notes() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const params = useLocalSearchParams()
    const [message, setMessage] = useState(null)

    const ask1 = async () => {
        try {
            console.log(params)
            const history = [{
                role: "user",
                parts: [{
                    "text": params.prompt
                }]
            },
            {
                role: "model",
                parts: [{
                    "text": params.response
                }]
            }]
            const msg = `I want to improve my english.mark this content based on the question, give pointers where there are grammatical issues, and writing issues.give help on how the writer can improve.Recommend areas of improvement giving references and links. This is the content: ${message}`
            const response = await ask.multiconvo(history, msg)
            console.log("kkkkkk", response)
            setResponse(response)
            setGenerating(false)
        } catch (error) {
            console.log(error)
        }
    }


    const editor = useEditorBridge({
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent: 'Start Writing',
        theme: {

        },
        onChange: async () => {
            const msg = await editor.getText()
            setMessage(msg)
        },
    });

    return (
        <SafeAreaView>

            <ScrollView>
                <View className="h-[30vh] border-gray-200 border-2 m-3 p-2 rounded-lg bg-white">


                    <RichText onContentSizeChange={(item) => { setMessage(item) }} editor={editor} />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            bottom: 0,
                        }}
                    >
                        <Toolbar editor={editor} />
                    </KeyboardAvoidingView>



                    <Pressable onPress={() => {

                        ask1()

                    }} className="justify-center h-10 align-middle bg-black rounded-md">
                        <ThemedText className="text-center text-white" type="link">Submit For Review</ThemedText>
                    </Pressable>

                </View>
                <View className="p-2 m-3 border-2 border-gray-200 rounded-lg">
                    <ThemedText className="mt-2" type="subtitle">Gemini review report:</ThemedText>
                    {generating && <View className="flex-col items-center justify-center flex-1 h-screen">
                        <Text >
                            Generating notes on {params.name} from Gemini
                        </Text></View>}
                    {generating == false && <Markdown style={styles} >
                        {response}
                    </Markdown>}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

})

