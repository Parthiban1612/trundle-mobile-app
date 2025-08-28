import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import CountdownTimer from '../../../components/CountdownTimer';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../../../redux/authSlice';
import PrimaryHeader from '../../../components/PrimaryHeader';
import Toast from 'react-native-toast-message';
import { verifyOtp } from '../../../redux/authSlice';

export default function OtpVerification({ route }) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const email = route?.params?.email;
  const { loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleVerify = async (text) => {
    if (isVerifying || !email) return; // Prevent multiple calls

    if (text.length !== 6) {
      console.log('OTP length is not 6, aborting verification');
      return;
    }

    setIsVerifying(true);

    try {

      const result = await dispatch(verifyOtp({ email, otp: text })).unwrap();

      if (result.status === true) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: result.message || 'OTP has been verified',
          position: 'top',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: result.message || 'Failed to verify OTP. Please try again.',
          position: 'top',
          visibilityTime: 4000,
        });
      }

    } catch (error) {
      console.log('OTP verification error:', error);
      const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to verify OTP. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;

    try {
      const result = await dispatch(sendOtp(email)).unwrap();
      if (result.status === true) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: result.message || 'OTP has been resent to your email',
          position: 'top',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message || 'Failed to resend OTP. Please try again.',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to resend OTP. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <PrimaryHeader isFullHeight={true} title="Code Verification" text1={`Please enter the code you received here`} >
          <View style={{
            marginBottom: 16,
          }}>
            <OtpInput
              numberOfDigits={6}
              focusColor="#7E5BEF"
              autoFocus={false}
              hideStick={true}
              blurOnFilled={false}
              type="numeric"
              onTextChange={(text) => {
                setOtp(text);
              }}
              theme={{
                containerStyle: styles.container,
                pinCodeContainerStyle: styles.pinCodeContainer,
                pinCodeTextStyle: styles.pinCodeText,
                focusStickStyle: styles.focusStick,
                focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                placeholderTextStyle: styles.placeholderText,
                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
              }}
              onFilled={(text) => {
                if (!isVerifying) {
                  handleVerify(text);
                } else {
                  console.log('Verification already in progress, ignoring onFilled call');
                }
              }}
            />
          </View>
          <View style={{
            marginBottom: 16,
          }}>
            <CountdownTimer
              onResend={handleResendOtp}
              canResend={!loading}
            />
            {loading && (
              <ActivityIndicator size="large" style={{
                transform: [{ scaleX: 1 }, { scaleY: 1 }],
              }} color="#9D80FF" />
            )}
          </View>
        </PrimaryHeader>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCodeContainer: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    marginHorizontal: 6,
    backgroundColor: '#FBF9FF',
  },
  activePinCodeContainer: {
    borderColor: '#7E5BEF',
    borderWidth: 2,
    backgroundColor: '#F3E8FF',
  },
  pinCodeText: {
    fontSize: 20,
    fontFamily: 'instrument-sans-400',
    color: '#111013',
    fontWeight: '700',
  },
  placeholderText: {
    color: '#ccc',
  },
  filledPinCodeContainer: {
    backgroundColor: '#FBF9FF',
    borderColor: '#DEDAE7',
  },
  focusStick: {
    height: 2,
    width: '60%',
    backgroundColor: '#7E5BEF',
    marginTop: 4,
  },
});
