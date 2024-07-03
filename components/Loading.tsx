import React, { useRef, useEffect } from 'react';
import { Button, Dimensions, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { Text } from 'tamagui';

export default function Loading({ loadingText }) {
    const animation = useRef(null);
    useEffect(() => {
        // You can control the ref programmatically, rather than using autoPlay
        animation.current?.play();
    }, []);

    return (
        <View style={styles.animationContainer}>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 200,
                    height: 200,
                    backgroundColor: "white"
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('../assets/animations/AIloading.json')}
            />

            <Text ai={"center"} textAlign='center' style={{ color: "black" }} px={10} fontSize={20} fontWeight={"300"} fontFamily={"NunitoMedium"}>
                {loadingText}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    buttonContainer: {
        paddingTop: 20,
    },
});
