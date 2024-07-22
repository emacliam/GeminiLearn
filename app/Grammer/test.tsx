import { Image, StyleSheet, Platform, Pressable, ScrollView, Alert } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ask from '@/services/Ask/ask';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import * as Speech from 'expo-speech';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import Loading from '@/components/Loading';
import { Button, Label, RadioGroup, Text, XStack, View, YStack } from 'tamagui';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Notes() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState([])
    const [generating, setGenerating] = useState(false)
    const params = useLocalSearchParams()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState();
    const [allAnswered, setAllAnswered] = useState(false)
    const regexp = /\[([^\]]+)\]/g;

    const handleAnswerSelect = (answer, question, index) => {
        response[index]["SelectedAnswer"] = answer
        response[index]["Answered"] = true
        const answered = response.every(question => question?.hasOwnProperty('SelectedAnswer'))
        setAllAnswered(answered)
    };

    useEffect(() => {

        const answered = response.every(question => question?.hasOwnProperty('SelectedAnswer'))
        setAllAnswered(answered)

    }, [response])


    const ask1 = async (data: any) => {
        try {
            const response = await ask.requestJson(data)
            const res = JSON.parse(response.response.text())
            setResponse(res)
            setCurrentQuestion(res[currentQuestionIndex])
            setGenerating(false)
        } catch (error) {
            console.log(error)
        }
    }
    const prompt = `Generate a test with 20 questions for these notes in json format using the below schema
    
    Notes: ${params.data}
     Note: The test should be in this difficulty Level : ${params.difficulty}
     Difficulty Description: ${params.difficultyContent}
    
    The Schema:
[ "type": "Array",
  "items": {
    "type":"Object",
    "properties":{
    "Question": {
            "type":"string",
            }

     "MultipleChoiceAnswers": {
            "type":"array",
            "items":{
            "type":"string
            }
        }
         "CorrectAnswer": {
            "type":"string",
            }
     }
    ]
}

    `
    useEffect(() => {
        setGenerating(true)
        ask1({
            text: prompt
        })
    }, [])



    const navigation = useNavigation()
    navigation.setOptions({
        headerRight: () => {

            return (

                <Button disabled={allAnswered == true && generating == false ? false : true} disabledStyle={{ bg: "$gray11", color: "$gray9" }} color={"white"} fontFamily={"NunitoBold"} bg={"black"} className="pt-0 pb-0 " borderRadius={30} h={30} onPress={() => {

                    router.push({
                        pathname: "/Grammer/testResults",
                        params: {
                            data: JSON.stringify(response)
                        }
                    })
                }}>


                    Submit Answers

                </Button>
            )
        }
    })




    return (
        < >

            {generating && <View className="flex-col items-center justify-center flex-1 h-screen bg-white">
                <Loading loadingText={` Generating a Test from notes on ${params.name} from Gemini`} />
            </View>}
            {generating == false &&

                <SafeAreaView style={styles.container}>
                    <View mx={20} >
                        <Text fontSize={20} ai={'center'} color={"black"} fontFamily={"NunitoBold"}>Note: You cannot submit until you answer all the questions</Text>
                    </View>
                    <ScrollView>
                        {
                            response?.map((question, indexs) => {
                                return (
                                    <View key={indexs} style={styles.questionContainer}>
                                        <Text mb={10} fontSize={20} color={"black"} fontFamily={"NunitoBold"}>{question?.Question}</Text>

                                        <RadioGroup onValueChange={(text) => {
                                            handleAnswerSelect(text, question?.Question, indexs)
                                        }} aria-labelledby="Select one item" defaultValue="3" name="form">
                                            {question?.MultipleChoiceAnswers.map((answer, index) => (
                                                <YStack width={300} my={10} alignItems="center" gap={3}>
                                                    <XStack width={300} alignItems="center" gap="$4">
                                                        <RadioGroup.Item value={answer} id={`radiogroup-${index + answer}`} size={20}>
                                                            <RadioGroup.Indicator />
                                                        </RadioGroup.Item>

                                                        <Text fontSize={18} color={"black"} fontFamily={"NunitoMedium"} htmlFor={`radiogroup-${index + answer}`}>
                                                            {answer}
                                                        </Text>
                                                    </XStack>
                                                </YStack>
                                            ))}
                                        </RadioGroup>
                                    </View>
                                )
                            })
                        }


                    </ScrollView>

                </SafeAreaView>

            }

        </>
    );
}

const styles = StyleSheet.create({
    body: {
        fontFamily: "NunitoMedium",
        fontSize: 17,
        paddingBottom: 100
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    questionContainer: {
        padding: 20,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    answerButton: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 15,
        marginVertical: 5,
        elevation: 2,
    },
    selectedAnswerButton: {
        backgroundColor: '#d3d3d3',
    },
    answerText: {
        fontSize: 16,
    },
    nextButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    },
    nextButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
})

