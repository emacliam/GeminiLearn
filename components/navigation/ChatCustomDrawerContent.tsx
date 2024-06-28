import React from 'react';
import { View, Text, XStack, YStack } from 'tamagui';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';

const CustomDrawerContent = (props) => {
    const { height } = Dimensions.get('window')
    const items = [


    ]
    return (
        <DrawerContentScrollView {...props} scrollEnabled={false} >


            <View flexDirection='column' h={height}>
                <YStack style={{ padding: 20 }} flex={3}>
                    <Text mb={10} fontFamily={"NunitoBold"} style={{ fontSize: 16 }}>Recent</Text>
                    <FlatList
                        contentContainerStyle={{
                            rowGap: 10
                        }}
                        data={items}
                        renderItem={({ item, index }) => {
                            return (
                                <XStack key={item.id} gap={15} alignItems="center">
                                    <Ionicons name='chatbox-outline' size={20} />
                                    <Text style={{ fontSize: 16 }} fontFamily={"NunitoMedium"}>{item.name}</Text>
                                </XStack>
                            )
                        }}

                        ListEmptyComponent={() => {
                            return (
                                <XStack gap={15} alignItems="center">
                                    <Text style={{ fontSize: 16 }} fontFamily={"NunitoMedium"} color={"$gray10"}>No activity yet, start a chat</Text>
                                </XStack>
                            )
                        }}
                    />
                </YStack>

                <YStack style={{ padding: 20 }} gap={15} flex={1} >
                    <TouchableOpacity onPress={() => { }} >
                        <XStack gap={15} alignItems="center">
                            <Ionicons name='trash-bin-outline' size={20} />
                            <Text style={{ fontSize: 16 }} fontFamily={"NunitoMedium"}>Clear Conversations</Text>
                        </XStack>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <XStack gap={15} alignItems="center">
                            <Ionicons name='heart-outline' size={20} />
                            <Text style={{ fontSize: 16 }} fontFamily={"NunitoMedium"}>Favorites</Text>
                        </XStack>
                    </TouchableOpacity>
                </YStack>
            </View>
        </DrawerContentScrollView >
    );
};

export default CustomDrawerContent;
