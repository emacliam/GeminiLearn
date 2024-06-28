import React, { useState, useCallback, useEffect } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, Send, User } from 'react-native-gifted-chat'
import { Avatar, Text, View } from 'tamagui';
import { Dimensions } from 'react-native';
import ask from '@/services/Ask/ask';
import Markdown from 'react-native-markdown-display';
import database from '@react-native-firebase/database';
import img from "./gemini.jpg"
import useChatStore from '@/Storage/Zustand/chat';
export default function Chat() {
    const inset = useSafeAreaInsets()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [history, setHistory] = useState([])
    const [displayResponse, setDisplayResponse] = useState("");
    const [completedTyping, setCompletedTyping] = useState(false);
    const [chatID, setChatID] = useState(null)
    const hist = useChatStore((state) => state.history)

    useEffect(() => {
        if (hist.length > 0) {
            setMessages(hist)
        }
    }, [hist])


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
            }
        }, 20);
        return () => clearInterval(intervalId);
    }, [messages]);


    const saveToFirebase = (message, aiResponse) => {
        try {
            if (messages.length == 0) {
                setChatID(message[0]._id)
                database()
                    .ref(`/chats/${message[0]._id}`)
                    .set({
                        chatTitle: message[0].text,
                        chatId: message[0]._id,
                        history: []
                    })
                    .then(() => console.log('Chat Created'));

                saveData(message[0]._id, message, aiResponse)

            } else {
                saveData(chatID, message, aiResponse)
            }
        } catch (error) {
            console.log(error)
        }


    }


    const saveData = (messageID, message, aiResponse) => {
        console.log("ai response", message[0])
        try {
            const newReference1 = database().ref(`/chats/${messageID}/history`).push();
            const newReference2 = database().ref(`/chats/${messageID}/history`).push();

            var promise1 = newReference1.set(message[0])
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
                _id: msg[0]._id + 1,
                role: "",
                user: {
                    _id: 2,
                    name: "model"
                },
                text: response,
                createdAt: new Date()
            }

            setMessages([...messages, ...msg, aiResponse])
            saveToFirebase(msg, aiResponse)


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
                {props.currentMessage.user.name == "model" ? <Markdown>
                    {displayResponse}
                </Markdown> : <Text p={2} color={"white"}>
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

    const placeholder = "Enter a prompt here"

    const renderChatEmpty = (props) => {
        return (
            <View >
                <Text>
                    hi how are you
                </Text>
            </View>
        )
    }

    return (

        <View style={{ width }} bg={"white"} className={"h-full"} >
            <GiftedChat {...{ messages, onSend, user, inverted, renderMessageText, renderAvatar, scrollToBottom, renderTime, placeholder, renderChatEmpty }} listViewProps={{
                inverted: messages.length <= 0
            }} />
        </View >


    )
}


