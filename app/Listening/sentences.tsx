import { FlatList, SafeAreaView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Avatar, Button, Card, H2, TabLayout, TabsTabProps, StackProps, styled, AnimatePresence, Image, Label, Paragraph, ScrollView, SizableText, Switch, Tabs, Text, Tooltip, View, XStack, YStack, useTheme, H5, Slider } from 'tamagui'
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ask from '@/services/Ask/ask';
import * as Speech from 'expo-speech';
import Loading from '@/components/Loading';


export default function Listen() {
    const { top } = useSafeAreaInsets()
    const theme = useTheme()
    const [active, setActive] = useState(false)
    const [stop, setStop] = useState<boolean>(true)
    const [Words, setWords] = useState(null)
    const [Phrases, setPhrases] = useState(null)
    const [response, setResponse] = useState("")
    const [generating, setGenerating] = useState(false)
    const regexp = /\[([^\]]+)\]/g;



    const speak = (word) => {
        Speech.speak(word);
    }

    const stopSpeaking = () => {
        Speech.stop()
    }


    const [availableVoices, setAvailableVoices] = useState([])
    useEffect(() => {
        (async () => {
            const voices = await Speech.getAvailableVoicesAsync()
            setAvailableVoices(voices)
        })()
    }, [])

    const convertToJson = (str) => {
        let match;
        let matches = [];
        matches = str.match(regexp);
        const converted = JSON.parse(matches[0])
        return converted

    }

    const ask2 = async (data: any) => {
        try {

            setGenerating(true)
            const response = await ask.request(data)

            const res = convertToJson(response.response.text())

            setPhrases(res)
            setGenerating(false)
        } catch (error) {
            console.log(error)
            setGenerating(false)
        }
    }




    const prompt2 = `I want a list of vocabulary sentences maximum 20.
    I want them in a json format like this one.dont highlight any word.each sentence should have 20 words
    const phrases = [{
        "phrase":"",
    }]
    `



    useEffect(() => {

        ask2({
            text: prompt2
        })
    }, [])









    return (

        <>

            {generating ? <View className="flex-1 h-screen items-center flex-col justify-center bg-[#1d0826]">
                <Loading loadingText={` Generating random sentences from Gemini`} />
            </View> : <View mt={0} px={10} flex={1} alignItems="center" pt={30} bg="white" >
                <View flex={1} mx={30} w={'100%'}>
                    <View>
                        <ThemedView>
                            <ThemedText type="title">Vocabulary</ThemedText>
                        </ThemedView>
                        <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{
                            marginBottom: 100,
                            rowGap: 10,
                            marginTop: 20
                        }} data={Words} ListFooterComponent={<View />}
                            ListFooterComponentStyle={{ height: 150 }} ItemSeparatorComponent={() => {
                                return (<View width={10}></View>)
                            }} renderItem={({ item, index }) => {
                                return (
                                    <Card padded gap={10}>
                                        <YStack gap={3} >

                                            <Text fontSize={15} fontWeight={"300"} color={"$gray11"} fontFamily={"NunitoMedium"}>{item.phrase}</Text>
                                        </YStack>
                                        <XStack justifyContent="space-between" alignContent="center" alignItems="center" >

                                            <Card onPress={() => {
                                                speak(item.phrase)
                                            }} padding={10} borderRadius={100} backgroundColor={"$gray8"} justifyContent='center' alignContent='center' alignItems='center'>
                                                <Ionicons name="volume-medium" size={24} color={active ? "#1ca655" : "black"} />
                                            </Card>
                                        </XStack>


                                    </Card>
                                )
                            }} />
                    </View>
                </View>
            </View >}



        </>


    )
}

