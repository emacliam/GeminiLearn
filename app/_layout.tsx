import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from '@tamagui/core';
import tamaguiConfig from '@/tamagui.config';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { PortalProvider } from 'tamagui';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Nunito: require("../assets/fonts/Nunito/Nunito-VariableFont_wght.ttf"),
    NunitoRegular: require("../assets/fonts/Nunito/static/Nunito-Regular.ttf"),
    NunitoBold: require("../assets/fonts/Nunito/static/Nunito-Bold.ttf"),
    NunitoExtraBold: require("../assets/fonts/Nunito/static/Nunito-ExtraLightItalic.ttf"),
    NunitoMedium: require("../assets/fonts/Nunito/static/Nunito-Medium.ttf"),
    NunitoSemiBold: require("../assets/fonts/Nunito/static/Nunito-SemiBold.ttf"),
    NunitoBlack: require("../assets/fonts/Nunito/static/Nunito-Black.ttf"),
    NunitoItalic: require("../assets/fonts/Nunito/static/Nunito-Italic.ttf"),
    NunitoMediumItalic: require("../assets/fonts/Nunito/static/Nunito-MediumItalic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
        <ThemeProvider value={DefaultTheme}>
          <PortalProvider shouldAddRootHost>
            <StatusBar style="dark" />
            <Stack>
              <Stack.Screen name="index" options={{
                headerShown: false,

              }} />
              <Stack.Screen name="(tabs)" options={{
                headerShown: false,

              }} />
              <Stack.Screen name="Grammer" options={{ headerShown: false }} />
              <Stack.Screen name="Writing" options={{ headerShown: false }} />
              <Stack.Screen name="Reading" options={{ headerShown: false }} />
              <Stack.Screen name="Listening" options={{ headerShown: false }} />
              <Stack.Screen name="Games" options={{ headerShown: false }} />
              <Stack.Screen name="newWord" options={{
                headerShown: true, title: "Learn Word", headerBackTitle: "", headerLeft: () => {
                  return (


                    <Pressable className={"pr-5"} onPress={() => {
                      router.back()

                    }}>
                      <Ionicons name='arrow-back' size={30} />


                    </Pressable>
                  )
                }
              }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </PortalProvider>

        </ThemeProvider>
      </TamaguiProvider>

    </GestureHandlerRootView>

  );
}
