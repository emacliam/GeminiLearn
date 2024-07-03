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
import img from "../../../assets/images/memphis-mini.png";
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'expo-linear-gradient';
import CrosswordGrid from '@/components/crossWord';
import { moderateVerticalScale } from 'react-native-size-matters';
import Loading from '@/components/Loading';
import generateLayout from "@/scripts/layout_generator"



export default function TabTwoScreen() {
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
    const [crosswordData, setCrossWordData] = useState([])
    const regexp = /\[([^\]]+)\]/g;

    const convertToJson = (str) => {
        let match;
        let matches = [];
        matches = str.match(regexp);
        const converted = JSON.parse(matches[0])
        return converted

    }

    const ask1 = async (data: any) => {
        try {
            setGenerating(true)
            const response = await ask.request(data)
            const res = convertToJson(response.response.text())
            console.log("kkkk", res)

            const output = generateLayout(res)
            setCrossWordData(output.result)
            console.log(output.result)


            setGenerating(false)
        } catch (error) {
            console.log(error)
            setGenerating(false)
        }
    }


    const prompt = `Generate an array of objects with random new words in the format below.
     Note: I want them in a json format..
     Note: Each word should be a maximum of 6 characters
    const array = [
    {
        "answer": "TIGER",
        "hint": "The powerful predator roams the jungle",
    },
    {
        "answer": "EAGLE",
        "hint": "A majestic bird known for its keen eyesight",
    },
    {
        "answer": "ITALIC",
        "hint": "It's a style of typeface characterized by slanted letters",
    },
    {
        "answer": "INFINITE",
        "hint": "It describes something boundless or limitless in extent or quantity",
    }

]

    `




    useEffect(() => {
        ask1({
            text: prompt
        })
    }, [])





    return (

        <ScrollView style={styles.container} >
            {generating ? <View className="flex-col items-center justify-center flex-1 h-screen bg-white">
                <Loading loadingText={` Generating Game Data From Gemini`} />
            </View> : <ImageBackground source={img} resizeMode='cover' className={"h-screen"}>
                <View className={"h-full"} px={10}>
                    {crosswordData.length > 0 && <CrosswordGrid crosswordData={[crosswordData]} />}

                </View>
            </ImageBackground>}

        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})