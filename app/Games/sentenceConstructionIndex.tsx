

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

                    <Text fontSize={17} color={"black"} fontFamily={"NunitoBold"} pt={0}>Drag and Drop</Text>

                    <Text fontSize={16} color={"black"} fontFamily={"NunitoMedium"}>- Drag each word to the sentence area to form a complete sentence.</Text>

                    <Text fontSize={17} color={"black"} fontFamily={"NunitoBold"} pt={0}>Order Matters</Text>

                    <Text fontSize={16} color={"black"} fontFamily={"NunitoMedium"}>- Arrange the words in the correct order to make a meaningful sentence.</Text>

                    <Text fontSize={17} color={"black"} fontFamily={"NunitoBold"} pt={0}>Check Your Sentence</Text>

                    <Text fontSize={16} color={"black"} fontFamily={"NunitoMedium"}>- Tap 'Check' to see if your sentence is correct.</Text>
                    <Text fontSize={17} color={"black"} fontFamily={"NunitoBold"} pt={0}>Try Again</Text>

                    <Text fontSize={16} color={"black"} fontFamily={"NunitoMedium"}>- If your sentence is incorrect, adjust the order and try again.</Text>
                    <Text fontSize={16} color={"black"} fontFamily={"NunitoMedium"}>- Use hints if you get stuck.</Text>



                    <Text fontSize={17} pt={10} color={"black"} fontFamily={"NunitoBold"}>Select Category and Difficulty Level to start playing</Text>
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
                    <View mt={15}>
                        <Select value={category} onValueChange={setCategory} disablePreventBodyScroll >
                            <Select.Trigger width={"100%"} borderRadius={30} iconAfter={<Ionicons name='chevron-down' size={15} color={"white"} />}>
                                <Select.Value placeholder="Select Category" />
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
                                        <Select.Label>Select Category</Select.Label>
                                        {useMemo(
                                            () =>
                                                cat.map((item, i) => {
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
                                            [cat]
                                        )}
                                    </Select.Group>
                                </Select.Viewport>
                            </Select.Content>
                        </Select>
                    </View>







                    {difficulty !== "" && category !== "" && < Pressable className="pt-1 pb-10 " onPress={() => {

                        const diff = levels.filter((item) => item.name.toLocaleLowerCase() == difficulty.toLocaleLowerCase())
                        const catt = cat.filter((item) => item.name.toLocaleLowerCase() == category.toLocaleLowerCase())

                        router.push({
                            pathname: "/Games/sentenceConstruction",
                            params: {
                                difficulty: diff[0].name,
                                difficultyContent: diff[0].content,
                                category: catt[0].name,
                                categoryContent: catt[0].content
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
