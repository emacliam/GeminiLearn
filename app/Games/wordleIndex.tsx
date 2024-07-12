import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Platform, TextInput, Pressable, KeyboardAvoidingView, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import Loading from '@/components/Loading';
import { Text, View, XStack } from 'tamagui';

export default function TabTwoScreen() {


    return (


        <KeyboardAvoidingView>

            <ScrollView className={"bg-white "}>
                <View className={"p-4 space-y-1"}>

                    <View style={styles.titleContainer}>
                        <Text fontSize={24} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>How To Play</Text>
                    </View>

                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Guess the Wordle in 6 tries</Text>

                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>- Each guess must be a valid 5-letter word</Text>

                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>- The Colors of the tiles will change to show how close your guess was to the word</Text>

                    <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Example</Text>


                    <XStack gap={10}>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"#6aaa64"}>
                            <Text fontSize={17} fontWeight={"300"} color={"white"} fontFamily={"NunitoBold"}>W</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>E</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>A</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>R</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Y</Text>
                        </View>
                    </XStack>
                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>"W" is the word and in the correct spot</Text>

                    <XStack gap={10}>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>P</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"#c9b458"}>
                            <Text fontSize={17} fontWeight={"300"} color={"white"} fontFamily={"NunitoBold"}>I</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>L</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>L</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>S</Text>
                        </View>
                    </XStack>

                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>"I" is the word but in the wrong spot</Text>
                    <XStack gap={10}>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>V</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>A</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>G</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"#787c7e"}>
                            <Text fontSize={17} fontWeight={"300"} color={"white"} fontFamily={"NunitoBold"}>U</Text>
                        </View>
                        <View ai={"center"} justifyContent='center' borderRadius={30} borderWidth={1} h={40} w={40} borderColor={"$gray10"} bg={"white"}>
                            <Text fontSize={17} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>E</Text>
                        </View>
                    </XStack>

                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>U is not in the word in any spot</Text>


                    <Pressable className="pt-10 pb-10 " onPress={() => {
                        router.push("/Games/wordle")
                    }}>
                        <View className="flex-row items-center justify-center w-full h-12 bg-black rounded-full">
                            <Text className="font-[NunitoBold] text-white">
                                Start Playing
                            </Text>

                        </View>
                    </Pressable>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>






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
