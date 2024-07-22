import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import { StyleSheet, Platform, Pressable, StatusBar, ImageBackground } from 'react-native';
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
import { ScrollView, View, XStack, YStack, Image, Button, Text } from 'tamagui';
import * as Speech from 'expo-speech';
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



    function Card({ name, backgroundColor, href, icon, subtext }) {
        return (
            <Button h={60} className="flex-1 p-3 mx-2 mt-2 shadow-lg rounded-2xl" style={{ backgroundColor }} onPress={() => {
                router.push(href)
            }}>
                <XStack alignItems='center' gap={15}>

                    <YStack>
                        <Text className="text-lg font-medium text-black" style={{ fontFamily: "NunitoBold" }}>{name}</Text>

                    </YStack>
                    {icon}
                </XStack>
            </Button>
        )
    }

    const cards = [
        {
            name: "Transcribe",
            backgroundColor: "white",
            link: '/Speech/transcribe',
            icon: <MaterialIcons name="transcribe" color={"black"} size={30} />,
            subtext: "Boost your writing with guided.",

        }, {
            name: "Speak to Gemini",
            backgroundColor: "white",
            link: '/Speech/speak',
            icon: <MaterialCommunityIcons name="text-to-speech" color={"black"} size={30} />,
            subtext: "Test Your Vocabulary",

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
        <View bg={"white"} >


            <ScrollView >
                <View mx={10} className="h-screen px-2 ">
                    <YStack gap={12} mt={20}>
                        <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Speak, Record, Transcribe, and Learn</Text>
                        <Text fontSize={15} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Enhance Your English Skills in Real-Time:</Text>
                        <Text fontSize={15} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>- Record & Transcribe: Learn to speak better english through transcriptions.Easily record your conversations, lectures, or thoughts, and get accurate transcriptions to help you improve your listening and writing skills.
                        </Text>
                        <Text fontSize={15} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>- Speak with AI: Engage in interactive conversations with our advanced AI to practice speaking and get instant feedback on your pronunciation and grammar.</Text>
                    </YStack>
                    <View className="w-full pt-4 border-black border-3 " >
                        <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ rowGap: 15, paddingBottom: 200 }} numColumns={1} data={cards} renderItem={({ item, index }) => {
                            return (
                                <Card href={item.link} backgroundColor={item.backgroundColor} name={item.name} icon={item.icon} subtext={item.subtext} />
                            )
                        }} />
                    </View>
                </View>
            </ScrollView>

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