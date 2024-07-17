





import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Platform, TextInput, Pressable, KeyboardAvoidingView, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import Loading from '@/components/Loading';
import { Adapt, Select, Sheet, Text, View, XStack, YStack, getFontSize } from 'tamagui';
import { useState, useMemo } from 'react';
import type { FontSizeTokens, SelectProps } from 'tamagui'
import levels from '@/constants/levels';
import cat from '@/constants/categories';

export default function TabTwoScreen() {

    const [difficulty, setDifficulty] = useState("")
    const [category, setCategory] = useState("")


    return (


        <KeyboardAvoidingView>

            <ScrollView className={"bg-white h-full "}>
                <View className={"p-4 space-y-1"}>

                    <View style={styles.titleContainer}>
                        <Text fontSize={20} color={"black"} fontFamily={"NunitoBold"}>How To Play</Text>
                    </View>

                    <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"} >Guess the Wordle in 6 tries</Text>

                    <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>- Each guess must be a valid 5-letter word</Text>

                    <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>- The Colors of the tiles will change to show how close your guess was to the word</Text>
                    <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>- Press "Enter" to evaluate</Text>


                    <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Example</Text>


                    <XStack gap={10}>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"#6aaa64"}>
                            <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoBold"}>W</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>E</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>A</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>R</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Y</Text>
                        </View>
                    </XStack>
                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>"W" is in the word and in the correct spot</Text>

                    <XStack gap={10}>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>P</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"#c9b458"}>
                            <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoBold"}>I</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>L</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>L</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>S</Text>
                        </View>
                    </XStack>

                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>"I" is in the word but in the wrong spot</Text>
                    <XStack gap={10}>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>V</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>A</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>G</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"#787c7e"}>
                            <Text fontSize={16} fontWeight={"300"} color={"white"} fontFamily={"NunitoBold"}>U</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={30} w={30} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={16} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>E</Text>
                        </View>
                    </XStack>

                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>U is not in the word in any spot</Text>






                    <Text fontSize={16} pt={10} color={"black"} fontFamily={"NunitoBold"}>Select Category and Difficulty Level to start playing</Text>
                    <View pt={5}>
                        <Select value={difficulty} onValueChange={setDifficulty} disablePreventBodyScroll >
                            <Select.Trigger width={"100%"} borderRadius={30} iconAfter={<Ionicons name='chevron-down' size={15} color={"white"} />}>
                                <Select.Value placeholder="Select Difficulty Level" />
                            </Select.Trigger>

                            <Adapt when="sm" platform="touch">
                                <Sheet
                                    modal
                                    dismissOnSnapToBottom
                                    animationConfig={{
                                        type: 'spring',
                                        damping: 20,
                                        mass: 1.2,
                                        stiffness: 250,
                                    }}
                                >
                                    <Sheet.Frame>
                                        <Sheet.ScrollView>
                                            <Adapt.Contents />
                                        </Sheet.ScrollView>
                                    </Sheet.Frame>
                                    <Sheet.Overlay
                                        animation="lazy"
                                        enterStyle={{ opacity: 0 }}
                                        exitStyle={{ opacity: 0 }}
                                    />
                                </Sheet>
                            </Adapt>

                            <Select.Content zIndex={200000}>
                                <Select.Viewport
                                    minWidth={200}
                                >
                                    <Select.Group>
                                        <Select.Label>Select Difficulty Level</Select.Label>
                                        {useMemo(
                                            () =>
                                                levels.map((item, i) => {
                                                    return (
                                                        <Select.Item
                                                            index={i}
                                                            key={item.name}
                                                            value={item.name.toLowerCase()}
                                                        >
                                                            <Select.ItemText>{item.name}</Select.ItemText>
                                                            <Select.ItemIndicator marginLeft="auto">
                                                                <Ionicons name='checkmark' size={20} />
                                                            </Select.ItemIndicator>
                                                        </Select.Item>
                                                    )
                                                }),
                                            [levels]
                                        )}
                                    </Select.Group>
                                </Select.Viewport>
                            </Select.Content>
                        </Select>
                    </View>








                    {difficulty !== "" && < Pressable className="pt-1 pb-10 " onPress={() => {

                        const diff = levels.filter((item) => item.name.toLocaleLowerCase() == difficulty.toLocaleLowerCase())


                        router.push({
                            pathname: "/Games/wordle",
                            params: {
                                difficulty: diff[0].name,
                                difficultyContent: diff[0].content,

                            }
                        })
                    }}>
                        <View className="flex-row items-center justify-center w-full h-12 bg-black rounded-full">
                            <Text className="font-[NunitoBold] text-white">
                                Start Playing
                            </Text>

                        </View>
                    </Pressable>}
                </View>

            </ScrollView>
        </KeyboardAvoidingView >






    );
}


const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
