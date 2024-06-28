import React, { useRef, useEffect } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

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
                    backgroundColor: "transparent"
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('../assets/animations/AIloading.json')}
            />

            <Text style={{ color: "white" }}>
                {loadingText}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#1d0826',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    buttonContainer: {
        paddingTop: 20,
    },
});
