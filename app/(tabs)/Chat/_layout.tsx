import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItemList, DrawerToggleButton } from '@react-navigation/drawer';
import CustomDrawerContent from '@/components/navigation/ChatCustomDrawerContent';

export default function GamesLayout() {
    return (
        <Drawer
            screenOptions={{ headerShown: false }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >

            <Drawer.Screen name="index" options={{
                headerShown: true,
                title: "Chat With Gemini",
                drawerLabel: "",
                drawerHideStatusBarOnOpen: true,
                drawerItemStyle: { display: 'none' },
                headerRight: () => {
                    return (
                        <Ionicons name='add' size={30} />
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
