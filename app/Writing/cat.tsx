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
            console.log("kkkkkk", response.response.text())
            setResponse(response.response.text())
            setGenerating(false)
        } catch (error) {
            console.log(error)
            setGenerating(false)
        }
    }

    const prompt = `Generate tasks.
            These tasks are short story questions.
            For example this:
            (An email: A party Read the email from your English pen-friend, Hemal. Tell me about the last party you went to. What was the reason for the party? What did you wear? What did you eat there? Write an email to Hemal and answer the questions. Write your email in 25 words or more.)
            There are 5 Levels of difficulty
            1. Beginner, 2. Intermediate, 3. Advanced, 4. Business, 5. Just for fun!

            Below are examples of each levels question
            1. An email: Your favorite hobby Read the email from your English friend, Kelly.

                I’d like to know about your hobbies.
                What’s your favourite hobby? Why do you enjoy this hobby?
                How often do you do it? Write an email to Kelly and answer the questions.
                
                Write your email in 25 words or more.
            2. A review: An outdoor music festival
                You see this announcement on an English-language website:
                Reviews wanted
                
                Outdoor music festival!
                
                Have you been to an outdoor music festival? Tell us about the experience!
                
                We’d like to know about the place where the festival was held, and the food, drink and other things available there. Tell us about the performer or band that impressed you most.
                
                Could anything have been improved at the festival?
                
                Write your review in 140 – 190 words in an appropriate style.
            3. A review: A film
                You should spend about 40 minutes on this task.
                
                You recently watched a film. Write a review for an online review site, to help people decide if they should also watch it. Explain what you enjoyed about the film and what you think would have improved it.
                
                Write about 200-250 words.
            4. Advanced - a letter: Customer loyalty scheme
                
                Recently, the retail company you work for has been losing customers to a competitor. The company is setting up a scheme to encourage customers to stay with the company. Your boss has asked you to write a letter to the customers on your database outlining this customer loyalty scheme.
                Write the letter to your customers:
                - describing the benefits for customers of the loyalty scheme
                - explaining what customers must do to join the scheme
                - giving details of a special promotion to launch the scheme
                - reminding customers of the quality of your goods.
            5. An essay: Robot Teachers - do you trust them?
                These days, there are programs, like Write & Improve, that use a type of artificial intelligence (AI) to give students *automatic* feedback and scores for their writing.
                -  How do you feel about this?
                -  Do you trust the feedback they give?
                -  What are the advantages and disadvantages of automatic feedback?
                -  How could it be improved?
            
            Generate 1 tasks for Level ${params.name},`

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

                    <Loading loadingText={` Generating notes on ${params.name} from Gemini`} />
                </View>}

                <View className="px-4 pt-10">
                    <View className="bg-white">
                        {generating == false && <Markdown style={styles} >
                            {response}
                        </Markdown>}
                    </View>

                    {/*  <Link href={{
                        pathname: "/Writing/write",
                        params: {
                            prompt,
                            response
                        }
                    }} asChild>
                        <LinearGradient
                            start={{ x: 0.1, y: 0.2 }}
                            locations={[0.3, 0.5]}
                            colors={["#1d0826"]}
                            style={styles.button}>
                            <ThemedText className="text-white" type="link">Write</ThemedText>
                        </LinearGradient>


                    </Link> */}

                    <Pressable className="mt-4 " onPress={() => {
                        router.push({
                            pathname: "/Writing/write",
                            params: {
                                prompt,
                                response
                            }
                        })
                    }}>
                        <View className="flex-row items-center justify-center w-full h-12 bg-blue-600 rounded-full">
                            <ThemedText className="font-bold text-white">
                                Start Writing
                            </ThemedText>

                        </View>
                    </Pressable>
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

