import React, { useState, useCallback, useEffect, useRef } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bubble, Composer, GiftedChat, IMessage, Send, User } from 'react-native-gifted-chat'
import { Avatar, Text, View, XStack, YStack } from 'tamagui';
import { Dimensions, FlatList, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import ask from '@/services/Ask/ask';
import Markdown from 'react-native-markdown-display';
import database from '@react-native-firebase/database';
import img from "./gemini.jpg"
import useChatStore from '@/Storage/Zustand/chat';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';



export default function Chat() {
    const inset = useSafeAreaInsets()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [history, setHistory] = useState([])
    const [displayResponse, setDisplayResponse] = useState("");
    const [completedTyping, setCompletedTyping] = useState(false);
    const [chatID, setChatID] = useState(null)
    const [newMessage, setNewMessage] = useState(false)
    const hist = useChatStore((state) => state.history)

    const newChat = useChatStore((state) => state.newChat)





    function getUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    const navigation = useNavigation()
    const closeDrawer = () => {
        navigation.dispatch(DrawerActions.closeDrawer())
    }
    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
    };


    useEffect(() => {

        if (Object.keys(hist).length > 0) {


            const historyArray = Object.keys(hist).map(key => {
                return {
                    ...hist[key]
                };
            });


            historyArray.sort((a, b) => new Date(a.date) - new Date(b.date));

            setMessages(historyArray)
            //set message id
            setChatID(historyArray[0]._id)
            closeDrawer()

        }
    }, [hist])


    useEffect(() => {
        setMessages([])
    }, [newChat])


    useEffect(() => {
        if (!messages?.length) {
            return;
        }

        setCompletedTyping(false);
        let i = 0;
        const stringResponse = messages[messages.length - 1].text;
        const intervalId = setInterval(() => {
            setDisplayResponse(stringResponse.slice(0, i));
            i++;
            if (i > stringResponse.length) {
                clearInterval(intervalId);
                setCompletedTyping(true);
                setNewMessage(false)
                chatRef.current?.scrollToEnd();
            }
        }, 20);
        return () => clearInterval(intervalId);
    }, [messages]);




    const saveToFirebase = (message, aiResponse) => {
        try {
            if (messages.length == 0) {
                setChatID(message._id)
                database()
                    .ref(`/chats/${message._id}`)
                    .set({
                        chatTitle: message.text,
                        chatId: message._id,
                        history: []
                    })
                    .then(() => console.log('Chat Created'));

                saveData(message._id, message, aiResponse)

            } else {
                saveData(chatID, message, aiResponse)
            }
        } catch (error) {
            console.log(error)
        }


    }


    const saveData = (messageID, message, aiResponse) => {
        console.log("ai response", message)
        try {
            const newReference1 = database().ref(`/chats/${messageID}/history`).push();
            const newReference2 = database().ref(`/chats/${messageID}/history`).push();

            var promise1 = newReference1.set(message)
            var promise2 = newReference2.set(aiResponse)

            Promise.all([promise1, promise2]).then(() => {
                console.log("history saved successfully")
            }).catch((error) => {
                console.log("Error pushing history", error)
            })

        } catch (error) {
            console.log(error)
        }
    }


    /*  role: "user",
                    parts: [{
                        "text": params.prompt
                    }] */
    const sendMessage = async (msg) => {

        setMessages([...messages, ...msg])
        const messageText = msg[0]
        messageText.date = (new Date()).toISOString()
        try {

            const history = []
            var response = null

            if (messages.length > 0) {
                messages.forEach(element => {
                    const histItem = {
                        role: element.user.name,
                        parts: [
                            {
                                "text": element.text
                            }
                        ]
                    }
                    history.push(histItem)
                });
            }


            if (history.length > 0) {
                response = await ask.multiconvo(history, msg[0].text)
            } else {
                const data = {
                    text: msg[0].text
                }

                let res = await ask.request(data)
                response = res.response.text()
            }



            const aiResponse = {
                _id: getUUID(),
                role: "",
                user: {
                    _id: 2,
                    name: "model"
                },
                text: response,
                createdAt: new Date(),
                date: (new Date()).toISOString()
            }


            setNewMessage(true)
            setMessages([...messages, messageText, aiResponse])
            saveToFirebase(messageText, aiResponse)


        } catch (error) {
            console.log(error)
        }
    }


    const onSend = (newMsg: IMessage[]) => sendMessage(newMsg)
    const user: User = { _id: 1, name: 'user' }
    const inverted = false
    const scrollToBottom = true
    const { width, height } = Dimensions.get("screen")
    const renderMessageText = (props) => {
        return (
            <View px={8}>
                {props.currentMessage.user.name == "model" ? <Markdown style={styles}>
                    {newMessage ? displayResponse : props.currentMessage.text}
                </Markdown> : <Text p={2} color={"white"} style={styles.body}>
                    {props.currentMessage.text}
                </Text>}
            </View>
        )
    }

    const renderAvatar = (props) => {

        if (props.currentMessage.user.name == "model") {
            return (
                <Avatar borderRadius={30}>

                    <Avatar.Image src={img} >

                    </Avatar.Image>
                </Avatar>
            );
        }
        return (null);
    }

    const renderTime = () => {
        return (
            <></>

        )
    }


    const renderBubble = (props) => {
        console.log(props)
        return (
            <View mb={4} mt={4}>

                <Bubble
                    {...props}
                    wrapperStyle={{
                        left: {
                            backgroundColor: '#d3d3d3'
                        }
                    }}
                />
                {props.position == "left" && <View px={10} py={5}>
                    <XStack>
                        <TouchableOpacity onPress={() => {
                            copyToClipboard(props.currentMessage.text)
                        }}>
                            <Ionicons name='copy-outline' color={"gray"} size={20} />
                        </TouchableOpacity>
                    </XStack>
                </View>}
            </View>
        );
    }

    /*     const renderComposer = (props) => {
            return (
                <View style={styles.composerContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput {...props}
                            placeholder={'Type something...'}
                            ref={(input) => { this.msgInput = input; }}
                            onChangeText={(value) => this.onTextChange(value, props)}
                            style={styles.textInput}
                            value={props.text}
                            multiline={true}
                        />
                    </View>
                    <Send {...props} containerStyle={styles.sendWrapperStyle} >
                        <View style={styles.sendContainer}>
     
                        </View>
                    </Send>
                </View>
            )
        } */

    const placeholder = "Ask me anything ... "

    const renderChatEmpty = (props) => {
        return (
            <View ai={"center"} className={"h-full"} justifyContent='center' >
                <Text fontFamily={"NunitoBold"} fontSize={20}>
                    Learn English By Chatting with Gemini
                </Text>
                <YStack gap={20} mt={50}>
                    <View className={"h-20 p-4 bg-gray-100 rounded-lg justify-center items-center"}>
                        <Text fontFamily={"NunitoMedium"}>
                            Generate all the text that you want.
                        </Text>
                        <Text fontFamily={"NunitoMedium"}>
                            (essays, articles, reports, etc)
                        </Text>
                    </View>
                    <View className={"h-20 w-10/12  p-4 bg-gray-100 rounded-lg justify-center items-center"}>
                        <Text fontFamily={"NunitoMedium"}>
                            Engage in a conversation with Gemini to improve your english writing skills.
                        </Text>
                    </View>
                    <View className={"h-20 p-4 bg-gray-100 rounded-lg justify-center items-center"}>
                        <Text fontFamily={"NunitoMedium"}>
                            Learn English By Chatting with Gemini
                        </Text>
                    </View>
                </YStack>
            </View>
        )
    }

    const renderDay = () => {
        return (
            <></>
        )
    }

    const chatRef = useRef<FlatList<IMessage> | null>(null);
    const renderFooter = (props) => {
        return <View {...props} height={40}></View>;
    };

    const [onFocus, setOnFocus] = useState(false)
    const renderComposer = (props) => {
        return (
            <View className='flex-row items-center'>
                <Composer
                    {...props}
                    textInputProps={{
                        onFocus: () => setOnFocus(true),
                        onBlur: () => setOnFocus(false),
                        marginHorizontal: 12,
                        blurOnSubmit: true,
                        paddingVertical: 0,
                        paddingHorizontal: 15,
                        backgroundColor: onFocus ? "#fff" : "#fff",
                        borderRadius: 10,
                        borderColor: onFocus ? "#034ad9" : "#c0c0c0",
                        borderWidth: 2,
                        width: "100%",
                        minHeight: 40,

                    }}
                ></Composer>
                <Send {...props} >
                    <View style={{ justifyContent: 'center', height: '100%', marginRight: 10 }}>
                        <Ionicons
                            name='send'
                            size={24}
                            color={"black"}
                        />
                    </View>
                </Send>
            </View>
        );
    };

    const renderSend = (props) => {
        return (

            <></>
        )
    }

    const multiline = true
    const renderAvatarOnTop = true
    return (

        <View style={{ width }} bg={"white"} className={"h-full"} >
            <GiftedChat
                textInputStyle={{ fontFamily: "NunitoBold" }}
                messageContainerRef={chatRef}
                {...{ messages, onSend, multiline, renderSend, user, inverted, renderMessageText, renderAvatar, scrollToBottom, renderTime, placeholder, renderChatEmpty, renderDay, renderBubble, renderFooter, renderComposer, renderAvatarOnTop }} listViewProps={{
                    inverted: messages.length <= 0,
                    showsVerticalScrollIndicator: false
                }}
            />
        </View >


    )
}


const styles = StyleSheet.create({
    body: {
        fontFamily: "Nunito",
        fontSize: 17
    }
})