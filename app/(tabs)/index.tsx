import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import { StyleSheet, Image, Platform, View, Text, Pressable, StatusBar } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useRef, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';



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



    function Card({ name, backgroundColor, href, icon, subtext, img }) {
        return (
            <Pressable className="mx-2 flex-1 rounded-2xl   shadow-sm  h-[200px] p-3" style={{ backgroundColor }} onPress={() => {
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

    return (
        <View className="px-4 bg-[#f8f9fe] h-screen">


            {/*   <View className="h-32 mt-5">
        <ThemedText className="mx-2 mb-3 text-xl font-medium text-black">AI Generated Random Practice</ThemedText>
        <Carousel
          style={{
            width: "100%",
            height: 280,
            alignItems: "center",
            justifyContent: "center",
          }}
          width={400}
          height={280}
          pagingEnabled={pagingEnabled}
          snapEnabled={snapEnabled}
          mode={"vertical-stack"}
          loop={true}
          data={data}
          modeConfig={{
            snapDirection,
            stackInterval: 10,
          }}
          customConfig={() => ({ type: "positive", viewCount })}
          renderItem={({ index }) => (

            <Animated.View
              entering={FadeInRight.delay(
                (viewCount - index) * 100,
              ).duration(200)}
              className="bg-blue-600  rounded-2xl h-[150px] w-full flex-row items-center justify-center">
              <ThemedText className="font-bold text-white">
                Chat with AI to practice English
              </ThemedText>

            </Animated.View>
          )}
        />
      </View> */}

            <View className="flex-col items-center justify-center">
                <ThemedText className="text-black mb-5 mt-[50px] text-center text-[20px] font-[NunitoBold]" >Master English with Gemini AI: Your Personal Language Companion</ThemedText>
            </View>

            <View className="w-full mt-10 border-black border-3" >
                <FlatList contentContainerStyle={{ rowGap: 15, padding: 3 }} numColumns={2} data={cards} renderItem={({ item, index }) => {
                    return (
                        <Card href={item.link} backgroundColor={item.backgroundColor} name={item.name} icon={item.icon} subtext={item.subtext} img={item.img} />
                    )
                }} />
            </View>


            <Pressable className="mt-4 " onPress={() => {
                router.push("/wheel")
            }}>
                <View className="flex-row items-center justify-center w-full h-12 bg-blue-600 rounded-full ">
                    <ThemedText className="font-bold text-white font-[NunitoBold]">
                        Play Wheel Of Words
                    </ThemedText>
                </View>
            </Pressable>
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

