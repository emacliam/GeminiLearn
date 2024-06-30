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

export default function Notes() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const params = useLocalSearchParams()
    const richText = useRef();



    const editor = useEditorBridge({
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent: 'Start editing!',
    });


    const ask1 = async (data: any) => {
        try {
            setGenerating(true)
            const response = await ask.request(data)
            setResponse(response.response.text())
            setGenerating(false)
        } catch (error) {
            console.log(error)
            setGenerating(false)
        }
    }

    const prompt = `Using the format similar to this one
            delightful

            adjective

            causing great pleasure; very enjoyable.
            "a delightful surprise"

            Similar:

            pleasing, pleasant, enjoyable, gratifying, charming, lovely, wonderful, superb
            
            Generate for the word ${params.word},`

    useEffect(() => {
        ask1({
            text: prompt
        })
    }, [])



    return (
        <View >
            <ScrollView
                className="font-serif bg-white "
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                style={{ height: '100%' }}
            >

                {generating && <View className="flex-1 h-screen items-center flex-col justify-center bg-[#1d0826]">

                    <Loading loadingText={` Generating information on ${params.word} from Gemini`} />
                </View>}

                <View className="px-4 pt-10">
                    <View className="bg-white">
                        {generating == false && <Markdown style={styles} >
                            {response}
                        </Markdown>}
                    </View>
                </View>

            </ScrollView >
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

