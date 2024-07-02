import { Image, StyleSheet, Platform, View, Pressable, ScrollView, TextInput, KeyboardAvoidingView, SafeAreaView, Button, Dimensions } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ask from '@/services/Ask/ask';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import * as Speech from 'expo-speech';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import ActionSheet from "react-native-actions-sheet";
import { Text } from 'tamagui';

export default function Notes() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const params = useLocalSearchParams()
    const [message, setMessage] = useState(null)
    const _editor = useRef();

    const actionSheetRef = useRef<ActionSheet>(null);

    const ask1 = async () => {
        try {
            const text = await _editor.current.getText()
            setGenerating(true)
            setResponse("")
            actionSheetRef.current?.show();
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
            const msg = `I want to improve my english.mark this content based on the question, give pointers where there are grammatical issues, and writing issues.give help on how the writer can improve.Recommend areas of improvement giving references and links. This is the content: ${text}`
            const response = await ask.multiconvo(history, msg)
            setResponse(response)
            setGenerating(false)
        } catch (error) {
            console.log(error)
            actionSheetRef.current?.hide();

        }
    }

    const navigation = useNavigation()
    navigation.setOptions({
        headerRight: () => {
            return (
                <Pressable className="" onPress={() => {
                    ask1()
                }}>
                    <View className="flex-row items-center justify-center h-8 px-4 bg-blue-600 rounded-full">
                        <ThemedText className="font-bold text-white">
                            Submit
                        </ThemedText>
                    </View>
                </Pressable>
            )
        }
    })



    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

            <View className="flex-1 pb-10 m-5">
                <QuillEditor
                    style={styles.editor}
                    autoSize
                    ref={_editor}

                    quill={
                        {
                            placeholder: "Start Writing ... ",
                            theme: "snow"
                        }
                    }
                    onTextChange={(text) => {
                        setMessage(text)
                    }}
                />
                <View>
                    <Text fontSize={15} fontWeight={"300"} color={"$gray11"} fontFamily={"NunitoMedium"}>NOTE: If you go back, what you have written will be lost</Text>
                </View>
            </View>


            <ActionSheet ref={actionSheetRef} gestureEnabled={true} containerStyle={{ height: Dimensions.get("screen").height - 100 }}>
                <Text fontSize={20} m={10} color={"$black"} fontFamily={"NunitoBold"}>Gemini Evaluation</Text>
                {generating && <View className="flex-col items-center justify-center p-10 h-100">
                    <Text fontSize={16} m={10} color={"$gray11"} fontFamily={"NunitoBold"}>Gemini is evaluating your work</Text>
                </View>
                }
                {generating == false && <Markdown style={styles} >
                    {response}
                </Markdown>}

            </ActionSheet>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    editor: {
        flex: 1,
        padding: 0,
        borderColor: 'gray',
        borderWidth: 1,
        marginHorizontal: 0,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    body: {
        fontFamily: "Nunito",
        fontSize: 17,
        padding: 10
    }
})

