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
import { Text, View } from 'tamagui';

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

            <ScrollView className={"bg-white "}>
                {generating ? <View className="flex-1 h-screen items-center flex-col justify-center bg-[#1d0826]">

                    <Loading loadingText={` Generating story`} />
                </View> : <View className={"p-4 space-y-6"}>

                    <View style={styles.titleContainer}>

                        <Text fontSize={24} fontWeight={"300"} color={"$black"} fontFamily={"NunitoBold"}>Generate Your Own Story</Text>
                    </View>

                    <Text fontSize={18} fontWeight={"300"} color={"$black"} fontFamily={"NunitoMedium"}>Learn vocabulary and comprehension from AI generated stories.</Text>
                    <LinearGradient
                        colors={['red', 'blue']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 10, height: "auto", padding: 1, overflow: "hidden" }}
                    >
                        <View className={"min-h-[10] bg-white rounded-t-[10px] overflow-hidden p-2 flex-row space-x-2 items-center"}>
                            <ThemedText type="subtitle" style={{ fontFamily: "Nunito" }} className="text-black text-[15px] font-normal " style={{ fontFamily: "NunitoRegular" }}>Write a story idea / description</ThemedText>
                        </View>
                        <TextInput onChangeText={text => { setDescription(text) }} multiline={true}
                            numberOfLines={4} className={"min-h-[80] p-2 bg-white rounded-b-[10px] border-t-[0.5px] border-gray-400 overflow-hidden"}></TextInput>
                    </LinearGradient>
                    {!image && <Pressable onPress={pickImage}>
                        <View className="flex-row items-center justify-center p-2 space-x-2 border-2 rounded-lg">
                            <Ionicons name="cloud-upload" size={20} color={"blue"} />
                            <ThemedText type="subtitle" style={{ fontFamily: "Nunito" }} className="text-blue-800 text-[15px] font-normal" style={{ fontFamily: "NunitoRegular" }}>Add Image (Optional)</ThemedText>
                        </View>
                    </Pressable>}
                    {image && <Image source={{ uri: image }} style={{
                        width: 200,
                        height: 200
                    }} />}
                    {image && <Pressable onPress={() => { setImage(null) }}>
                        <View className="flex-row items-center justify-center w-40 p-2 space-x-2">
                            <Ionicons name="trash" size={20} color={"red"} />
                            <ThemedText type="subtitle" style={{ fontFamily: "Nunito" }} className="text-red-600 text-[15px] font-normal" style={{ fontFamily: "NunitoRegular" }}>Remove Image</ThemedText>
                        </View>
                    </Pressable>}
                    <ThemedText>Select Genre/s</ThemedText>
                    <View className="flex-row flex-wrap items-center space-x-2 space-y-2">
                        {GenreList.map((item, index) => {
                            const border = selected.includes(item.name)
                            return (
                                <Pressable key={index} onPress={() => {
                                    GenreSelected(item.name)
                                }}>

                                    <View className={"border-[1px] rounded-lg p-2"} style={{
                                        borderColor: border ? "red" : "blue",

                                    }} >
                                        <ThemedText type="link">{item.name}</ThemedText>
                                    </View>
                                </Pressable>

                            )
                        })}
                    </View>

                    <Pressable className="pb-10 mt-4 " onPress={() => {
                        generateStory()
                    }}>
                        <View className="flex-row items-center justify-center w-full h-12 bg-blue-600 rounded-full">
                            <ThemedText className="font-bold text-white">
                                Generate Story
                            </ThemedText>

                        </View>
                    </Pressable>
                </View>}

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
