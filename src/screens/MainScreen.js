import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import NextButton from '../components/NextButton';
import { signOut, clearUser, setIntroSeen, checkStoredAuthState } from '../store';

const MainScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const scaleAnim = useSharedValue(0.9);

  useEffect(() => {
    // Animate in the main screen
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
    scaleAnim.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 100 }));
  }, []);

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const slideStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slideAnim.value }],
    };
  });

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const handleLogout = () => {
    dispatch(signOut());
    // Don't navigate manually - let Redux state control the navigation
  };

  const handleDebugAuth = () => {
    checkStoredAuthState();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, fadeStyle]}>
        <Animated.View style={[styles.header, slideStyle]}>
          <Text variant="displaySmall" style={styles.title}>Welcome to TrudleAI</Text>
          <Text variant="titleMedium" style={styles.subtitle}>Your AI-powered companion</Text>
        </Animated.View>

        <Animated.View style={[styles.cardContainer, scaleStyle]}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.cardTitle}>🚀 Ready to get started?</Text>
              <Text variant="bodyLarge" style={styles.cardDescription}>
                Explore the amazing features and capabilities of TrudleAI.
                Your intelligent assistant is ready to help you with any task.
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, slideStyle]}>
          <NextButton
            onPress={() => { }}
            text="Start Exploring"
            style={styles.primaryButton}
            labelStyle={styles.primaryButtonText}
          />

          <NextButton
            text="Debug Auth State"
            variant="secondary"
            mode="outlined"
            onPress={handleDebugAuth}
            style={styles.debugButton}
          />

          <NextButton
            text="Show Intro Again"
            variant="secondary"
            mode="outlined"
            onPress={() => {
              dispatch(clearUser());
              // Don't navigate manually - let Redux state control the navigation
            }}
            style={styles.secondaryButton}
          />

          <NextButton
            text="Logout"
            variant="secondary"
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'instrument-sans-700',
  },
  subtitle: {
    color: '#cccccc',
    textAlign: 'center',
    fontFamily: 'instrument-sans-400',
  },
  cardContainer: {
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardTitle: {
    color: '#ffffff',
    marginBottom: 10,
    fontFamily: 'instrument-sans-600',
  },
  cardDescription: {
    color: '#cccccc',
    lineHeight: 24,
    fontFamily: 'instrument-sans-400',
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#7E5BEF',
    borderRadius: 12,
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'instrument-sans-600',
  },
  debugButton: {
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
  },
  secondaryButton: {
    borderColor: '#7E5BEF',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
  },
  logoutButton: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
  },
});

export default MainScreen; 