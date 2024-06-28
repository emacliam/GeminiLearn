import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    View,
    Text as RNText,
    Dimensions,
    Animated,
} from "react-native";
import { G, Path, Svg, TSpan, Text } from "react-native-svg";
import * as d3Shape from "d3-shape";
import color from "randomcolor";
import { snap } from "popmotion";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import ask from "@/services/Ask/ask";
const { width } = Dimensions.get("screen");

const numberOfSegments = 12;
const wheelSize = width * 0.95;
const fontSize = 26;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
const knobFill = color({ hue: "purple" });

const makeWheel = () => {
    const data = Array.from({ length: numberOfSegments }).fill(1);
    const arcs = d3Shape.pie()(data);
    const colors = ["#d1f8d1", "#feb557", "#d1f8d1", "#feb557", "#d1f8d1", "#feb557", "#d1f8d1", "#feb557", "#d1f8d1", "#feb557", "#d1f8d1", "#feb557"]

    return arcs.map((arc, index) => {
        const instance = d3Shape
            .arc()
            .padAngle(0.01)
            .outerRadius(width / 2)
            .innerRadius(20);

        return {
            path: instance(arc),
            color: colors[index],
            value: Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
            centroid: instance.centroid(arc),
        };
    });
};

export default function WheelOfFortune() {
    const _wheelPaths = makeWheel();
    const _angle = useRef(new Animated.Value(0)).current;
    const angle = useRef(0);
    const [enabled, setEnabled] = useState(true);
    const [finished, setFinished] = useState(false);
    const [winner, setWinner] = useState(null);

    const [response, setResponse] = useState(null)
    const [spinning, setSpinning] = useState(null)

    const ask1 = async () => {
        try {
            const response = await ask.request({ text: "generate random 12 english words to learn in a array formate, with a maximum of 12 letters" })
            console.log("kkkkkk", response.data.candidates[0].content.parts[0].text)
            const sentence = response.data.candidates[0].content.parts[0].text;
            const match = sentence.match(/"([^"]*)"/g).map(match => match.replace(/"/g, ''))
            console.log(match)
            setResponse(match)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        ask1()
    }, [])


    useEffect(() => {
        const listener = _angle.addListener((event) => {
            if (enabled) {
                setEnabled(false);
                setFinished(false);
            }
            angle.current = event.value;
        });

        return () => {
            _angle.removeListener(listener);
        };
    }, [enabled, _angle]);

    const getWinnerIndex = () => {
        const deg = Math.abs(Math.round(angle.current % oneTurn));
        if (angle.current < 0) {
            return Math.floor(deg / angleBySegment);
        }
        return (
            (numberOfSegments - Math.floor(deg / angleBySegment)) % numberOfSegments
        );
    };

    const onPan = ({ nativeEvent }) => {

        if (nativeEvent.state === State.END) {
            const { velocityY } = nativeEvent;

            Animated.decay(_angle, {
                velocity: velocityY / 1000,
                deceleration: 0.999,
                useNativeDriver: true,
            }).start(() => {
                _angle.setValue(angle.current % oneTurn);
                const snapTo = snap(oneTurn / numberOfSegments);
                Animated.timing(_angle, {
                    toValue: snapTo(angle.current),
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    const winnerIndex = getWinnerIndex();
                    setEnabled(true);
                    setFinished(true);
                    setWinner(_wheelPaths[winnerIndex].value);
                });
            });
        }
    };

    const renderKnob = () => {
        const knobSize = 30;
        const YOLO = Animated.modulo(
            Animated.divide(
                Animated.modulo(Animated.subtract(_angle, angleOffset), oneTurn),
                new Animated.Value(angleBySegment)
            ),
            1
        );

        return (
            <Animated.View
                style={{
                    width: knobSize,
                    height: knobSize * 2,
                    justifyContent: "flex-end",
                    zIndex: 1,
                    transform: [
                        {
                            rotate: YOLO.interpolate({
                                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                                outputRange: [
                                    "0deg",
                                    "0deg",
                                    "35deg",
                                    "-35deg",
                                    "0deg",
                                    "0deg",
                                ],
                            }),
                        },
                    ],
                }}>
                <Svg
                    width={knobSize}
                    height={(knobSize * 100) / 57}
                    viewBox={`0 0 57 100`}
                    style={{ transform: [{ translateY: 8 }] }}>
                    <Path
                        d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
                        fill={knobFill}
                    />
                </Svg>
            </Animated.View>
        );
    };

    const renderWinner = () => {
        return <RNText style={styles.winnerText}>Winner is: {winner}</RNText>;
    };

    const renderSvgWheel = () => {

        return (
            <View style={styles.container}>

                {renderKnob()}
                <Animated.View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        transform: [
                            {
                                rotate: _angle.interpolate({
                                    inputRange: [-oneTurn, 0, oneTurn],
                                    outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`],
                                }),
                            },
                        ],
                    }}>
                    <Svg
                        width={wheelSize / 1.1}
                        height={wheelSize}
                        viewBox={`0 0 ${width} ${width}`}
                        style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}>
                        <G y={width / 2} x={width / 2}>
                            {_wheelPaths.map((arc, i) => {
                                const [x, y] = arc.centroid;
                                const number = response[i]

                                return (
                                    <G key={`arc-${i}`}>
                                        <Path d={arc.path} fill={arc.color} />
                                        <G
                                            rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                                            origin={`${x}, ${y}`}>
                                            <Text
                                                x={x}
                                                y={y - 70}
                                                fill="black"
                                                textAnchor="middle"
                                                fontSize={18}
                                                fontWeight={700}

                                            >
                                                {number}
                                                {/*   {Array.from({ length: number.length }).map((_, j) => (
                                                    <TSpan
                                                        rotate={["90deg"]}
                                                        x={x}
                                                        dy={18}
                                                        key={`arc-${i}-slice-${j}`}>
                                                        {number.charAt(j)}
                                                    </TSpan>
                                                ))} */}
                                            </Text>
                                        </G>
                                    </G>
                                );
                            })}
                        </G>
                    </Svg>
                </Animated.View>
            </View>
        );
    };

    return (
        <View className="bg-white pt-20 flex-1">
            <View >
                <RNText className="font-extrabold text-3xl text-center text-black">
                    Spin to Learn
                </RNText>
                <RNText className="font-medium mt-5 text-center text-black">
                    Spin the wheel and learn a random word
                </RNText>
            </View>
            <PanGestureHandler onHandlerStateChange={onPan} >
                <View style={styles.container} className="mt-5">

                    {response && renderSvgWheel()}
                    {!response && <RNText className="font-medium mt-5 text-center text-black">Getting random words from AI</RNText>}
                    {finished && enabled && renderWinner()}
                </View>
            </PanGestureHandler>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    winnerText: {
        fontSize: 10,
        fontFamily: "Menlo",
        position: "absolute",
        bottom: 10,
        color: "red"
    },
});
