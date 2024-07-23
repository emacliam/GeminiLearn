import { Image, StyleSheet, Platform, Pressable, ScrollView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ask from '@/services/Ask/ask';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import * as Speech from 'expo-speech';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import Loading from '@/components/Loading';
import { AlertDialog, Button, XStack, YStack, Text, View, Select, Adapt, Sheet } from 'tamagui';
import levels from '@/constants/levels';
import { Ionicons } from '@expo/vector-icons';

export default function Notes() {
    const insets = useSafeAreaInsets()
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const [takeTest, setTakeTest] = useState(false)
    const [difficulty, setDifficulty] = useState("")
    const params = useLocalSearchParams()

    const ask1 = async (data: any) => {
        try {
            const response = await ask.request(data)
            setResponse(response.response.text())
            setGenerating(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setGenerating(true)
        ask1({
            text: `Generate a lot of comprehensive notes on this topic to read: ${params.name}`
        })
    }, [])

    useEffect(() => {

    }, [takeTest])

    const navigation = useNavigation()
    navigation.setOptions({
        headerRight: () => {

            return (


                <XStack ai={"center"} justifyContent="space-between" >
                    <AlertDialog>
                        {generating == false && <AlertDialog.Trigger asChild>

                            <View className="flex-row items-center justify-center h-10 px-5 bg-black rounded-full">
                                <Text className="font-[NunitoBold] text-white">
                                    Take A Test
                                </Text>
                            </View>

                        </AlertDialog.Trigger>}
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

                                    <AlertDialog.Description>
                                        <Text fontFamily={"NunitoBold"} fontSize={20}>
                                            Select Test Level
                                        </Text>
                                    </AlertDialog.Description>

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


                                    <XStack space="$3" justifyContent="flex-end">
                                        <AlertDialog.Cancel asChild>

                                            <Button className="flex-row items-center justify-center px-10 bg-gray-400 rounded-full">
                                                <Text className="font-[NunitoBold] text-white">
                                                    Cancel
                                                </Text>

                                            </Button>

                                        </AlertDialog.Cancel>
                                        <AlertDialog.Action asChild>



                                            < Button disabled={difficulty == "" ? true : false} disabledStyle={{ bg: "$gray11", color: "$gray9" }} color={"white"} fontFamily={"NunitoBold"} bg={'black'} borderRadius={30} className="" onPress={() => {

                                                const diff = levels.filter((item) => item.name.toLocaleLowerCase() == difficulty.toLocaleLowerCase())

                                                router.push({
                                                    pathname: "/Grammer/test",
                                                    params: {
                                                        difficulty: diff[0].name,
                                                        difficultyContent: diff[0].content,
                                                        data: response,
                                                        name: params.name
                                                    }
                                                })
                                            }}>

                                                <Text className="font-[NunitoBold] text-white">
                                                    Generate Test
                                                </Text>


                                            </Button>
                                        </AlertDialog.Action>
                                    </XStack>
                                </YStack>
                            </AlertDialog.Content>
                        </AlertDialog.Portal>
                    </AlertDialog>

                </XStack>
            )
        }
    })


    return (
        <View >
            <ScrollView
                className="bg-white"
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                style={{ height: '100%' }}
            >
                {generating && <View className="flex-col items-center justify-center flex-1 h-screen bg-white">
                    <Loading loadingText={` Generating notes on ${params.name} from Gemini`} />
                </View>}
                {generating == false &&

                    <View className="px-4 pt-10">
                        <View className="bg-white">
                            <Markdown style={styles} >
                                {response}
                            </Markdown>
                        </View>
                    </View>
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        fontFamily: "NunitoMedium",
        fontSize: 17,
        paddingBottom: 100
    },
})

