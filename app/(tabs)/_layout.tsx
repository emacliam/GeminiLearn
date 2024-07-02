import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import TextGradient from '@furkankaya/react-native-linear-text-gradient';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: "NunitoBold",
          fontSize: 15
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,
          headerTitle: () => {
            return (
              <TextGradient
                style={{ fontWeight: "bold", fontSize: 25, fontFamily: "NunitoBlack" }}
                locations={[0, 1]}
                colors={["blue", "red"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                text="Gemini Learn"
              />
            )
          },

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home-sharp' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Games"
        options={{
          title: 'Games',
          headerShown: false,
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
            <TabBarIcon name={focused ? 'volume-medium' : 'volume-medium-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
