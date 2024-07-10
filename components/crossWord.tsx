//CrosswordGrid.js

import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Pressable } from 'react-native';
import { Text, XStack, View } from 'tamagui';


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
        if (isCorrect) {
            alert('Congratulations! Your crossword is correct.');
        } else {
            alert('Incorrect. Please try again.');
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
            <View py={10}>
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
                <View style={styles.questionsContainer}>
                    {questions.down.map((question, index) => (
                        <View key={`down-question-container-${index}`}>
                            {question}
                        </View>
                    ))}
                </View>
            </View>
        );
    };


    return (
        <View style={styles.container}>


            <XStack py={10} pb={20} gap={10}>
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


            {renderGrid()}
            {renderQuestions()}




        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
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
        width: 30,
        height: 30,
        textAlign: 'center',
    },
    staticCell: {
        borderColor: 'transparent',
        color: 'white',
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
