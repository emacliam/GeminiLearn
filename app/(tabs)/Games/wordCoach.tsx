import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import { StyleSheet, Image, Platform, Pressable, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from "react-native-reanimated-carousel";
import { useEffect, useRef, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ask from '@/services/Ask/ask';
import Markdown from 'react-native-markdown-display';
import { Progress, ScrollView, View, Text, XStack, YStack } from 'tamagui';
import * as Speech from 'expo-speech';
import img from "../../../assets/images/memphis-mini.png";
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'expo-linear-gradient';
import CrosswordGrid from '@/components/crossWord';
import { moderateVerticalScale } from 'react-native-size-matters';
import Loading from '@/components/Loading';
import generateLayout from "@/scripts/layout_generator"
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring } from 'react-native-reanimated';




export default function WordCoach() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState();
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [generating, setGenerating] = useState(false)
    const [crosswordData, setCrossWordData] = useState()
    const regexp = /\[([^\]]+)\]/g;

    const shakeAnimation = useSharedValue(0);
    const bounceAnimation = useSharedValue(1);


    const convertToJson = (str) => {
        let match;
        let matches = [];
        matches = str.match(regexp);
        const converted = JSON.parse(matches[0])
        return converted

    }

    const ask1 = async (data: any) => {
        try {
            setGenerating(true)
            const response = await ask.request(data)
            console.log(response.response.text())
            const res = convertToJson(response.response.text())
            setCrossWordData(res)
            setCurrentQuestion(res[currentQuestionIndex])
            console.log(res)

            setGenerating(false)
        } catch (error) {
            console.log(error)
            setGenerating(false)
        }
    }


    const prompt = `Generate an array of objects with random item for a word coach game similar to the one below
    Note: The array must have 10 items.
    Note:The Options should be mixed up.their order.
    Note: The Explanation should explain the meaning of the words in options in an educational manner for someone learning english
    const array = [
    {
        "hint": "What is the synonym for "On"?,
        "Answer":"Upon",
        "Explanation":"'On' and 'Upon' both indicate a state of being in contact with or supported by something.",
        "Option1":"Upon",
        "Option1":"On"
    },
     {
        "hint": "What is the antonym of "Fall"?,
        "Answer":"Rise",
        "Explanation":"'Fall' and 'Rise' are antonyms, representing opposite directions of movement.",
         "Option1":"Drop",
        "Option1":"Rise"
    },
    {
        "hint": "Which word is similar to Beneficial?,
        "Answer":"Advantageous",
        "Explanation":"Beneficial means causing benefit, or advantageous. Example: Regular exercise is advantageous to health.",
        "Option1":"Charity",
        "Option1":"Advantageous"
    },
]

    `


    useEffect(() => {
        ask1({
            text: prompt
        })
    }, [])

    const startShakeAnimation = () => {
        shakeAnimation.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );
    };

    const startBounceAnimation = () => {
        bounceAnimation.value = withSequence(
            withSpring(1.5, { damping: 5 }),
            withSpring(1, { damping: 5 })
        );
    };




    const handleOptionPress = (option) => {
        setSelectedOption(option);
        setShowExplanation(true);
        if (option === currentQuestion.Answer) {
            setScore(score + 1);
            startBounceAnimation();
        } else {
            startShakeAnimation();
        }
    };

    const nextQuestion = () => {
        setShowExplanation(false);
        setSelectedOption(null);
        if (currentQuestionIndex < crosswordData.length - 1) {
            setCurrentQuestion(crosswordData[currentQuestionIndex + 1])
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizFinished(true);
        }
    };

    const getOptionStyle = (option) => {
        if (!showExplanation) return styles.optionButton;

        if (option === currentQuestion.Answer) {
            return [styles.optionButton, { backgroundColor: "#098756", color: 'white' }];
        }

        if (option === selectedOption) {
            return [styles.optionButton, { backgroundColor: 'red', color: 'white' }];
        }

        return styles.optionButton;
    };


    const getOptionTextStyle = (option) => {
        if (!showExplanation) return styles.optionText;

        if (option === currentQuestion.Answer || option === selectedOption) {
            return [styles.optionText, { color: 'white' }];
        }

        return styles.optionText;
    };

    const shakeAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeAnimation.value }],
        };
    });

    const bounceAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: bounceAnimation.value }],
        };
    });


    if (quizFinished) {
        return (
            <View ai={"center"} flex={1} justifyContent='center' gap={10}>
                <Text fontSize={24} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Congratulations!</Text>
                <Text fontSize={24} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Your Score: {score} / {crosswordData.length}</Text>
                <TouchableOpacity style={styles.restartButton} onPress={() => {
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setQuizFinished(false);
                }}>
                    <Text fontSize={16} fontWeight={"300"} color={"white"} mx={4} fontFamily={"NunitoMedium"}>Restart Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.restartButton} onPress={() => {

                    setQuizFinished(false);
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    ask1({
                        text: prompt
                    })
                }}>
                    <Text fontSize={16} fontWeight={"300"} color={"white"} mx={4} fontFamily={"NunitoMedium"} >Generate Another Quiz</Text>
                </TouchableOpacity>
            </View>
        );
    }




    return (

        <ScrollView style={styles.container} >
            {generating ? <View className="flex-col items-center justify-center flex-1 h-screen bg-white">
                <Loading loadingText={` Generating Game Data From Gemini`} />
            </View> : <ImageBackground source={img} resizeMode='cover' className={"h-screen"}>
                <View className={"h-full"} px={10}>
                    <View style={styles.container}>
                        <YStack gap={20} px={10}>
                            <XStack alignItems='center' gap={15} mt={10}>
                                <View h={10} w={""} flex={1}  >
                                    <Progress size={10} value={((currentQuestionIndex + 1) / crosswordData?.length) * 100}>
                                        <Progress.Indicator animation="bouncy" backgroundColor={"#098756"} />
                                    </Progress>
                                </View>
                                <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"} >{`${currentQuestionIndex + 1} / ${crosswordData?.length}`}</Text>
                            </XStack>
                            <Text fontSize={24} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>{currentQuestion?.hint}</Text>
                            <Animated.View style={shakeAnimatedStyle}>
                                <TouchableOpacity
                                    style={getOptionStyle(currentQuestion?.Option1)}
                                    onPress={() => handleOptionPress(currentQuestion?.Option1)}
                                    disabled={showExplanation}
                                >
                                    <Animated.Text style={[getOptionTextStyle(currentQuestion?.Option1), selectedOption === currentQuestion?.Option1 ? bounceAnimatedStyle : null]} fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>{currentQuestion?.Option1}</Animated.Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={getOptionStyle(currentQuestion?.Option2)}
                                    onPress={() => handleOptionPress(currentQuestion?.Option2)}
                                    disabled={showExplanation}
                                >
                                    <Animated.Text style={[getOptionTextStyle(currentQuestion?.Option2), selectedOption === currentQuestion?.Option2 ? bounceAnimatedStyle : null]} fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>{currentQuestion?.Option2}</Animated.Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={getOptionStyle(currentQuestion?.Option3)}
                                    onPress={() => handleOptionPress(currentQuestion?.Option3)}
                                    disabled={showExplanation}
                                >
                                    <Animated.Text style={[getOptionTextStyle(currentQuestion?.Option3), selectedOption === currentQuestion?.Option3 ? bounceAnimatedStyle : null]} fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>{currentQuestion?.Option3}</Animated.Text>
                                </TouchableOpacity>
                            </Animated.View>

                            {showExplanation && (
                                <View>
                                    <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoMedium"} style={styles.explanation}>{currentQuestion?.Explanation}</Text>
                                    <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
                                        <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoMedium"}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </YStack>

                    </View>

                </View>
            </ImageBackground>}

        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    hint: {
        fontSize: 18,
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: '#e0e0e0',
        padding: 15,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
        borderRadius: 30,

    },
    optionText: {
        fontSize: 16,
    },
    explanation: {
        fontSize: 16,
        color: 'black',
        marginVertical: 20,
    },
    nextButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,

    },
    congratulationsText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 20,
        marginBottom: 20,
    },
    restartButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
    restartButtonText: {
        color: 'white',
        fontSize: 16,
    },

});