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
import img from "../../assets/images/grammer.jpg"

export default function TabTwoScreen() {
    const GrammerSyllabus = [
        {
            name: "Nouns",
            Children: [
                { name: "Common Nouns" },
                { name: "Proper Nouns" },
                { name: "Singular Nouns" },
                { name: "Plural Nouns" },
                { name: "Possessive Nouns" },
                { name: "Abstract Nouns" },
                { name: "Collective Nouns" },
            ]
        }, {
            "name": "Pronouns",
            "Children": [
                { "name": "Relative Pronouns" },
                { "name": "Reflexive Pronouns" },
                { "name": "Demonstrative Pronouns" },
                { "name": "Possessive Pronouns" },
                { "name": "Indefinite Pronouns" },
                { "name": "Personal Pronouns" },
                { "name": "Subject Pronouns" },
                { "name": "Object Pronouns" },
                { "name": "Interrogative Pronouns" },
                { "name": "Reciprocal Pronouns" },
                { "name": "Intensive Pronouns" }
            ]
        },
        {
            "name": "Verbs",
            "Children": [
                { "name": "Verb Forms" },
                { "name": "Main Verbs" },
                { "name": "Helping Verbs" },
                { "name": "Auxiliary Verbs" },
                { "name": "Transitive and Intransitive Verbs" },
                { "name": "Regular Verbs" },
                { "name": "Irregular Verbs" },
                { "name": "Modal Verbs" },
                { "name": "Phrasal Verbs" },
                { "name": "Finite Verbs" },
                { "name": "Non Finite Verbs" },
                { "name": "Linking Verbs" },
                { "name": "Stative Verbs" },
                { "name": "Action Verbs" }
            ]
        },
        {
            "name": "Adverbs",
            "Children": [
                { "name": "Conjunctive Adverbs" },
                { "name": "Adverb Clauses" }
            ]
        },
        {
            "name": "Adjectives",
            "Children": [
                { "name": "Possessive Adjectives" },
                { "name": "Interrogative Adjectives" },
                { "name": "Compound Adjectives" },
                { "name": "Demonstrative Adjectives" },
                { "name": "Adjectives List" }
            ]
        },
        {
            "name": "Conjunctions",
            "Children": [
                { "name": "Subordinating Conjunctions" },
                { "name": "Coordinating Conjunctions" },
                { "name": "Correlative Conjunctions" }
            ]
        },
        {
            "name": "Prepositions",
            "Children": [
                { "name": "Prepositional Phrases" }
            ]
        }

    ]
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#fff', dark: '#fff' }}
            headerImage={<Image source={img} resizeMode='cover' style={{
                width: Dimensions.get("screen").width, height: 400
            }} />}>
            <View style={styles.titleContainer}>
                <Text fontSize={24} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Grammar</Text>
            </View>
            <Text fontSize={18} fontWeight={"300"} color={"black"} fontFamily={"NunitoMedium"}>Here is a set order that you can follow to learn grammar effectively and quickly.</Text>
            {GrammerSyllabus.map((item, index) => {
                const children = item.Children
                return (
                    <Collapsible title={item.name}>
                        {children.map((child, index) => {
                            return (
                                <Link href={{
                                    pathname: "Grammer/notes",
                                    params: { name: child.name }
                                }}>
                                    <ThemedText type="link" style={{ fontFamily: "NunitoMedium" }}>{child.name}</ThemedText>
                                </Link>
                            )
                        })}
                    </Collapsible>
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
