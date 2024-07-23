import React, { useState, useCallback, useEffect, useRef } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bubble, Composer, GiftedChat, IMessage, Send, User } from 'react-native-gifted-chat'
import { Avatar, Text, View, XStack, YStack } from 'tamagui';
import { Dimensions, FlatList, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import ask from '@/services/Ask/ask';
import Markdown from 'react-native-markdown-display';
import database from '@react-native-firebase/database';
import img from "./gemini.jpg"
import useChatStore from '@/Storage/Zustand/chat';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { moderateVerticalScale } from 'react-native-size-matters';



export default function Chat() {
    const inset = useSafeAreaInsets()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [history, setHistory] = useState([])
    const [displayResponse, setDisplayResponse] = useState("");
    const [completedTyping, setCompletedTyping] = useState(false);
    const [chatID, setChatID] = useState(null)
    const [newMessage, setNewMessage] = useState(false)
    const hist = useChatStore((state) => state.historyClicked)
    const clickedID = useChatStore((state) => state.clickedID)
    const newChat = useChatStore((state) => state.newChat)
    const chats = useChatStore((state) => state.chats)
    const addMessage = useChatStore((state) => state.addMessage)
    const createNewChat = useChatStore((state) => state.createNewChat)



    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);






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
        console.log(Object.keys(chats).length > 0)
        if (Object.keys(chats).length > 0) {

            if (clickedID) {
                //get chats by id
                const chatHist = chats.filter((chat) => {
                    if (chat.id == clickedID) {
                        return chat
                    }
                })
                const historyArray = chatHist[0].history
                // historyArray.sort((a, b) => new Date(a.date) - new Date(b.date));

                setMessages(historyArray)
                //set message id
                setChatID(clickedID)
                closeDrawer()
            }
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




    const saveToStore = (message, aiResponse, title) => {
        try {
            if (messages.length == 0) {
                setChatID(message._id)
                createNewChat(message._id, [message, aiResponse], title)

            } else {
                addMessage(chatID, [message, aiResponse])
            }
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
            var title = ""

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
                response = await ask.multiconvoChat(history, msg[0].text)
            } else {
                const data = {
                    text: msg[0].text
                }

                let res = await ask.requestChat(data)
                let resTitle = await ask.request({
                    text: `give me a 5 word summary of this statement: ${msg[0].text}`
                })

                response = res.response.text()
                title = resTitle.response.text()
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

            saveToStore(messageText, aiResponse, title)


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
        return (
            <View mb={4} mt={4}>

                <Bubble
                    {...props}
                    wrapperStyle={{
                        left: {
                            backgroundColor: '#d3d3d3'
                        },
                        right: {
                            backgroundColor: "#098756"
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


    const placeholder = "Ask me anything in English "

    const renderChatEmpty = (props) => {
        return (
            <View ai={"center"} className={"h-full"} justifyContent='center' style={{ transform: [{ scaleY: -1 }] }} >
                <View px={10}>
                    <Text ai={"center"} textAlign='center' fontFamily={"NunitoBold"} fontSize={20} color={"black"}>
                        Learn English By Chatting with Gemini
                    </Text>
                    <YStack gap={20} mt={50}>
                        <View className={"h-20 p-4 bg-gray-100 rounded-lg justify-center items-center"}>
                            <Text fontFamily={"NunitoMedium"} color={"black"}  >
                                Generate all the text that you want.
                            </Text>
                            <Text fontFamily={"NunitoMedium"} color={"black"} >
                                (essays, articles, reports, etc)
                            </Text>
                        </View>
                        <View className={"h-20  p-4 bg-gray-100 rounded-lg justify-center items-center"}>
                            <Text fontFamily={"NunitoMedium"} color={"black"} >
                                Engage in a conversation with Gemini to improve your english writing skills.
                            </Text>
                        </View>
                        <View className={"h-20 p-4 bg-gray-100 rounded-lg justify-center items-center"}>
                            <Text fontFamily={"NunitoMedium"} color={"black"} >
                                Learn English By Chatting with Gemini
                            </Text>
                        </View>
                    </YStack >
                </View>
            </View >
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
                        borderColor: onFocus ? "#098756" : "#c0c0c0",
                        borderWidth: 1,
                        width: "100%",
                        minHeight: 40,
                        marginTop: 10,
                        marginBottom: 10

                    }}
                ></Composer>
                <Send {...props} >
                    <View style={{ justifyContent: 'center', height: '100%', marginRight: 10 }}>
                        <Ionicons
                            name='send-sharp'
                            size={30}
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

    const keyboardShouldPersistTaps = 'never'

    const multiline = true
    const renderAvatarOnTop = true
    return (

        <View style={{ width }} bg={"white"} className={"h-full"} pb={isKeyboardVisible ? 0 : moderateVerticalScale(60)} >
            <GiftedChat
                textInputStyle={{ fontFamily: "NunitoBold" }}
                messageContainerRef={chatRef}
                {...{ messages, onSend, multiline, renderSend, keyboardShouldPersistTaps, user, inverted, renderMessageText, renderAvatar, scrollToBottom, renderTime, placeholder, renderChatEmpty, renderDay, renderBubble, renderFooter, renderComposer, renderAvatarOnTop }} listViewProps={{
                    /*   inverted: messages.length <= 0, */
                    showsVerticalScrollIndicator: false
                }}
            />

        </View >


    )
}


const styles = StyleSheet.create({
    body: {
        fontFamily: "NunitoMedium",
        fontSize: 17,
    }
})