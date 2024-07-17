import Loading from "@/components/Loading"
import ask from "@/services/Ask/ask"
import { useLocalSearchParams, useNavigation } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import {
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Button,
    Pressable,
    ImageBackground,
    Dimensions,
} from "react-native"
import { View, Text, XStack } from "tamagui"
import img from "../../assets/images/memphis-mini.png";
import ActionSheet from "react-native-actions-sheet";
import Markdown from 'react-native-markdown-display';
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler"

const Block = ({
    index,
    guess,
    word,
    guessed,
}: {
    index: number,
    guess: string,
    word: string,
    guessed: boolean,
}) => {
    const letter = guess[index]
    const wordLetter = word[index]

    const blockStyles: any[] = [styles.guessSquare]
    const textStyles: any[] = [styles.guessLetter]

    if (letter === wordLetter && guessed) {
        blockStyles.push(styles.guessCorrect)
        textStyles.push(styles.guessedLetter)
    } else if (word.includes(letter) && guessed) {
        blockStyles.push(styles.guessInWord)
        textStyles.push(styles.guessedLetter)
    } else if (guessed) {
        blockStyles.push(styles.guessNotInWord)
        textStyles.push(styles.guessedLetter)
    }

    return (
        <View style={blockStyles}>
            <Text fontSize={20} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"} >{letter}</Text>
        </View>
    )
}

const GuessRow = ({
    guess,
    word,
    guessed,
}: {
    guess: string,
    word: string,
    guessed: boolean,
}) => {
    return (
        <View style={styles.guessRow}>
            <Block index={0} guess={guess} word={word} guessed={guessed} />
            <Block index={1} guess={guess} word={word} guessed={guessed} />
            <Block index={2} guess={guess} word={word} guessed={guessed} />
            <Block index={3} guess={guess} word={word} guessed={guessed} />
            <Block index={4} guess={guess} word={word} guessed={guessed} />
        </View>
    )
}

const KeyboardRow = ({
    letters,
    onKeyPress,
}: {
    letters: string[],
    onKeyPress: (letter: string) => void,
}) => (
    <View style={styles.keyboardRow}>
        {letters.map(letter => (
            <TouchableOpacity onPress={() => onKeyPress(letter)} key={letter}>
                <View style={styles.key}>
                    <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"} style={styles.keyLetter}>{letter}</Text>
                </View>
            </TouchableOpacity>
        ))}
    </View>
)

const Keyboard = ({ onKeyPress }: { onKeyPress: (letter: string) => void }) => {
    const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
    const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
    const row3 = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]

    return (
        <View style={styles.keyboard} mb={70}>
            <KeyboardRow letters={row1} onKeyPress={onKeyPress} />
            <KeyboardRow letters={row2} onKeyPress={onKeyPress} />
            <KeyboardRow letters={row3} onKeyPress={onKeyPress} />
        </View>
    )
}

/* const words = [
    "LIGHT",
    "TIGHT",
    "GOING",
    "WRUNG",
    "COULD",
    "PERKY",
    "MOUNT",
    "WHACK",
    "SUGAR",
] */

interface IGuess {
    [key: number]: string;
}

const defaultGuess: IGuess = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
}

export default function Wordle() {
    const [words, setWords] = useState(["LEFTS"])
    const [activeWord, setActiveWord] = useState(words[0])
    const [guessIndex, setGuessIndex] = useState(0)
    const [guesses, setGuesses] = useState<{ [key: number]: string }>(defaultGuess)
    const [gameComplete, setGameComplete] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [response, setResponse] = useState("")
    const [gettingHint, setGettingHint] = useState(false)
    const actionSheetRef = useRef<ActionSheet>(null);
    const params = useLocalSearchParams()


    const ask1 = async (data: any) => {
        try {
            setGenerating(true)
            const response = await ask.requestJson(data)
            const convertedResponse = JSON.parse(response.response.text())
            let capitalizedItems = convertedResponse.words.map(item => item.toUpperCase());
            setWords(capitalizedItems)
            setGenerating(false)
        } catch (error) {
            console.log(error)
            setGenerating(false)
        }
    }


    const prompt = `
Generate an array of 9 words with exactly 5 letters using this JSON schema:
 Note: The items should be in this difficulty Level : ${params.difficulty}
     Difficulty Description: ${params.difficultyContent}

    NOTE: All the words generated should be exactly 5 letter.
    Note: Strictly 5 letter words.
{ "type": "object",
  "properties": {
    "words": {
            "type":"array",
            "items":{
            "type":"string
            }
     }
  }
}
    `


    useEffect(() => {
        ask1({
            text: prompt
        })
    }, [])




    const handleKeyPress = (letter: string) => {
        const guess: string = guesses[guessIndex]

        if (letter === "ENTER") {
            if (guess.length !== 5) {
                alert("Word too short.")
                return
            }

            if (!words.includes(guess)) {
                alert("Not a valid word.")
                return
            }

            if (guess === activeWord) {
                setGuessIndex(guessIndex + 1)
                setGameComplete(true)
                alert("You win!")
                return
            }

            if (guessIndex < 5) {
                setGuessIndex(guessIndex + 1)
            } else {
                setGameComplete(true)
                alert("You lose!")
                return
            }
        }

        if (letter === "⌫") {
            setGuesses({ ...guesses, [guessIndex]: guess.slice(0, -1) })
            return
        }

        // don't add if guess is full
        if (guess.length >= 5) {
            return
        }

        setGuesses({ ...guesses, [guessIndex]: guess + letter })
    }

    React.useEffect(() => {
        if (!gameComplete) {
            setActiveWord(words[Math.floor(Math.random() * words.length)])
            setGuesses(defaultGuess)
            setGuessIndex(0)
        }
    }, [gameComplete])


    const getHint = async () => {
        try {
            setGettingHint(true)
            setResponse("")
            actionSheetRef.current?.show();

            const prompt = `
             I am trying to use these words  ${words} in a wordle game
             Give me hints, dont reveal the actual words in your response
             I want the user to be able to use the hints to come up with the words
             Note: Generate Safe Content
             
            `
            const response = await ask.request({
                text: prompt
            })
            setResponse(response.response.text())

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
                <>
                    <Pressable className="" onPress={() => {
                        setGameComplete(false)
                        ask1({
                            text: prompt
                        })
                    }}>
                        <View justifyContent='center' borderRadius={30} bg={"black"} px={12} py={6}>
                            <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoMedium"}>
                                Generate New Words
                            </Text>
                        </View>
                    </Pressable>
                </>
            )
        }
    })

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={img} resizeMode='cover' className={"h-screen pb-10"}>
                {
                    generating == true ? <View className="flex-col items-center justify-center flex-1 h-screen bg-white">
                        <Loading loadingText={` Generating Game Data From Gemini`} />
                    </View> : <>
                        <View mt={20} mb={20}>
                            <GuessRow
                                guess={guesses[0]}
                                word={activeWord}
                                guessed={guessIndex > 0}
                            />
                            <GuessRow
                                guess={guesses[1]}
                                word={activeWord}
                                guessed={guessIndex > 1}
                            />
                            <GuessRow
                                guess={guesses[2]}
                                word={activeWord}
                                guessed={guessIndex > 2}
                            />
                            <GuessRow
                                guess={guesses[3]}
                                word={activeWord}
                                guessed={guessIndex > 3}
                            />
                            <GuessRow
                                guess={guesses[4]}
                                word={activeWord}
                                guessed={guessIndex > 4}
                            />
                            <GuessRow
                                guess={guesses[5]}
                                word={activeWord}
                                guessed={guessIndex > 5}
                            />
                        </View>
                        <View >
                            {gameComplete ? (
                                <View mb={10} style={styles.gameCompleteWrapper}>
                                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>
                                        <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"} >Correct Word:</Text> {activeWord}
                                    </Text>

                                    <Pressable className="" onPress={() => {
                                        setGameComplete(false)
                                    }}>
                                        <View justifyContent='center' borderRadius={30} bg={"black"} px={12} py={6}>
                                            <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoMedium"}>
                                                Reset Puzzle
                                            </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            ) : null}



                            <View mb={10} style={styles.gameCompleteWrapper}>


                                <Pressable className="" onPress={() => {
                                    getHint()

                                }}>
                                    <View justifyContent='center' borderRadius={30} bg={"black"} px={12} py={6}>
                                        <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoMedium"}>
                                            Get Hints
                                        </Text>
                                    </View>
                                </Pressable>
                            </View>


                            <Keyboard onKeyPress={handleKeyPress} />
                        </View>
                        <ActionSheet ref={actionSheetRef} gestureEnabled={false} containerStyle={{ height: Dimensions.get("screen").height - 100, backgroundColor: "#098756" }}>
                            <XStack alignItems="center" mx={10} justifyContent="space-between">
                                <Text fontSize={20} m={10} color={"white"} fontFamily={"NunitoBold"}>Gemini Hint 🤔</Text>
                                <Pressable onPress={() => {
                                    actionSheetRef.current?.hide();
                                }}>
                                    <Ionicons name='close-circle' size={25} color={"white"} />
                                </Pressable>
                            </XStack>

                            <ScrollView className='h-full'>
                                {gettingHint && <View className="flex-col items-center justify-center p-10 h-100">
                                    <Text fontSize={16} m={10} color={"white"} fontFamily={"NunitoBold"}>Gemini is generating hints</Text>
                                </View>
                                }
                                {gettingHint == false && <Markdown style={styles} >
                                    {response}
                                </Markdown>}
                            </ScrollView>

                        </ActionSheet>
                    </>
                }
            </ImageBackground>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    guessRow: {
        flexDirection: "row",
        justifyContent: "center",
    },
    guessSquare: {
        borderColor: "#d3d6da",
        borderWidth: 2,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
        borderRadius: 30,
    },
    guessLetter: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#878a8c",
    },
    guessedLetter: {
        color: "#fff",
    },
    guessCorrect: {
        backgroundColor: "#6aaa64",
        borderColor: "#6aaa64",
    },
    guessInWord: {
        backgroundColor: "#c9b458",
        borderColor: "#c9b458",
    },
    guessNotInWord: {
        backgroundColor: "#787c7e",
        borderColor: "#787c7e",
    },

    container: {
        justifyContent: "space-between",
        flex: 1,
    },

    // keyboard
    keyboard: { flexDirection: "column" },
    keyboardRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 5,
    },
    key: {
        backgroundColor: "#d3d6da",
        padding: 10,
        margin: 3,
        borderRadius: 5,
    },
    keyLetter: {
        fontWeight: "500",
        fontSize: 15,
    },

    // Game complete
    gameCompleteWrapper: {
        alignItems: "center",
    },
    bold: {
        fontWeight: "bold",
    },
    body: {
        fontFamily: "NunitoMedium",
        fontSize: 17,
        padding: 10,
        color: "white"
    }
})