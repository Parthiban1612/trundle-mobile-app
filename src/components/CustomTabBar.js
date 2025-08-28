import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Menu from '../../assets/menu.svg';
import MenuItem from '../../assets/menu-item.svg';
import SvgComponent from '../common/CustomMegaphoneIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobalBottomSheet } from '../context/GlobalBottomSheetContext';
import SubscriptionIcon from '../../assets/subscription-badge.svg';
import CheckIcon from '../../assets/tick.svg';
import NextButton from './NextButton';
import RazorpayCheckout from 'react-native-razorpay';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import TalkToExpert from '../screens/TalkToExpert';

const planBenefit = [
  `Add unlimited recommendations to \n your My Trips`,
  `Build your own itinerary`,
  `Get tips, updates and real-time \n notifications`,
  `Talk to our local travel experts and get \n custom made itinerary just for you`
]

const TAB_CONTAINER_WIDTH = 130;

const TABS = [
  { id: 'HomeTab', icon: SvgComponent },
  { id: 'ExplorerTab', icon: 'compass' },
];

const TAB_WIDTH = TAB_CONTAINER_WIDTH / TABS.length;
const ACTIVE_PILL_DIAMETER = 48;
const PILL_HORIZONTAL_MARGIN = (TAB_WIDTH - ACTIVE_PILL_DIAMETER) / 2;

const CustomTabBar = ({ state, descriptors, navigation }) => {

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  console.log('isPaymentLoading', isPaymentLoading);

  const { token, user } = useSelector((state) => state.auth);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const activeIndex = state.index;
    const toValue = activeIndex * TAB_WIDTH + PILL_HORIZONTAL_MARGIN;

    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      bounciness: 8,
      speed: 14,
    }).start();
  }, [state.index, slideAnim]);

  const renderIcon = (tab, isFocused) => {
    const color = isFocused ? '#FFFFFF' : '#6E6E73';
    const size = 19;

    if (typeof tab.icon === 'string') {
      return <Feather name={tab.icon} size={size} color={color} />;
    }

    const Icon = tab.icon;
    return <Icon fill={color} width={size} height={size} />;
  };

  const handleTestPayment = async () => {
    setIsPaymentLoading(true);
    try {
      // Step 1: Initiate payment with backend
      let paymentData;
      try {
        const initiateResponse = await axios.post('https://mapi.trundle.me/payment/initiate', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (initiateResponse.status !== 200) {
          throw new Error('Failed to initiate payment');
        }

        paymentData = initiateResponse.data;

      } catch (initiateError) {
        console.error('Payment initiation failed:', JSON.stringify(initiateError, null, 2));
        console.error('Error response data:', JSON.stringify(initiateError.response?.data, null, 2));
        console.error('Error status:', initiateError.response?.status);
        console.error('Error message:', initiateError.message);

        Toast.show({
          text1: 'Payment Initiation Failed',
          text2: initiateError.response?.data?.message || initiateError.message || 'Failed to start payment process',
          type: 'error',
        });
        setIsPaymentLoading(false);
        return;
      }

      // Simple test payment with minimal options
      const testOptions = {
        description: 'Test Payment',
        currency: 'INR', // Try with INR first as it's more commonly supported
        key: 'rzp_test_rwwI0xDFigS3Fz',
        // key: 'rzp_test_1DP5mmOlF5G5ag',
        order_id: paymentData.order_id,
        amount: 100, // ₹1.00
        name: 'Trundle',
        // external: {
        //   wallets: ['paytm'],
        // },
        prefill: {
          email: user?.data?.email,
          contact: `+${user?.data?.phone_code}${user?.data?.mobile_no}`,
          name: user?.data?.first_name + ' ' + user?.data?.last_name
        },
        theme: { color: '#7F4DFF' },
      };

      const paymentResult = await RazorpayCheckout.open(testOptions);

      const data = {
        payment_id: paymentData.payment_id,
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_signature: paymentResult.razorpay_signature,
      }

      const confirmResponse = await axios.post('https://mapi.trundle.me/payment/confirmation', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (confirmResponse.status !== 200) {
        throw new Error('Failed to confirm payment');
      }

      const confirmationData = confirmResponse.data;

      Toast.show({
        text1: 'Payment Success',
        text2: confirmationData.message,
        type: 'success',
      });

      // Close bottom sheet after successful payment
      closeBottomSheet();

    } catch (error) {
      // Handle Razorpay specific errors
      if (error.code === 'PAYMENT_CANCELLED') {
        Toast.show({
          text1: 'Payment Cancelled',
          text2: 'Payment was cancelled by user',
          type: 'info',
        });
      } else if (error.code === 'NETWORK_ERROR') {
        Toast.show({
          text1: 'Network Error',
          text2: 'Please check your internet connection and try again.',
          type: 'error',
        });
      } else {
        Toast.show({
          text1: 'Payment Failed',
          text2: error.response?.data?.message || error.message || 'Something went wrong with the payment. Please try again.',
          type: 'error',
        });
      }
    } finally {
      setIsPaymentLoading(false);
    }
  }

  const handleOpenBottomSheet = () => {
    openBottomSheet({
      content: (
        <View style={{ paddingHorizontal: 20, backgroundColor: '#FFFFFF' }}>
          <View style={{ backgroundColor: "#5212C5", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, marginHorizontal: 'auto' }}>
              <SubscriptionIcon />
              <Text style={{ fontSize: 13, fontFamily: 'instrument-sans-600', color: '#EBE7FF' }}>
                Upgrade to Trundle+
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: "#F288D1", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 16 }}>
            <Text style={{ fontSize: 15, fontFamily: 'instrument-sans-400', color: '#FFFFFF', textAlign: "center", marginbotom: 4 }}>
              Unlock premium benefits{'\n'}for just
            </Text>
            <Text style={{ fontSize: 30, fontFamily: 'clash-display-700', color: '#FFFFFF', textAlign: "center" }}>
              $50
            </Text>
            <Text style={{ fontSize: 11, fontFamily: 'instrument-sans-500', color: '#FFFFFF', textAlign: "center" }}>
              per trip
            </Text>
          </View>

          <View style={{ gap: 12, padding: 24 }}>
            {planBenefit.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <CheckIcon />
                <Text style={{ fontSize: 15, fontFamily: 'instrument-sans-400', color: '#3B3842' }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
          <NextButton
            style={{ marginHorizontal: 24 }}
            theme="dark"
            text="Proceed to pay"
            onPress={handleTestPayment}
            disabled={isPaymentLoading}
            loading={isPaymentLoading}
          />
        </View>
      ),
      headerTitle: '',
      questionType: 'PLAN'
    });
  };

  const { openBottomSheet, closeBottomSheet } = useGlobalBottomSheet();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom }]}>

      {/* Show modal */}
      <TalkToExpert
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />

      <View style={styles.tabContainer}>
        <Animated.View
          style={[
            styles.activePill,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const tab = TABS.find(t => t.id === route.name) || TABS[0];

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabButton}
              onPress={onPress}
              activeOpacity={0.7}
            >
              {renderIcon(tab, isFocused)}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={handleOpenBottomSheet}
        // onPress={() => setIsModalVisible(true)}
        style={styles.chatButtonContainer} activeOpacity={0.8}>
        <Menu width="24" height="24" />
        <View style={styles.badgeContainer}>
          <MenuItem width="14" height="14" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    width: TAB_CONTAINER_WIDTH,
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 29,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  tabButton: {
    width: TAB_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  activePill: {
    position: 'absolute',
    width: ACTIVE_PILL_DIAMETER,
    height: ACTIVE_PILL_DIAMETER,
    backgroundColor: '#6A3DE8',
    borderRadius: ACTIVE_PILL_DIAMETER / 2,
    top: 5,
    zIndex: 0,
  },
  chatButtonContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default CustomTabBar;
