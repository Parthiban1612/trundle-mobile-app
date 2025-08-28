import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

export default function AnimatedItineraryDetails({ route }) {
  const { itinerary } = route.params;

  // Animation values
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(100);
  const imageScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  useEffect(() => {
    // Start entrance animations
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withSpring(0, { damping: 15, stiffness: 100 });
    imageScale.value = withSpring(1, { damping: 12, stiffness: 100 });

    // Stagger card animations
    setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 600 });
      cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    }, 300);
  }, []);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [
      {
        translateX: interpolate(
          fadeIn.value,
          [0, 1],
          [-50, 0]
        ),
      },
    ],
  }));

  const descriptionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [
      {
        translateX: interpolate(
          fadeIn.value,
          [0, 1],
          [50, 0]
        ),
      },
    ],
  }));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header Section */}
      <Animated.View style={[headerAnimatedStyle, { padding: 20, alignItems: 'center' }]}>
        <Animated.View style={[imageAnimatedStyle, { marginBottom: 20 }]}>
          <Image
            source={{ uri: itinerary.images[0].image }}
            style={{
              width: screenWidth * 0.6,
              height: screenWidth * 0.6,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}
          />
        </Animated.View>

        <Animated.Text style={[titleAnimatedStyle, {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1a1a1a',
          textAlign: 'center',
          marginBottom: 8,
        }]}>
          {itinerary.name}
        </Animated.Text>
      </Animated.View>

      {/* Content Cards */}
      <Animated.View style={[cardAnimatedStyle, { paddingHorizontal: 20 }]}>
        {/* Category Card */}
        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#666',
            marginBottom: 8,
          }}>
            Category
          </Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#4a90e2',
            textTransform: 'capitalize',
          }}>
            {itinerary.category}
          </Text>
        </View>

        {/* Description Card */}
        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#666',
            marginBottom: 12,
          }}>
            Description
          </Text>
          <Animated.Text style={[descriptionAnimatedStyle, {
            fontSize: 16,
            lineHeight: 24,
            color: '#333',
            textAlign: 'justify',
          }]}>
            {itinerary.description}
          </Animated.Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}