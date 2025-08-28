import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryHeader from '../components/PrimaryHeader';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ProfileForm from '../components/ProfileForm';
import { useSelector, useDispatch } from 'react-redux';
import { createProfile } from '../redux/authSlice';
import Toast from 'react-native-toast-message';
import useStatusBar from '../hook/useStatusBar';

export default function CreateProfile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const handleCreateProfile = async (values) => {
    setIsCreatingProfile(true);

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

      const response = await dispatch(createProfile({ formData, token }));

      if (response?.payload?.status === true) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response?.payload?.message || 'Profile has been created',
          position: 'top',
          visibilityTime: 3000,
        });
        navigation.navigate('SelectCountryForTrip');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response?.payload?.message || 'Failed to create profile',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  useStatusBar('light-content', '#8B5CF6');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingWrapper
        contentContainerStyle={styles.scrollContent}
      >
        <PrimaryHeader
          title="Create Profile"
          text1="Please enter the requested details"
        >
          <ProfileForm
            mode="create"
            onSubmit={handleCreateProfile}
            submitButtonText="Create Profile"
            submitButtonLoading={isCreatingProfile}
            submitButtonDisabled={isCreatingProfile}
          />
        </PrimaryHeader>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
});
