import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import { StyleSheet, Image, Platform, Text, Pressable, StatusBar, ImageBackground } from 'react-native';
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
import { ScrollView, View, XStack, YStack } from 'tamagui';
import * as Speech from 'expo-speech';
import img from "../../assets/images/memphis-mini.png";
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'expo-linear-gradient';



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
    const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)



    function Card({ name, backgroundColor, href, icon, subtext, img }) {
        return (
            <Pressable className="flex-1 h-auto p-3 mx-2 shadow-sm rounded-2xl" style={{ backgroundColor }} onPress={() => {
                router.push(href)
            }}>
                <XStack >
                    <View className="rounded-full w-[50px] h-[50px] p-2 justify-center items-center">
                        <Text className="text-3xl">{img}</Text>
                    </View>
                    <YStack>
                        <ThemedText className="text-lg font-medium text-black" style={{ fontFamily: "NunitoBold" }}>{name}</ThemedText>
                        <ThemedText type="subtitle" className="text-black text-[15px] font-normal mt-1" style={{ fontFamily: "NunitoMedium" }}>{subtext}</ThemedText>
                    </YStack>
                </XStack>
            </Pressable>
        )
    }

    const cards = [
        {
            name: "Cross Word",
            backgroundColor: "#f7b8cb",
            link: '/Games/cross',
            icon: <MaterialCommunityIcons name="draw-pen" color={"blue"} size={30} />,
            subtext: "Boost your writing with guided.",
            img: "📝"
        }, {
            name: "Word Coach",
            backgroundColor: "#ffe1b1",
            link: '/Games/wordCoach',
            icon: <MaterialCommunityIcons name="book-open-variant" color={"blue"} size={30} />,
            subtext: "Text Your Vocabulary",
            img: "📖"
        },
        {
            name: "Wheel Of Words",
            backgroundColor: "#fee7de",
            link: '/Games/wheel',
            icon: <MaterialIcons name="abc" color={"blue"} size={40} />,
            subtext: "Master the essential rules.",
            img: "📚"

        },

        {
            name: "Sentence Construction",
            backgroundColor: "#dee9b4",
            link: '/Games/sentenceConstruction',
            icon: <MaterialCommunityIcons name="headset" color={"blue"} size={30} />,
            subtext: "Enhance your listening skills.",
            img: "🔈"
        },
        {
            name: "Wordle",
            backgroundColor: "#dee9b4",
            link: '/Games/wordleIndex',
            icon: <MaterialCommunityIcons name="headset" color={"blue"} size={30} />,
            subtext: "Enhance your listening skills.",
            img: "🔈"
        },

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
        <View >
            <ImageBackground source={img} resizeMode='cover'>

                <ScrollView >
                    <View className="h-screen px-2">
                        <View className="w-full mt-4 border-black border-3" >
                            <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ rowGap: 15, paddingBottom: 200 }} numColumns={1} data={cards} renderItem={({ item, index }) => {
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