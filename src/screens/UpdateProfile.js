import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ProfileForm from '../components/ProfileForm';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, getUserProfile } from '../redux/authSlice';
import Toast from 'react-native-toast-message';
import { Surface } from 'react-native-paper';
import BackArrowBtn from '../components/BackArrowBtn';
import { getStatusBarHeight } from '../utils/platformUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useQuestionModals } from '../components/QuestionModals';
import PrimaryLayout from '../components/PrimaryLayout';

export default function UpdateProfile() {

  const dispatch = useDispatch();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const { token, user } = useSelector((state) => state.auth); 

  // Transform user data to form format
  const getInitialValues = () => {
    if (!user) {
      return {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '',
        country: '',
        phoneCode: '',
        countryId: '',
      };
    }

    // Format phone number with country code
    const phoneNumber = user?.data?.phone_code && user?.data?.mobile_no
      ? `+${user?.data?.phone_code} ${user?.data?.mobile_no}`
      : '';

    return {
      firstName: user?.data?.first_name || '',
      lastName: user?.data?.last_name || '',
      phoneNumber: phoneNumber,
      gender: user?.data?.gender || '',
      country: user?.data?.phone_code || '',
      phoneCode: user?.data?.phone_code || '',
      countryId: user?.data?.country || '',
      email: user?.data?.email,
    };
  };

  const handleUpdateProfile = async (values) => {
    setIsUpdatingProfile(true);

    try {
      // Extract phone number without country code
      const phoneWithoutCode = values.phoneNumber.replace(/^\+\d+\s*/, '');

      const formData = new FormData();
      formData.append('first_name', values.firstName);
      formData.append('last_name', values.lastName);
      formData.append('mobile_no', phoneWithoutCode);
      formData.append('phone_code', values.country);
      formData.append('gender', values.gender);
      formData.append('country', values.countryId);

      const response = await dispatch(updateProfile({ formData, token }));

      if (response?.payload?.status === true) {

        await dispatch(getUserProfile(token));

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response?.payload?.message || 'Profile has been updated',
          position: 'top',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response?.payload?.message || 'Failed to update profile',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    // Optional: Handle field changes if needed
    console.log(`Field ${fieldName} changed to:`, value);
  };

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
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingWrapper
        contentContainerStyle={styles.scrollContent}
      >
        <PrimaryLayout title="Profile" />
        <View style={{
          flex: 1, marginTop: -16,
          backgroundColor: '#F5F6F9',
          // borderTopLeftRadius: 16,
          // borderTopRightRadius: 16,
          alignItems: 'center',
          paddingTop: 16,
        }}>
          <Surface
            style={{ width: '92%', margin: 16, padding: 16, backgroundColor: '#fff', borderRadius: 16 }}
          >
            <ProfileForm
              mode="update"
              initialValues={getInitialValues()}
              onSubmit={handleUpdateProfile}
              onFieldChange={handleFieldChange}
              submitButtonText="Update Profile"
              submitButtonLoading={isUpdatingProfile}
              submitButtonDisabled={isUpdatingProfile}
            />
          </Surface>
        </View>
      </KeyboardAvoidingWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#8B5CF6',
    paddingBottom: 20,
    paddingTop: 22 + getStatusBarHeight(),
  },
  headerTitle: {
    color: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 10,
    fontSize: 30,
    fontFamily: 'clash-display-700',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
}); 