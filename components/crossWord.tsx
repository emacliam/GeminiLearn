//CrosswordGrid.js

import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { TextInput, StyleSheet, Pressable, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import { moderateScale } from 'react-native-size-matters';
import { Text, XStack, View, Dialog, Button } from 'tamagui';


const generateInitialGrid = (crosswordData, cols, rows) => {
    const initialGrid = Array(cols).fill(0).map(() => Array(rows).fill('X'));
    crosswordData.forEach(({ answer, startx, starty, orientation }) => {
        let x = startx - 1;
        let y = starty - 1;

        for (let i = 0; i < answer.length; i++) {
            if (orientation === 'across') {
                initialGrid[y][x + i] = '';
            } else if (orientation === 'down') {
                initialGrid[y + i][x] = '';
            }
        }
    });
    return initialGrid;
};

const generateAnswerGrid = (crosswordData, cols, rows) => {
    const answerGrid = Array(cols).fill(0).map(() => Array(rows).fill('X'));
    crosswordData.forEach(({ answer, startx, starty, orientation }) => {
        let x = startx - 1;
        let y = starty - 1;

        for (let i = 0; i < answer.length; i++) {
            if (orientation === 'across') {
                answerGrid[y][x + i] = answer[i];
            } else if (orientation === 'down') {
                answerGrid[y + i][x] = answer[i];
            }
        }
    });
    return answerGrid;
};

function findWordsInGrid(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const words = [];

    // Check horizontally
    for (let r = 0; r < rows; r++) {
        let word = '';
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] !== 'X') {
                word += grid[r][c];
            } else {
                if (word.length > 1) words.push(word);
                word = '';
            }
        }
        if (word.length > 1) words.push(word); // To capture the last word in the row
    }

    // Check vertically
    for (let c = 0; c < cols; c++) {
        let word = '';
        for (let r = 0; r < rows; r++) {
            if (grid[r][c] !== 'X') {
                word += grid[r][c];
            } else {
                if (word.length > 1) words.push(word);
                word = '';
            }
        }
        if (word.length > 1) words.push(word); // To capture the last word in the column
    }

    return words;
}

const CrosswordGrid = ({ crosswordData, cols, rows, ask }) => {
    const [grid, setGrid] = useState(generateInitialGrid(crosswordData, cols, rows));


    useEffect(() => {
        setGrid(generateInitialGrid(crosswordData, cols, rows));
    }, [crosswordData]);

    const handleInputChange = (row, col, text) => {
        const newGrid = [...grid];
        newGrid[row][col] = text.toUpperCase();
        setGrid(newGrid);
    };

    const handleVerify = () => {

        const answerGrid = generateAnswerGrid(crosswordData, cols, rows);
        const isCorrect = JSON.stringify(grid) === JSON.stringify(answerGrid);
        // Find words in both grids
        const wordsInGrid1 = findWordsInGrid(grid);
        const wordsInGrid2 = findWordsInGrid(answerGrid);

        // Find common words in both grids
        const commonWords = wordsInGrid1.filter(word => wordsInGrid2.includes(word));

        // Output the common words

        setCommonWords(commonWords)

        if (isCorrect) {
            alert('Congratulations, all words are correct');
        } else {
            if (commonWords.length <= 0) {
                alert('Incorrect, try again');
            } else {
                setOpen(true)
            }

        }
    };

    const handleReset = () => {
        setGrid(generateInitialGrid(crosswordData, cols, rows));
    };

    const handleSolve = () => {
        const answerGrid = generateAnswerGrid(crosswordData, cols, rows);
        setGrid(answerGrid);
    };

    const renderGrid = () => (
        <View>

        </View>
    );

    const renderQuestions = () => {
        const questions = { across: [], down: [] };
        crosswordData.forEach(({ hint, orientation, position }) => {
            const questionText = `${position}. ${hint}`;
            questions[orientation].push(
                <Text fontSize={20} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"} key={`question-${position}`} style={styles.questionText}>
                    {questionText}
                </Text>
            );
        });

        return (
            <ScrollView >
                <View >
                    <Text fontSize={20} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>Across</Text>
                </View>
                <View style={styles.questionsContainer}>
                    {questions.across.map((question, index) => (
                        <View key={`across-question-container-${index}`}>
                            {question}
                        </View>
                    ))}
                </View>
                <View >
                    <Text fontSize={20} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>Down</Text>
                </View>
                <View style={styles.questionsContainer} pb={200}>
                    {questions.down.map((question, index) => (
                        <View key={`down-question-container-${index}`}>
                            {question}
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    };



    const [questions, setQuestions] = useState([])
    useEffect(() => {
        crosswordData.forEach(({ hint, orientation, position }) => {
            const questionText = `${orientation.toUpperCase()} | ${position}. ${hint}`;
            setQuestions((current) => [...current, questionText])
        });

    }, [])

    const [open, setOpen] = useState(false)
    const [commonWords, setCommonWords] = useState([])


    return (
        <View style={styles.container} flex={1}  >

            <Dialog open={open} onOpenChange={(open) => {
                open ? setOpen(false) : setOpen(false)
            }}>
                <Dialog.Trigger />
                <Dialog.Portal>
                    <Dialog.Overlay key="overlay"
                        animation="slow"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }} />
                    <Dialog.Content bordered
                        elevate
                        key="content"
                        animateOnly={['transform', 'opacity']}
                        animation={[
                            'quicker',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        gap="$4">
                        <Dialog.Title>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>
                                Verifing Answers
                            </Text>
                        </Dialog.Title>

                        {commonWords.length > 0 && <View >
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>
                                You Got {commonWords.length} words correct
                            </Text>
                            {commonWords.map((item, index) => {
                                return (
                                    <Text key={index} fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>
                                        {index + 1}. {item}
                                    </Text>
                                )
                            })}
                        </View>}
                        <Dialog.Close asChild>
                            <Button>
                                Close
                            </Button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>

            <XStack py={10} gap={10}>
                <Pressable className="" onPress={() => {
                    ask()
                }}>
                    <View justifyContent='center' borderRadius={30} bg={"black"} px={12} py={6}>
                        <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoMedium"}>
                            Generate
                        </Text>
                    </View>
                </Pressable>
                <Pressable className="" onPress={() => {
                    handleVerify()
                }}>
                    <View justifyContent='center' borderRadius={30} bg={"black"} px={12} py={6}>
                        <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoMedium"}>
                            Verify
                        </Text>
                    </View>
                </Pressable>
                <Pressable className="" onPress={() => {
                    handleReset()
                }}>
                    <View justifyContent='center' borderRadius={30} bg={"black"} px={12} py={6}>
                        <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoMedium"}>
                            Reset
                        </Text>
                    </View>
                </Pressable>
                <Pressable className="" onPress={() => {
                    handleSolve()
                }}>
                    <View justifyContent='center' borderRadius={30} bg={"black"} px={12} py={6}>
                        <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoMedium"}>
                            Solve
                        </Text>
                    </View>
                </Pressable>
            </XStack>





            <View ai={"center"} justifyContent='center' mx={20} style={{ width: Dimensions.get("screen").width }} >
                <ScrollView horizontal={true} >
                    <View>
                        {grid.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((cell, colIndex) => (
                                    <View key={colIndex} style={styles.cellContainer}>
                                        {crosswordData.map((entry) => {
                                            const { startx, starty, position } = entry;
                                            if (rowIndex + 1 === starty && colIndex + 1 === startx) {
                                                return (
                                                    <Text fontSize={20} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"} key={`digit-${position}`}
                                                        style={styles.smallDigit}>
                                                        {position}
                                                    </Text>
                                                );
                                            }
                                            return null;
                                        })}
                                        <TextInput
                                            style={[styles.cell,
                                            grid[rowIndex][colIndex] === 'X' ? styles.staticCell : null]}
                                            value={cell}
                                            editable={grid[rowIndex][colIndex] !== 'X'}
                                            onChangeText={(text) =>
                                                handleInputChange(rowIndex, colIndex, text)
                                            }
                                            maxLength={1}
                                        />
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>

                </ScrollView>
            </View>



            {/*    */}
            <View minHeight={120} flex={1}  >

                <View px={20} >
                    {renderQuestions()}
                </View>

            </View>


        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get("window").height
    },
    row: {
        flexDirection: 'row',
    },
    cellContainer: {
        position: 'relative',
    },
    cell: {
        borderWidth: 1,
        margin: 1,
        borderColor: "#098756",
        width: 25,
        height: 25,
        textAlign: 'center',

    },
    staticCell: {
        borderColor: 'transparent',
        color: 'transparent',
    },
    smallDigit: {
        position: 'absolute',
        top: 2,
        left: 2,
        fontSize: 10,
        fontWeight: 'bold',
    },
    questionsContainer: {
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: 10,
    },
    questionText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    headingContainer: {
        marginTop: 10,
        marginBottom: 5,
    },
    headingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#098756",
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginHorizontal: 10,
    },
    button: {
        flex: 1,
        borderRadius: 30,
        borderWidth: 1,
        overflow: 'hidden'
    },
    gap: {
        width: 10,
    },
});

export default CrosswordGrid
