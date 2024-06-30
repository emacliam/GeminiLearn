import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import { StyleSheet, Image, Platform, View, Text, Pressable, StatusBar, ImageBackground } from 'react-native';
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
import { XStack } from 'tamagui';
import * as Speech from 'expo-speech';
import newWordImage from '../../assets/images/bgImg.jpg';



export default function TabTwoScreen() {
    const inset = useSafeAreaInsets()

    const [snapDirection, setSnapDirection] = useState<"left" | "right">(
        "left",
    );
    const [pagingEnabled, setPagingEnabled] = useState<boolean>(true);
    const [snapEnabled, setSnapEnabled] = useState<boolean>(true);

    const [autoPlayReverse, setAutoPlayReverse] = useState<boolean>(false);
    const data = useRef<number[]>([...new Array(6).keys()]).current;
    const viewCount = 2;

    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)



    function Card({ name, backgroundColor, href, icon, subtext, img }) {
        return (
            <Pressable className="mx-2 flex-1 rounded-2xl   shadow-sm  h-[190px] p-3" style={{ backgroundColor }} onPress={() => {
                router.push(href)
            }}>
                <View >
                    <View className="rounded-full w-[50px] h-[50px] p-2 justify-center items-center">
                        <Text className="text-3xl">{img}</Text>
                    </View>
                    <ThemedText className="text-lg font-medium text-black" style={{ fontFamily: "NunitoBold" }}>{name}</ThemedText>
                    <ThemedText type="subtitle" className="text-black text-[15px] font-normal mt-1" style={{ fontFamily: "NunitoRegular" }}>{subtext}</ThemedText>
                </View>
            </Pressable>
        )
    }

    const cards = [
        {
            name: "Grammer",
            backgroundColor: "white",
            link: '/Grammer',
            icon: <MaterialIcons name="abc" color={"blue"} size={40} />,
            subtext: "Master the essential rules and structure of English grammar.",
            img: "📚"

        },
        {
            name: "Reading",
            backgroundColor: "white",
            link: '/Reading',
            icon: <MaterialCommunityIcons name="book-open-variant" color={"blue"} size={30} />,
            subtext: "Generate Stories and expand your vocabulary.",
            img: "📖"
        },
        {
            name: "Listening",
            backgroundColor: "white",
            link: '/Listening',
            icon: <MaterialCommunityIcons name="headset" color={"blue"} size={30} />,
            subtext: "Enhance your listening skills with diverse audio.",
            img: "🔈"
        },
        {
            name: "Writing",
            backgroundColor: "white",
            link: '/Writing',
            icon: <MaterialCommunityIcons name="draw-pen" color={"blue"} size={30} />,
            subtext: "Develop strong writing abilities through guided exercises and feedback.",
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



    return (
        <View className="px-4 bg-[#f8f9fe] h-screen">
            {/*   <View className="flex-col items-center justify-center">
                <ThemedText className="text-black mb-5 mt-[50px] text-center text-[20px] font-[NunitoBold]" >Master English with Gemini AI: Your Personal Language Companion</ThemedText>
            </View> */}

            {response && <View className="mx-2 rounded-2xl mt-10 shadow-sm shadow-blue-200 p-6  h-[12]40px] bg-white ">

                {/*                 <ImageBackground source={newWordImage} resizeMode='cover' style={{ flex: 1, padding: 10, justifyContent: 'center' }}> */}
                <ThemedText className="text-xl text-black font-[NunitoBold]">
                    Learn a new word  🧠
                </ThemedText>

                <XStack gap={20}>

                    <Pressable className="mt-2 " onPress={() => {
                        speak(response)
                    }}>
                        <View className="flex-row items-center justify-center p-2 bg-blue-600 rounded-full ">
                            <Ionicons name='volume-high-outline' size={20} color={'white'} />
                        </View>
                    </Pressable>
                    <Markdown style={styles}>
                        {response}
                    </Markdown>

                </XStack>
                <Pressable className="mt-2 " onPress={() => {
                    router.push({
                        pathname: "/newWord",
                        params: {
                            word: response
                        }
                    })
                }}>
                    <ThemedText className="font-bold underline text-black font-[NunitoBold]">
                        Learn More
                    </ThemedText>

                </Pressable>


            </View>}

            <View className="w-full mt-5 border-black border-3" >
                <FlatList contentContainerStyle={{ rowGap: 15, padding: 3 }} numColumns={2} data={cards} renderItem={({ item, index }) => {
                    return (
                        <Card href={item.link} backgroundColor={item.backgroundColor} name={item.name} icon={item.icon} subtext={item.subtext} img={item.img} />
                    )
                }} />
            </View>


            {/* <Pressable className="mt-4 " onPress={() => {
                router.push("/wheel")
            }}>
                <View className="flex-row items-center justify-center w-full h-12 bg-blue-600 rounded-full ">
                    <ThemedText className="font-bold text-white font-[NunitoBold]">
                        Play Wheel Of Words
                    </ThemedText>
                </View>
            </Pressable> */}
            <Pressable className="mt-4 " onPress={() => {
                router.push("/Chat")
            }}>
                <View className="flex-row items-center justify-center w-full h-12 bg-blue-600 rounded-full ">
                    <ThemedText className="font-bold text-white font-[NunitoBold]">
                        Chat With AI
                    </ThemedText>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        fontFamily: "NunitoMediumItalic",
        fontSize: 17,
        textDecorationLine: "underline"
    }
})