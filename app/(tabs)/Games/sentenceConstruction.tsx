import React, { useRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import DuoDragDrop, { DuoDragDropRef, Word, Lines, Placeholder } from "@/components/FormSentenceDrag";
import { Text, XStack } from "tamagui";


const words = ["cat", "sat", "mat", "dog", "barked", "loudly", "mouse", "ran", "under", "chair"]



const Duolingo = () => {
    const ref = useRef<DuoDragDropRef>(null);

    return (

        <View style={{ margin: 20, minHeight: "auto", flex: 1 }}>
            <Text fontSize={18} mb={30} fontWeight={"300"} color={"black"} fontFamily={"NunitoBold"}>Construct a sentence with the random words below</Text>
            <DuoDragDrop ref={ref}
                words={words}
                renderWord={(word, index) => (
                    <Word
                        containerStyle={{
                            backgroundColor: "#098756",
                            borderRadius: 30,
                        }}
                        textStyle={{
                            color: "white",
                        }}
                    />
                )}
                // Change the border radius of the default Placeholder
                renderPlaceholder={({ style }) => <Placeholder style={[style, { borderRadius: 30 }]} />}
                // Modify the container/line style of Lines.
                renderLines={(props) => (
                    <Lines {...props} containerStyle={{ backgroundColor: "transparent" }} lineStyle={{ borderColor: "#CCC" }} />
                )}

            />
            <XStack justifyContent="space-between">
                <Pressable className="px-0 pt-10 pb-[60px] " onPress={() => {

                }}>
                    <View className="flex-row items-center justify-center h-12 px-10 bg-black rounded-full">
                        <Text className="font-[NunitoBold] text-white">
                            Generate
                        </Text>

                    </View>
                </Pressable>
                <Pressable className="px-0 pt-10 pb-[60px] " onPress={() => {
                    const answered = ref.current?.getAnsweredWords();
                    console.log(answered); // ["Juan", "She"]
                    const words = ref.current?.getWords();
                    console.log(words);
                }}>
                    <View className="flex-row items-center justify-center h-12 px-10 bg-black rounded-full">
                        <Text className="font-[NunitoBold] text-white">
                            Evaluate
                        </Text>

                    </View>
                </Pressable>
            </XStack>
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",

    },
});


export default Duolingo;
