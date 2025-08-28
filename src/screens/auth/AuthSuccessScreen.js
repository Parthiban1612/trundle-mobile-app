
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import TickIcon from "../../../assets/tick.svg";
import ThreeLines from "../../../assets/three_lines.svg";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setIsViewSuccessScreen } from '../../redux/authSlice';
import useStatusBar from '../../hooks/useStatusBar';

const SIDES = 7;
const SIZE = 120; // width/height of the SVG

function generateHeptagonPoints(radius, sides) {
  const angle = (2 * Math.PI) / sides;
  const center = SIZE / 2;
  let points = [];
  for (let i = 0; i < sides; i++) {
    const x = center + radius * Math.cos(i * angle - Math.PI / 2);
    const y = center + radius * Math.sin(i * angle - Math.PI / 2);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

export default function VerificationSuccess() {

  useStatusBar('light-content', '#6116EB');

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const { isProfileCompleted } = useSelector((state) => state.auth);

  // Animation values
  const heptagonScale = useRef(new Animated.Value(0.3)).current;
  const heptagonOpacity = useRef(new Animated.Value(0)).current;
  const threeLinesScale = useRef(new Animated.Value(0.2)).current;
  const threeLinesOpacity = useRef(new Animated.Value(0)).current;
  const threeLinesRotate = useRef(new Animated.Value(0)).current;
  const tickScale = useRef(new Animated.Value(0.1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.5)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  const radius = SIZE / 2 - 5;
  const points = generateHeptagonPoints(radius, SIDES);

  useEffect(() => {
    // Start animations sequence
    const startAnimations = () => {
      // 1. Heptagon appears with scale and fade-in
      Animated.parallel([
        Animated.spring(heptagonScale, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(heptagonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // 2. Three lines appear after heptagon
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(threeLinesScale, {
            toValue: 1,
            tension: 120,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(threeLinesOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(threeLinesRotate, {
            toValue: 1,
            tension: 150,
            friction: 10,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);

      // 3. Tick appears after three lines
      setTimeout(() => {
        Animated.spring(tickScale, {
          toValue: 1,
          tension: 180,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }, 600);

      // 4. Text appears last
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(textScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(textTranslateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, 900);
    };

    // Start animations immediately
    startAnimations();

    // Fallback navigation after 3 seconds if token is still not available
    const timeout = setTimeout(() => {
      dispatch(setIsViewSuccessScreen(true));
      if (isProfileCompleted === true) {
        navigation.navigate('MainTabs');
      } else {
        navigation.navigate('CreateProfile');
      }
    }, 3000);

    return () => {
      clearTimeout(timeout); // Cleanup
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Heptagon + Tick */}
      <Animated.View
        style={[
          styles.shapeWrapper,
          {
            transform: [{ scale: heptagonScale }],
            opacity: heptagonOpacity
          }
        ]}
      >
        <Svg width={SIZE} height={SIZE}>
          <Polygon
            points={points}
            fill="#f57373"
            transform={`rotate(30, ${SIZE / 2}, ${SIZE / 2})`} // 🔄 rotate around center
          />
        </Svg>
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 70,
              bottom: 95,
              transform: [
                { scale: threeLinesScale },
                { rotate: "-15deg" },
                {
                  rotate: threeLinesRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-15deg', '0deg']
                  })
                }
              ],
              opacity: threeLinesOpacity
            }
          ]}
        >
          <ThreeLines />
        </Animated.View>
        {/* Checkmark */}
        <Animated.View
          style={[
            styles.checkWrapper,
            {
              transform: [{ scale: tickScale }]
            }
          ]}
        >
          <TickIcon />
        </Animated.View>
      </Animated.View>

      {/* Text */}
      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [
            { scale: textScale },
            { translateY: textTranslateY }
          ]
        }}
      >
        <Text style={styles.successText}>Verified</Text>
        <Text style={styles.successText}>Successfully</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6116EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shapeWrapper: {
    width: SIZE,
    height: SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: "relative"
  },
  checkWrapper: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: 'white',
    fontFamily: 'instrument-sans-700',
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 4,
  },
});