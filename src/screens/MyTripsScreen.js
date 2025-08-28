import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Text, Card, Chip, FAB } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

const MyTripsScreen = () => {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const scaleAnim = useSharedValue(0.9);

  useEffect(() => {
    // Animate in the my trips screen
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

  const trips = [
    {
      id: 1,
      title: 'Paris Adventure',
      location: 'Paris, France',
      date: 'Dec 15-20, 2024',
      status: 'upcoming',
      image: '🗼',
    },
    {
      id: 2,
      title: 'Tokyo Exploration',
      location: 'Tokyo, Japan',
      date: 'Nov 10-15, 2024',
      status: 'completed',
      image: '🗾',
    },
    {
      id: 3,
      title: 'New York City',
      location: 'New York, USA',
      date: 'Oct 5-10, 2024',
      status: 'completed',
      image: '🗽',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      default:
        return '#FF9800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      default:
        return 'Planning';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, fadeStyle]}>
          <Animated.View style={[styles.header, slideStyle]}>
            <Text variant="displaySmall" style={styles.title}>My Trips</Text>
            <Text variant="titleMedium" style={styles.subtitle}>Your travel adventures</Text>
          </Animated.View>

          <Animated.View style={[styles.statsContainer, scaleStyle]}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>12</Text>
                <Text variant="bodyMedium" style={styles.statLabel}>Total Trips</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>8</Text>
                <Text variant="bodyMedium" style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>4</Text>
                <Text variant="bodyMedium" style={styles.statLabel}>Upcoming</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.tripsContainer, slideStyle]}>
            <Text variant="titleLarge" style={styles.sectionTitle}>Recent Trips</Text>
            {trips.map((trip) => (
              <Card key={trip.id} style={styles.tripCard}>
                <Card.Content style={styles.tripContent}>
                  <View style={styles.tripHeader}>
                    <Text style={styles.tripImage}>{trip.image}</Text>
                    <View style={styles.tripInfo}>
                      <Text variant="titleMedium" style={styles.tripTitle}>{trip.title}</Text>
                      <Text variant="bodyMedium" style={styles.tripLocation}>{trip.location}</Text>
                      <Text variant="bodySmall" style={styles.tripDate}>{trip.date}</Text>
                    </View>
                    <Chip
                      style={[styles.statusChip, { backgroundColor: getStatusColor(trip.status) }]}
                      textStyle={styles.statusText}
                    >
                      {getStatusText(trip.status)}
                    </Chip>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </Animated.View>

          <Animated.View style={[styles.emptyContainer, slideStyle]}>
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text style={styles.emptyIcon}>✈️</Text>
                <Text variant="titleLarge" style={styles.emptyTitle}>No trips yet?</Text>
                <Text variant="bodyLarge" style={styles.emptyDescription}>
                  Start planning your next adventure! Create a new trip and let AI help you discover amazing destinations.
                </Text>
              </Card.Content>
            </Card>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => { }}
        label="New Trip"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 100,
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
  sectionTitle: {
    color: '#ffffff',
    marginBottom: 16,
    fontFamily: 'instrument-sans-600',
  },
  statsContainer: {
    marginBottom: 40,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#7E5BEF',
    fontFamily: 'instrument-sans-700',
  },
  statLabel: {
    color: '#cccccc',
    fontFamily: 'instrument-sans-400',
  },
  tripsContainer: {
    marginBottom: 40,
  },
  tripCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 16,
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripImage: {
    fontSize: 40,
    marginRight: 16,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    color: '#ffffff',
    fontFamily: 'instrument-sans-600',
    marginBottom: 4,
  },
  tripLocation: {
    color: '#cccccc',
    fontFamily: 'instrument-sans-400',
    marginBottom: 2,
  },
  tripDate: {
    color: '#999999',
    fontFamily: 'instrument-sans-400',
  },
  statusChip: {
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontFamily: 'instrument-sans-500',
  },
  emptyContainer: {
    marginBottom: 40,
  },
  emptyCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'instrument-sans-600',
  },
  emptyDescription: {
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'instrument-sans-400',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#7E5BEF',
  },
});

export default MyTripsScreen; 