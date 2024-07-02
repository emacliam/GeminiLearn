import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Children } from 'react';
import { Link } from 'expo-router';
import { Text } from 'tamagui';

export default function TabTwoScreen() {
    const GrammerSyllabus = [
        {
            name: "Beginner",
        },
        {
            name: "Intermediate",
        }, {
            "name": "Advanced",
        },
        {
            "name": "Business",
        },
        {
            "name": "Just for fun",
        },


    ]
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Image
                src="https://www.freepik.com/free-vector/blog-post-concept-illustration_5202424.htm#fromView=search&page=1&position=4&uuid=a78b9458-d8c3-4d7c-b11c-cd6874ae8ca5"
                style={{
                    width: 400, height: 400
                }}
            />}>
            <ThemedView style={styles.titleContainer}>
                <Text fontSize={24} fontWeight={"300"} color={"$black"} fontFamily={"NunitoBold"}>Write & Improve</Text>

            </ThemedView>
            <Text fontSize={18} fontWeight={"300"} color={"$black"} fontFamily={"NunitoMedium"}>Write short stories based on generated topics .</Text>

            <ThemedText className="mt-4" fontSize={20} fontWeight={"300"} color={"$black"} fontFamily={"NunitoMedium"}>Choose a Level</ThemedText>
            {GrammerSyllabus.map((item, index) => {
                const children = item.Children
                return (
                    <Link href={{
                        pathname: "/Writing/cat",
                        params: { name: item.name }
                    }}>
                        <ThemedText type="link">{item.name}</ThemedText>
                    </Link>
                )
            })}
        </ParallaxScrollView>
    );
}


const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
