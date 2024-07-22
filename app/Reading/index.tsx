import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Platform, TextInput, Pressable, KeyboardAvoidingView, Image } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';

import { Children, useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import ask from '@/services/Ask/ask';
import Loading from '@/components/Loading';
import { Button, Text, TextArea, View } from 'tamagui';

export default function TabTwoScreen() {
    const GenreList = [
        {
            name: "Adventure",
        },
        {
            name: "Fantasy",
        },
        {
            name: "Sci-Fi",
        },
        {
            name: "Mystery",
        },
        {
            name: "Biography",
        },
        {
            name: "Festive",
        },
        {
            name: "Fairy Tales",
        },
        {
            name: "Sports",
        },
        {
            name: "Animal Stories",
        },
        {
            name: "Historical",
        },
        {
            name: "Friendship",
        },

    ];


    const [selected, setSelected] = useState([])
    const [response, setResponse] = useState(null)
    const [generating, setGenerating] = useState(false)

    const GenreSelected = (genre: any) => {
        if (selected.includes(genre)) {
            const itms = selected.filter((item) => {
                return item !== genre
            })
            setSelected(itms)
        } else {
            setSelected(state => [...state, genre])
        }
    }


    const [image, setImage] = useState(null);
    const [mime, setMime] = useState(null)
    const pickImage = async () => {

        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setMime(result.assets[0].mimeType);
        }
    };

    const [description, setDescription] = useState(null)

    const generateStory = async () => {


        try {
            setGenerating(true)

            const genre = selected.toLocaleString()
            const data = {
                text: `Generate a story with this description
                At the top, add a title.
                description: ${description}
                and attached image.
                genre: ${genre}
                If there is no description, just generate using the image provided and if there is no image just use the description
                Also add vocabulary and comprehension analysis for someone who is trying to learn english.
                Add definitions of complex words in the story.Also highlight the words in the story.
                `
            }
            if (image) {
                const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
                data.img = base64
                data.mime = mime
            }
            const response = await ask.multimedia(data)
            setResponse(response.response.text())
            setGenerating(false)

        } catch (error) {
            console.log(error)
            setGenerating(false)
        }

    }


    useEffect(() => {
        if (response) {
            router.push({ pathname: "/Reading/story", params: { response } })
        }
    }, [response])



    return (


        <KeyboardAvoidingView>

            <ScrollView className={"bg-white h-full "}>
                {generating ? <View className="flex-col items-center justify-center flex-1 h-screen bg-white">

                    <Loading loadingText={` Generating story`} />
                </View> : <View className={"p-4 space-y-6"}>

                    <View style={styles.titleContainer}>
                        <Text fontSize={24} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Generate Your Own Story</Text>
                    </View>

                    <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>Learn vocabulary and comprehension from AI generated stories.</Text>


                    <TextArea mt={10} color={"black"} onChangeText={text => { setDescription(text) }} placeholderTextColor={"black"} placeholder='Write a story idea / description'
                        className={" p-2 bg-white text-[15px] rounded-[10px] border-[1px] border-gray-900"}></TextArea>

                    {!image && <Button bg={"$blue10Light"} borderRadius={30} onPress={pickImage}>
                        <View className="flex-row items-center justify-center flex-1 p-2 space-x-4 rounded-full">
                            <Ionicons name="cloud-upload" size={30} color={"white"} />
                            <Text style={{ fontFamily: "Nunito" }} mx={10} className="text-[15px] font-normal text-white" style={{ fontFamily: "NunitoRegular" }}>Add Image (Optional)</Text>
                        </View>
                    </Button>}
                    {image && <Image source={{ uri: image }} style={{
                        width: 200,
                        height: 200
                    }} />}
                    {image && <Pressable onPress={() => { setImage(null) }}>
                        <View className="flex-row items-center justify-center w-40 p-2 space-x-2">
                            <Ionicons name="trash" size={20} color={"red"} />
                            <Text type="subtitle" style={{ fontFamily: "Nunito" }} className="text-red-600 text-[15px] font-normal" style={{ fontFamily: "NunitoRegular" }}>Remove Image</Text>
                        </View>
                    </Pressable>}


                    <Text color={'black'} fontSize={15} style={{ fontFamily: "NunitoMedium" }} mt={15}>Select Genre/s</Text>
                    <View className="flex-row flex-wrap items-center mt-3 space-x-1 space-y-1">
                        {GenreList.map((item, index) => {
                            const border = selected.includes(item.name)
                            return (
                                <Pressable key={index} onPress={() => {
                                    GenreSelected(item.name)
                                }}>

                                    <View className={"border-[1px] rounded-full px-4 py-2"} style={{
                                        borderColor: border ? "#098756" : "#111827",
                                        backgroundColor: border ? "#098756" : "white",


                                    }} >
                                        <Text color={border ? "white" : "#111827"} fontSize={15} style={{ fontFamily: "NunitoMedium" }}>{item.name}</Text>
                                    </View>
                                </Pressable>

                            )
                        })}
                    </View>

                    {image && selected.length > 0 && description !== "" && <Pressable className="pb-10 mt-4 " onPress={() => {
                        generateStory()
                    }}>
                        <View className="flex-row items-center justify-center w-full h-12 bg-black rounded-full">
                            <Text className="font-[NunitoBold] text-white">
                                Generate Story
                            </Text>

                        </View>
                    </Pressable>}
                </View>}

            </ScrollView>
        </KeyboardAvoidingView >






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
