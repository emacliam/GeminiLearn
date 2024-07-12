import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import TextGradient from '@furkankaya/react-native-linear-text-gradient';
import { Platform, StyleSheet } from 'react-native';
import { moderateVerticalScale } from "react-native-size-matters"

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontFamily: "NunitoMedium",
          fontSize: 15,
          marginBottom: 4
        },
        tabBarStyle:
          Platform.OS === "android"
            ? {
              backgroundColor: "black",
              position: "absolute",
              height: moderateVerticalScale(60),
              borderTopWidth: 0,
              elevation: 0,
              bottom: 6,
              left: moderateVerticalScale(10),
              right: moderateVerticalScale(10),
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 4,
              borderColor: "orange",
              borderTopColor: "orange",
              borderWidth: 0
            }
            : {},
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          headerTitle: () => {
            return (
              <TextGradient
                style={{ fontSize: 30, fontFamily: "NunitoBold" }}
                locations={[0, 1]}
                colors={["blue", "red"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                text="Gemini Learn"
              />
            )
          },

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'game-controller' : 'game-controller-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Speech"
        options={{
          title: 'Speech',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'mic' : 'mic-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#F68C1E",
    shadowOffset: {
      width: 10,
      height: 15,
    },
    shadowOpacity: 0.95,
    shadowRadius: 10,
    elevation: 6,
  },
})