import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Image, Platform, Text, Pressable, StatusBar, ImageBackground } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useEffect, useRef, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ask from '@/services/Ask/ask';
import Markdown from 'react-native-markdown-display';
import { View, XStack, YStack } from 'tamagui';
import * as Speech from 'expo-speech';
import img from "../../assets/images/memphis-mini.png";
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
    const [crosswordData, setCrossWordData] = useState()
    const [cols, setCols] = useState(0)
    const [rows, setRows] = useState(0)
    const regexp = /\[([^\]]+)\]/g;
    const params = useLocalSearchParams()


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
            const response = await ask.requestJson(data)
            const res = convertToJson(response.response.text())
            const output = generateLayout(res)
            setCols(output.cols)
            setRows(output.rows)
            let filtered = output.result.filter(clue => clue.orientation !== "none");
            setCrossWordData(filtered)


            setGenerating(false)
        } catch (error) {
            console.log(error)
            setGenerating(false)
        }
    }


    const prompt = `Generate an array of objects with random new words for a cross word puzzle in the format below.
     Note: I want them in a json format..
     Note:The words must all have at least similar characters at least 1 or 2
     Note:The array should only contain 5 items
     Note: The items should be in this difficulty Level : ${params.difficulty}
     Difficulty Description: ${params.difficultyContent}
     Note: The items should be in this category : ${params.category}
     Category Description: ${params.categoryContent}
    const array = [
    {
        "answer": "PATHOGEN",
        "hint": "A bacterium, virus, or other microorganism that can cause disease",
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
        "answer": "INFIN",
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

        <View style={styles.container}>
            {generating ? <View className="flex-col items-center justify-center flex-1 h-screen bg-white">
                <Loading loadingText={` Generating Game Data From Gemini`} />
            </View> : <ImageBackground source={img} resizeMode='cover' className={"h-screen"}>

                {crosswordData && <CrosswordGrid crosswordData={crosswordData} cols={rows} rows={cols} ask={() => {
                    ask1({
                        text: prompt
                    })
                }} />}


            </ImageBackground>}

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})