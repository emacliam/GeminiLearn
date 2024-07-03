//CrosswordGrid.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Button } from 'react-native';

let level = 0;

const generateInitialGrid = (crosswordData) => {
    const initialGrid = Array(7).fill(0).map(() => Array(8).fill('X'));
    crosswordData[level].forEach(({ answer, startx, starty, orientation }) => {
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

const generateAnswerGrid = (crosswordData) => {
    const answerGrid = Array(7).fill(0).map(() => Array(8).fill('X'));
    crosswordData[level].forEach(({ answer, startx, starty, orientation }) => {
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


const CrosswordGrid = ({ crosswordData }) => {
    const [grid, setGrid] = useState(generateInitialGrid(crosswordData));

    useEffect(() => {
        setGrid(generateInitialGrid(crosswordData));
    }, [crosswordData]);

    const handleInputChange = (row, col, text) => {
        const newGrid = [...grid];
        newGrid[row][col] = text.toUpperCase();
        setGrid(newGrid);
    };

    const handleGenerate = () => {
        level = (level + 1) % 2;
        setGrid(generateInitialGrid(crosswordData));
    };

    const handleVerify = () => {
        const answerGrid = generateAnswerGrid(crosswordData);
        const isCorrect = JSON.stringify(grid) === JSON.stringify(answerGrid);
        if (isCorrect) {
            alert('Congratulations! Your crossword is correct.');
        } else {
            alert('Incorrect. Please try again.');
        }
    };

    const handleReset = () => {
        setGrid(generateInitialGrid(crosswordData));
    };

    const handleSolve = () => {
        const answerGrid = generateAnswerGrid(crosswordData);
        setGrid(answerGrid);
    };

    const renderGrid = () => (
        <View>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => (
                        <View key={colIndex} style={styles.cellContainer}>
                            {crosswordData[level].map((entry) => {
                                const { startx, starty, position } = entry;
                                if (rowIndex + 1 === starty && colIndex + 1 === startx) {
                                    return (
                                        <Text key={`digit-${position}`}
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
        console.log("jjjjjjjjjj", crosswordData)
        crosswordData[level].forEach(({ hint, orientation, position }) => {
            const questionText = `${position}. ${hint}`;
            questions[orientation].push(
                <Text key={`question-${position}`} style={styles.questionText}>
                    {questionText}
                </Text>
            );
        });

        return (
            <View>
                <View style={styles.headingContainer}>
                    <Text style={styles.headingText}>Across</Text>
                </View>
                <View style={styles.questionsContainer}>
                    {questions.across.map((question, index) => (
                        <View key={`across-question-container-${index}`}>
                            {question}
                        </View>
                    ))}
                </View>
                <View style={styles.headingContainer}>
                    <Text style={styles.headingText}>Down</Text>
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
            <View style={styles.buttonContainer}>
                <Button color={'#228B22'}
                    title="Generate"
                    onPress={handleGenerate}
                    style={styles.button} />
                <View style={styles.gap} />
                <Button color={'#228B22'}
                    title="Verify"
                    onPress={handleVerify}
                    style={styles.button} />
                <View style={styles.gap} />
                <Button color={'#228B22'}
                    title="Reset"
                    onPress={handleReset}
                    style={styles.button} />
                <View style={styles.gap} />
                <Button color={'#228B22'}
                    title="Solve"
                    onPress={handleSolve}
                    style={styles.button} />
            </View>
            {renderQuestions()}
            {renderGrid()}

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
        borderColor: '#228B22',
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
        color: '#228B22',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginHorizontal: 10,
    },
    button: {
        flex: 1, // Ensure equal width for both buttons
    },
    gap: {
        width: 10, // Adjust the width as needed for the desired gap
    },
});

export default CrosswordGrid
