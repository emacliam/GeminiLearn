import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import { StyleSheet, Image, Platform, Text, Pressable, StatusBar, ImageBackground, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useEffect, useRef, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ask from '@/services/Ask/ask';
import Markdown from 'react-native-markdown-display';
import { Button, Input, ScrollView, View, XStack } from 'tamagui';
import * as Speech from 'expo-speech';
import img from "../../assets/images/memphis-mini.png";
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'expo-linear-gradient';



export default function TabTwoScreen() {
    const inset = useSafeAreaInsets()
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const [search, setSearch] = useState("")
    const [showButton, setShowButton] = useState(false)


    useEffect(() => {
        if (search !== "") {
            setShowButton(true)
        } else {
            setShowButton(false)

        }
    }, [search])

    const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)



    function Card({ name, backgroundColor, href, icon, subtext, img }) {
        return (
            <Pressable className="mx-2 flex-1 rounded-2xl shadow-sm  h-[190px] p-3" style={{ backgroundColor }} onPress={() => {
                router.push(href)
            }}>
                <View >
                    <View className="rounded-full w-[50px] h-[50px] p-2 justify-center items-center">
                        <Text className="text-3xl">{img}</Text>
                    </View>
                    <ThemedText className="text-lg font-medium text-black" style={{ fontFamily: "NunitoBold" }}>{name}</ThemedText>
                    <ThemedText type="subtitle" className="text-black text-[15px] font-normal mt-1" style={{ fontFamily: "NunitoMedium" }}>{subtext}</ThemedText>
                </View>
            </Pressable>
        )
    }

    const cards = [
        {
            name: "Grammer",
            backgroundColor: "#fee7de",
            link: '/Grammer',
            icon: <MaterialIcons name="abc" color={"blue"} size={40} />,
            subtext: "Master the essential rules and structure of English grammar.",
            img: "📚"

        },
        {
            name: "Reading",
            backgroundColor: "#ffe1b1",
            link: '/Reading',
            icon: <MaterialCommunityIcons name="book-open-variant" color={"blue"} size={30} />,
            subtext: "Generate Stories and expand your vocabulary.",
            img: "📖"
        },
        {
            name: "Listening",
            backgroundColor: "#dee9b4",
            link: '/Listening',
            icon: <MaterialCommunityIcons name="headset" color={"blue"} size={30} />,
            subtext: "Enhance your listening skills with diverse audio.",
            img: "🔈"
        },
        {
            name: "Writing",
            backgroundColor: "#f7b8cb",
            link: '/Writing',
            icon: <MaterialCommunityIcons name="draw-pen" color={"blue"} size={30} />,
            subtext: "Boost your writing with guided exercises and feedback.",
            img: "📝"
        }
    ]


    const speak = (word) => {
        Speech.speak(word);
    }

    const newWordPrompt = "Generate a random english word to learn for someone learning english. (your response should be the word only)"
    const ask1 = async (data: any) => {
        try {
            setGenerating(true)
            const response = await ask.request(data)
            setResponse(response.response.text())
            setGenerating(false)
        } catch (error) {
            console.log(error)
            setGenerating(false)
        }
    }

    useEffect(() => {
        ask1(
            {
                text: newWordPrompt
            }
        )
    }, [])

    const inserts = useSafeAreaInsets()


    return (
        <View top={inserts.top}>
            <ImageBackground source={img} resizeMode='cover'>
                <View mt={0} px={12} ai={'center'}>
                    <TextGradient
                        style={{ fontSize: 30, fontFamily: "NunitoBold" }}
                        locations={[0, 1]}
                        colors={["blue", "red"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        text="Gemini Learn"
                    />
                </View>
                <ScrollView >
                    <View className="h-screen px-2">

                        <View className="h-auto px-4 py-1 mx-2 mt-4 bg-[#098756] space-y-0  shadow-sm rounded-2xl shadow-blue-200 ">

                            {/*                 <ImageBackground source={newWordImage} resizeMode='cover' style={{ flex: 1, padding: 10, justifyContent: 'center' }}> */}
                            <XStack alignItems='center' justifyContent='space-between'>
                                <ThemedText className="text-xl text-white font-[NunitoBold]">
                                    Learn a new word  🧠
                                </ThemedText>
                                <Pressable className="mt-0 " onPress={() => {
                                    ask1(
                                        {
                                            text: newWordPrompt
                                        }
                                    )
                                }}>

                                    <Ionicons name='refresh-circle' size={30} color={'white'} />

                                </Pressable>
                            </XStack>

                            <XStack gap={20} alignItems='center'>

                                <Pressable className="" onPress={() => {
                                    speak(response)
                                }}>

                                    <Ionicons name='volume-high' size={30} color={'white'} />

                                </Pressable>
                                <ShimmerPlaceHolder shimmerColors={["white", "gray"]} visible={generating == true ? false : true}>
                                    <Markdown style={styles}>
                                        {response}
                                    </Markdown>
                                </ShimmerPlaceHolder>


                            </XStack>
                            <Pressable className="mb-2 " onPress={() => {
                                router.push({
                                    pathname: "/newWord",
                                    params: {
                                        word: response
                                    }
                                })
                            }}>
                                <ThemedText className="font-bold underline text-white font-[NunitoBold]">
                                    Learn More
                                </ThemedText>
                            </Pressable>
                        </View>

                        <XStack mt={10} px={10} alignItems='center' gap={10}>


                            <Input onChangeText={text => {
                                setSearch(text)

                            }} h={40} flex={1} placeholderTextColor={"gray"} placeholder='Search for a word ... '
                                className={"p-2 bg-white  text-[15px] text-black rounded-[10px] border-[1px] border-gray-300 focus:border-[#098756]"}></Input>
                            {showButton && <Button h={40} onPress={() => {

                                router.push({
                                    pathname: "/newWord",
                                    params: {
                                        word: search
                                    }
                                })

                            }}>Search</Button>}

                        </XStack>

                        <View className="w-full mt-2 border-black border-3" >
                            <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ rowGap: 15, paddingBottom: 60 }} numColumns={2} data={cards} renderItem={({ item, index }) => {
                                return (
                                    <Card href={item.link} backgroundColor={item.backgroundColor} name={item.name} icon={item.icon} subtext={item.subtext} img={item.img} />
                                )
                            }} />
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>


    );
}

const styles = StyleSheet.create({
    body: {
        fontFamily: "NunitoMediumItalic",
        fontSize: 20,
        color: "white"
    }
})