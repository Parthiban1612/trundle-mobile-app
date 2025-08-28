import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getStatusBarHeight } from '../utils/platformUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useQuestionModals } from '../components/QuestionModals';
import PrimaryLayout from '../components/PrimaryLayout';
import Animated from 'react-native-reanimated';

// Activity Data
const activityData = [
  {
    id: '1',
    description: "Bought ‘TrundlePlus’ for the Japan trip",
    amount: 50,
    date: '27 Jun 2025',
    status: 'Success',
  },
];

// Activity Card
const ActivityCard = ({ item, isPortrait }) => (
  <View style={[
    styles.card,
    {
      marginHorizontal: isPortrait ? 16 : 32,
      paddingHorizontal: isPortrait ? 24 : 36
    }
  ]}>
    <View style={styles.cardTopRow}>
      <Text style={styles.descriptionText}>
        Bought <Text style={{ fontWeight: 'bold' }}>'TrundlePlus'</Text> for the {'\n'}
        <Text>'Japan'</Text> trip
      </Text>
      <Text style={styles.amountText}>${item.amount}</Text>
    </View>
    <View style={styles.divider} />
    <View style={styles.cardBottomRow}>
      <Text style={styles.dateText}>{item.date}</Text>
      <View style={styles.statusContainer}>
        <View style={styles.statusIconCircle}>
          <Icon name="check" size={12} color="#FFFFFF" />
        </View>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  </View>
);

// Activity Screen
const ActivityScreen = () => {

  const { width, height } = useWindowDimensions();

  const isPortrait = height >= width;

  const { openDynamicQuestionSheet } = useQuestionModals();

  const { questions, questionsLoading } = useSelector((state) => state.travelCountries);

  useFocusEffect(
    useCallback(() => {
      if (questions?.data?.length > 0 && !questionsLoading) {
        openDynamicQuestionSheet({ questions: questions?.data, onComplete: () => { }, onSkip: () => { }, snapPoints: ['25%'] });
      }
    }, [questions?.data?.length, questionsLoading])
  );


  return (
    <Animated.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <PrimaryLayout title="Activity" />
        <View style={{
          flex: 1, marginTop: -16,
          backgroundColor: '#F5F6F9',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
          {activityData.map((item) => (
            <ActivityCard key={item.id} item={item} isPortrait={isPortrait} />
          ))}
        </View>
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#F5F6F9',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#8B5CF6',
    paddingBottom: 20,
    paddingTop: getStatusBarHeight() + 22,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontFamily: 'clash-display-600',
    color: '#FFFFFF',
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  descriptionText: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24,
    flex: 1,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#8A8A8E',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7F4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
  },
});

export default ActivityScreen;
