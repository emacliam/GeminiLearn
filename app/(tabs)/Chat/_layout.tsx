import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItemList, DrawerToggleButton } from '@react-navigation/drawer';
import CustomDrawerContent from '@/components/navigation/ChatCustomDrawerContent';
import { TouchableOpacity } from 'react-native';
import useChatStore from '@/Storage/Zustand/chat';

export default function GamesLayout() {
    const newChat = useChatStore((state) => state.openNewChat)
    return (
        <Drawer
            screenOptions={{ headerShown: false }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >

            <Drawer.Screen name="index" options={{
                headerShown: true,
                title: "Chat With Gemini",
                headerTitleStyle: { fontFamily: "NunitoBold" },
                drawerLabel: "",
                drawerHideStatusBarOnOpen: true,
                drawerItemStyle: { display: 'none' },
                headerRight: () => {
                    return (
                        <TouchableOpacity onPress={() => {
                            newChat()
                        }}>
                            <Ionicons name='add' size={30} />
                        </TouchableOpacity>
                    )
                },

                headerLeft: () => {
                    return (
                        <DrawerToggleButton tintColor='black' />
                    )
                }
            }} />

        </Drawer>
    );
}
