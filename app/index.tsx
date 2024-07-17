import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Platform, Dimensions, Pressable } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Children } from 'react';
import { Link, router } from 'expo-router';
import { Text, View, XStack, YStack, Image } from 'tamagui';
import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import img from "../assets/images/gemini2.png"

export default function TabTwoScreen() {

    return (

        <View bg={"#0a905d"} className={"h-full"}>
            <YStack justifyContent='space-between' h={"100%"} alignItems='center'>
                <XStack pt={50} px={12} justifyContent='center' alignItems='center' gap={10}>
                    <View>
                        <Image source={img} width={40} height={40}  ></Image>
                    </View>

                    <TextGradient
                        style={{ fontSize: 30, fontFamily: "NunitoBold" }}
                        locations={[0, 1]}
                        colors={["white", "white"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        text="Gemini Learn"
                    />
                </XStack>

                <View style={styles.titleContainer}>

                    <Text fontSize={30} textAlign='center' color={"white"} fontFamily={"NunitoBold"}>Become an English expert by learning with Gemini Learn</Text>

                </View>
                <Pressable className="pb-10 mt-4 " onPress={() => {
                    router.push("/(tabs)")
                }}>
                    <View className="flex-row items-center justify-center px-[100px] h-12 bg-black rounded-full">
                        <Text className="font-[NunitoBold] text-center  text-white">
                            Start Learning
                        </Text>

                    </View>
                </Pressable>
            </YStack>



        </View>

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
