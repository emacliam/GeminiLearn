import React, { useEffect, useState } from 'react';
import { View, Text, XStack, YStack } from 'tamagui';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, State } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
import useChatStore from '@/Storage/Zustand/chat';

const CustomDrawerContent = (props) => {
    const { height } = Dimensions.get('window')
    let [chats, setChats] = useState([])


    useEffect(() => {
        const onValueChange = database()
            .ref('/chats')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    const chatsArray = Object.keys(snapshot.val()).map(key => {

                        return {
                            ...snapshot.val()[key]
                        };
                    });
                    setChats(chatsArray)
                }

            });

        // Stop listening for updates when no longer required
        return () => database().ref(`/chats`).off('value', onValueChange);
    }, []);

    const toChat = useChatStore((state) => state.openRecentActivity)


    return (
        <DrawerContentScrollView {...props} scrollEnabled={false} >


            <View flexDirection='column' h={height}>
                <YStack style={{ padding: 20 }} flex={3}>
                    <Text mb={10} fontFamily={"NunitoBold"} style={{ fontSize: 16 }} color={"black"}>Recent Conversations</Text>
                    <FlatList
                        contentContainerStyle={{
                            rowGap: 10
                        }}
                        data={chats}
                        renderItem={({ item, index }) => {

                            return (
                                <TouchableOpacity onPress={() => {
                                    toChat(item.history)

                                    //router.replace("/Chat")
                                }}>
                                    <XStack key={item.chatId} gap={15} alignItems="center">
                                        <Ionicons name='chatbox-outline' size={20} />
                                        <Text style={{ fontSize: 16 }} fontFamily={"NunitoMedium"} color={"black"}>{item.chatTitle}</Text>
                                    </XStack>
                                </TouchableOpacity>
                            )
                        }}

                        ListEmptyComponent={() => {
                            return (
                                <XStack gap={15} alignItems="center">
                                    <Text style={{ fontSize: 16 }} fontFamily={"NunitoMedium"} color={"black"}>No activity yet, start a chat</Text>
                                </XStack>
                            )
                        }}
                    />


                </YStack>

                <YStack style={{ padding: 20 }} gap={15} flex={1} >
                    <TouchableOpacity onPress={() => { }} >
                        <XStack gap={15} alignItems="center">
                            <Ionicons name='trash-bin-outline' size={20} />
                            <Text style={{ fontSize: 16 }} fontFamily={"NunitoMedium"} color={"black"}>Clear Conversations</Text>
                        </XStack>

                    </TouchableOpacity>

                </YStack>
            </View>
        </DrawerContentScrollView >
    );
};

export default CustomDrawerContent;
