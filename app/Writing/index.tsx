import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Dimensions } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Children } from 'react';
import { Link } from 'expo-router';
import { Text, View } from 'tamagui';
import img from "../../assets/images/write.jpg"

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
            headerBackgroundColor={{ light: '#fff', dark: '#fff' }}
            headerImage={<Image source={img} resizeMode='cover' style={{
                width: Dimensions.get("screen").width, height: 400
            }} />}>

            <View style={styles.titleContainer}>
                <Text fontSize={24} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Write & Improve</Text>

            </View>
            <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>Write short stories based on generated topics .</Text>

            <Text className="mt-4" fontSize={20} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>Choose a Level</Text>
            {GrammerSyllabus.map((item, index) => {
                const children = item.Children
                return (
                    <Link href={{
                        pathname: "/Writing/cat",
                        params: { name: item.name }
                    }}>
                        <ThemedText type="link" style={{ fontFamily: "NunitoMedium" }} >{item.name}</ThemedText>
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
