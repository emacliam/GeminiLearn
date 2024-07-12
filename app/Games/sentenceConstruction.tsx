import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, ImageBackground, Dimensions, Alert } from "react-native";
import DuoDragDrop, { DuoDragDropRef, Word, Lines, Placeholder } from "@/components/FormSentenceDrag";
import { AlertDialog, Button, Dialog, Text, XStack, YStack } from "tamagui";
import ask from "@/services/Ask/ask";
import Loading from "@/components/Loading";
import img from "../../assets/images/memphis-mini.png";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
import { useNavigation } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import ActionSheet from "react-native-actions-sheet";
import Markdown from 'react-native-markdown-display';
import { Ionicons } from "@expo/vector-icons";
import { EventRegister } from 'react-native-event-listeners'


const Duolingo = () => {
    const ref = useRef<DuoDragDropRef>(null);
    const regexp = /\[([^\]]+)\]/g;
    const [generating, setGenerating] = useState(false)
    const [evaluating, setEvaluating] = useState(false)
    const [gettingHint, setGettingHint] = useState(false)
    const [word, setWord] = useState([])
    const [sentence, setSentence] = useState([])
    const [response, setResponse] = useState("")
    const [Evaluation, setEvaluation] = useState()
    const [wordsAvailable, setWordsAvailable] = useState(false)

    const actionSheetRef = useRef<ActionSheet>(null);

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const ask1 = async (data: any) => {
        try {
            setGenerating(true)
            const response = await ask.requestJson(data)
            const convertedResponse = JSON.parse(response.response.text())
            console.log(convertedResponse)
            const words = convertedResponse.sentence.split(" ")
            setWord(shuffle(words))
            setSentence(convertedResponse.sentence)
            setGenerating(false)
        } catch (error) {
            console.log(error)
            setGenerating(false)
        }
    }


    const prompt = `
Generate a random unique sentence for english level advanced with a maximum of 20 words, and break down the words into an array of all the words in the sentence using this JSON schema:
{ "type": "object",
  "properties": {
    "sentence": {
            "type":"string
     }
  }
}
    `
    /*      "words":{
            "type": "array",
            "items":{
            "type":"string
            }
         } , */


    useEffect(() => {
        ask1({
            text: prompt
        })
    }, [])



    const Evaluate = async (data: any) => {
        try {
            const constructed = data.join("")


        } catch (error) {
            console.log(error)


        }
    }


    const getHint = async () => {
        try {
            setGettingHint(true)
            setResponse("")
            actionSheetRef.current?.show();

            const prompt = `
             I am trying to use these words  ${word} to construct this sentence:${sentence}
             Give me hints, dont complete it for me.Your response should only be hints.don't reveal the sentence.
             Also include definations ot the words to assit with their meaning
             
            `
            const response = await ask.request({
                text: prompt
            })
            setResponse(response.response.text())
            console.log(response.response.text())
            setGettingHint(false)
        } catch (error) {
            console.log("error", error)
            actionSheetRef.current?.hide();

        }
    }



    const navigation = useNavigation()
    navigation.setOptions({
        headerRight: () => {

            return (
                <></>
            )
        }
    })


    useEffect(() => {
        const handleStateChange = () => {
            const answered = ref.current?.getAnsweredWords();
            //console.log(answered)
            setTimeout(() => {
                answered?.length > 0 ? setWordsAvailable(true) : setWordsAvailable(false)
            }, 500);
        };

        const sub = EventRegister.addEventListener('stateChange', handleStateChange);

        return () => {
            EventRegister.removeEventListener(sub)
        };
    }, [])

    return (

        <View style={{ minHeight: "auto", flex: 1 }}>
            {generating == true ? <View className="flex-col items-center justify-center flex-1 h-screen bg-white">
                <Loading loadingText={` Generating Game Data From Gemini`} />
            </View> :

                <ImageBackground source={img} resizeMode='cover' className={"h-screen pb-10"}>

                    {word.length > 0 && <ScrollView className={"h-full px-2 py-10"}>
                        <Text fontSize={18} mb={10} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Construct a sentence from the random words below</Text>
                        <XStack alignItems="center" justifyContent="space-between" mb={20}>
                            <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Too Hard?</Text>
                            <View gap={4}>

                                <Pressable className="" onPress={() => {
                                    ask1({
                                        text: prompt
                                    })
                                }}>
                                    <View className="flex-row items-center justify-center w-auto h-8 px-5 bg-black rounded-full">
                                        <Text className="font-[NunitoBold] text-white">
                                            Generate Another
                                        </Text>

                                    </View>

                                </Pressable>
                                <Pressable className="" onPress={() => {
                                    getHint()
                                }}>
                                    <View className="flex-row items-center justify-center w-auto h-8 px-5 bg-black rounded-full">
                                        <Text className="font-[NunitoBold] text-white">
                                            Get A Hint
                                        </Text>

                                    </View>

                                </Pressable>
                            </View>
                        </XStack>
                        <DuoDragDrop ref={ref}
                            words={word}
                            wordBankAlignment={"left"}
                            wordBankOffsetY={2}
                            onDrop={(item) => {
                                EventRegister.emit('stateChange');
                            }}
                            renderWord={(word, index) => (
                                <Word
                                    containerStyle={{
                                        backgroundColor: "#098756",
                                        borderRadius: 30,
                                        height: 30
                                    }}
                                    textStyle={{
                                        color: "white",
                                        fontFamily: "Nunito"
                                    }}
                                />
                            )}
                            // Change the border radius of the default Placeholder
                            renderPlaceholder={({ style }) => <Placeholder style={[style, { borderRadius: 30, height: 30 }]} />}
                            // Modify the container/line style of Lines.
                            renderLines={(props) => (
                                <Lines {...props} containerStyle={{ backgroundColor: "transparent", marginTop: -7 }} lineStyle={{ borderColor: "#CCC" }} />
                            )}

                        />


                    </ScrollView>}
                    <ActionSheet ref={actionSheetRef} gestureEnabled={false} containerStyle={{ height: Dimensions.get("screen").height - 100, backgroundColor: "#098756" }}>
                        <XStack alignItems="center" mx={10} justifyContent="space-between">
                            <Text fontSize={20} m={10} color={"white"} fontFamily={"NunitoBold"}>Gemini Hint 🤔</Text>
                            <Pressable onPress={() => {
                                actionSheetRef.current?.hide();
                            }}>
                                <Ionicons name='close-circle' size={25} color={"white"} />
                            </Pressable>
                        </XStack>
                        <ScrollView bg={"white"} className='h-full'>
                            {gettingHint && <View className="flex-col items-center justify-center p-10 h-100">
                                <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoBold"}>Gemini is generating hints</Text>
                            </View>
                            }
                            {gettingHint == false && <Markdown style={styles} >
                                {response}
                            </Markdown>}
                        </ScrollView>

                    </ActionSheet>

                    <>
                        {wordsAvailable == true && <XStack mb={20} ai={"center"} justifyContent="space-between" >
                            <AlertDialog>
                                <AlertDialog.Trigger asChild>
                                    <Pressable className="w-full px-4" onPress={() => {
                                        const answered = ref.current?.getAnsweredWords();
                                        console.log(ref.current?.getWords())
                                        Evaluate(answered)
                                    }}>
                                        <View className="flex-row items-center justify-center w-full h-12 px-5 bg-black rounded-full">
                                            <Text className="font-[NunitoBold] text-white">
                                                Evaluate
                                            </Text>

                                        </View>
                                    </Pressable>
                                </AlertDialog.Trigger>
                                <AlertDialog.Portal>
                                    <AlertDialog.Overlay
                                        key="overlay"
                                        animation="quick"
                                        opacity={0.5}
                                        enterStyle={{ opacity: 0 }}
                                        exitStyle={{ opacity: 0 }}
                                    />
                                    <AlertDialog.Content
                                        bordered
                                        elevate
                                        key="content"
                                        animation={[
                                            'quick',
                                            {
                                                opacity: {
                                                    overshootClamping: true,
                                                },
                                            },
                                        ]}
                                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                                        x={0}
                                        scale={1}
                                        opacity={1}
                                        y={0}

                                    >
                                        <YStack space>
                                            <AlertDialog.Title>Accept</AlertDialog.Title>
                                            <AlertDialog.Description>
                                                By pressing yes, you accept our terms and conditions.
                                            </AlertDialog.Description>

                                            <XStack space="$3" justifyContent="flex-end">
                                                <AlertDialog.Cancel asChild>
                                                    <Button>Cancel</Button>
                                                </AlertDialog.Cancel>
                                                <AlertDialog.Action asChild>
                                                    <Button theme="active">Next</Button>
                                                </AlertDialog.Action>
                                            </XStack>
                                        </YStack>
                                    </AlertDialog.Content>
                                </AlertDialog.Portal>
                            </AlertDialog>

                        </XStack>}</>

                </ImageBackground>



            }
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",

    },
    body: {
        fontFamily: "NunitoMedium",
        fontSize: 17,
        padding: 10,
        color: "white"
    }
});


export default Duolingo;
