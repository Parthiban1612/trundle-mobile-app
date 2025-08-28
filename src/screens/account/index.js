import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Linking, Modal, TouchableWithoutFeedback, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, Surface, Button, TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getUserProfile, updateUserProfileImage, updateUserPhoto } from '../../redux/authSlice';
import { signOutFromGoogle } from '../../services/googleAuth';
import ActivityIcon from '../../../assets/activities.svg';
import SettingsIcon from '../../../assets/settings.svg';
import ReferIcon from '../../../assets/user_req.svg';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useQuestionModals } from '../../components/QuestionModals';
import PrimaryLayout from '../../components/PrimaryLayout';
import AddPhotoIcon from '../../../assets/add-photo.png';
import ImagePicker from "react-native-image-crop-picker";
import Toast from 'react-native-toast-message';

// Profile Skeleton Component
const ProfileSkeleton = () => (
  <Surface style={styles.profileCard} elevation={1}>
    <View style={styles.avatarCircle}>
      <SkeletonLoader width={64} height={64} borderRadius={32} />
    </View>
    <SkeletonLoader width={120} height={18} borderRadius={4} style={{ marginTop: 12, marginBottom: 2 }} />
    <SkeletonLoader width={180} height={13} borderRadius={4} style={{ marginBottom: 12 }} />
    <SkeletonLoader width={100} height={36} borderRadius={20} style={{ marginTop: 4 }} />
  </Surface>
);

// Custom Confirmation Modal Component
const ConfirmationModal = ({ visible, onClose, onConfirm, title, message, iconName, iconColor, confirmText, confirmColor }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Icon name={iconName} size={24} color={iconColor} />
                <Text style={styles.modalTitle}>{title}</Text>
              </View>
              <Text style={styles.modalMessage}>
                {message}
              </Text>
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={onClose}
                  style={styles.cancelButton}
                  labelStyle={styles.cancelButtonText}
                  rippleColor={`rgba(60,60,60,0.12)`}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={onConfirm}
                  style={styles.confirmButton}
                  labelStyle={styles.confirmButtonText}
                  buttonColor={confirmColor}
                >
                  {confirmText}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

function Account() {

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const { openDynamicQuestionSheet } = useQuestionModals();

  const { submittedCountry } = useSelector((state) => state.travelCountries);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const [removeImageModalVisible, setRemoveImageModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const { user, profileImage } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getUserProfile())
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const { questions, questionsLoading } = useSelector((state) => state.travelCountries);

  useFocusEffect(
    useCallback(() => {
      if (questions?.data?.length > 0 && !questionsLoading) {
        openDynamicQuestionSheet({ questions: questions?.data, onComplete: () => { }, onSkip: () => { }, snapPoints: ['25%'] });
      }
    }, [questions?.data?.length, questionsLoading])
  );

  const handleEditProfile = () => {
    navigation.navigate('UpdateProfile');
  };

  const handleUploadProfilePicture = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: false,
        showCropGuidelines: true,
        hideBottomControls: false,
        cropperActiveWidgetColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperStatusBarColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperToolbarColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperToolbarTitle: 'Crop Profile Picture',
        cropperToolbarWidgetColor: '#FFFFFF',
        cropperBackgroundColor: '#1A1A1A',
        cropperBorderColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperBorderWidth: 2,
        cropperGridColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperGridLineWidth: 1,
        cropperGridOpacity: 0.3,
        cropperHandleColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperHandleSize: 20,
        cropperHandleBorderColor: '#FFFFFF',
        cropperHandleBorderWidth: 2,
        cropperRotateButtonColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperRotateButtonBackgroundColor: '#FFFFFF',
        cropperRotateButtonBorderColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperDoneButtonColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperDoneButtonBackgroundColor: '#FFFFFF',
        cropperDoneButtonBorderColor: submittedCountry?.data?.background_color || '#6F27FF',
        cropperCancelButtonColor: '#FF5A5F',
        cropperCancelButtonBackgroundColor: '#FFFFFF',
        cropperCancelButtonBorderColor: '#FF5A5F',
        cropperTitleTextColor: '#FFFFFF',
        cropperSubtitleTextColor: '#CCCCCC',
        cropperInstructionsTextColor: '#FFFFFF',
        mediaType: 'photo',
        includeBase64: false,
        maxFiles: 1,
        quality: 0.8,
        // iOS specific options
        forceJpg: Platform.OS === 'ios',
        compressImageMaxWidth: Platform.OS === 'ios' ? 800 : 400,
        compressImageMaxHeight: Platform.OS === 'ios' ? 800 : 400,
        compressImageQuality: Platform.OS === 'ios' ? 0.8 : 0.8,
        // Android specific options
        cropperStatusBarColor: Platform.OS === 'android' ? (submittedCountry?.data?.background_color || '#6F27FF') : undefined,
        cropperToolbarColor: Platform.OS === 'android' ? (submittedCountry?.data?.background_color || '#6F27FF') : undefined,
      });
      const formData = new FormData();

      const imageData = {
        uri: image.path,
        name: image.filename,
        type: image.mime,
      }

      formData.append('photo', imageData);

      try {

        const response = await dispatch(updateUserProfileImage(formData));

        if (response.payload?.status === true) {

          dispatch(updateUserPhoto(response?.payload?.photo));

          Toast.show({
            text1: response.payload?.message,
            type: 'success',
          });

        } else {
          Toast.show({
            text1: response.payload?.message || 'Failed to update profile picture. Please try again.',
            type: 'error',
          });
        }
      } catch (apiError) {
        Toast.show({
          text1: 'Network error. Please check your connection and try again.',
          type: 'error',
        });
      }
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        let errorMessage = 'Failed to pick image. Please try again.';

        if (Platform.OS === 'ios') {
          switch (error.code) {
            case 'E_NO_IMAGE_DATA_FOUND':
              errorMessage = 'No image data found. Please try selecting a different image.';
              break;
            case 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR':
              errorMessage = 'Camera cannot run on simulator. Please use a real device.';
              break;
            case 'E_PICKER_NO_DATA':
              errorMessage = 'No image data available. Please try again.';
              break;
            case 'E_PICKER_NO_PHOTO_LIBRARY_PERMISSION':
              errorMessage = 'Photo library permission is required. Please grant access in Settings.';
              break;
            default:
              errorMessage = `Error: ${error.message || 'Unknown error occurred'}`;
          }
        }
        Alert.alert('Error', errorMessage);
      }
    }
  };


  const handleMenuPress = (menu) => {
    switch (menu) {
      case 'activities':
        navigation.navigate('Activities');
        break;
      case 'personalized':
        navigation.navigate('PersonalisedSettings');
        break;
      case 'refer':
        // Implement refer a friend functionality
        console.log('Refer a friend pressed');
        break;
      default:
        break;
    }
  };

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      // Sign out from Google if user was signed in with Google
      await signOutFromGoogle();

      // Clear Redux state and persist storage
      dispatch(logout());

      setLogoutModalVisible(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if Google sign-out fails, still clear local state
      dispatch(logout());
      setLogoutModalVisible(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  const handleRemoveImage = () => {
    dispatch(updateUserPhoto(null));
    setRemoveImageModalVisible(false);
  };

  const handleRemoveImageCancel = () => {
    setRemoveImageModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <PrimaryLayout title="Account" />
      <View style={{
        flex: 1, marginTop: -16,
        backgroundColor: '#F5F6F9',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        alignItems: 'center',
        paddingTop: 16,
      }}>
        {
          isLoading ? (
            <ProfileSkeleton />
          ) : (
            <Surface style={styles.profileCard} elevation={1}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={handleUploadProfilePicture}
                onLongPress={() => {
                  if (profileImage) {
                    setRemoveImageModalVisible(true);
                  }
                }}
              >
                {profileImage ? (
                  <>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: profileImage }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                        onError={(error) => {
                          console.error('Error loading profile image:', error);
                          // Fallback to default icon if image fails to load
                        }}
                      />
                    </View>
                    <View style={styles.imageOverlay}>
                      <Icon name="edit-2" size={10} color="#fff" />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.avatarContainer}>
                      <Image source={AddPhotoIcon} style={{ width: 80, height: 80 }} />
                    </View>
                    <View style={styles.addPhotoOverlay}>
                      <Icon name="plus" size={18} color="#666" />
                    </View>
                  </>
                )}
              </TouchableOpacity>
              <Text numberOfLines={2} style={styles.profileName}>{user?.data?.first_name} {user?.data?.last_name}</Text>
              <Text numberOfLines={2} style={styles.profileEmail}>{user?.data?.email}</Text>
              <Button
                mode="outlined"
                onPress={handleEditProfile}
                style={styles.editProfileBtn}
                labelStyle={styles.editProfileText}
                rippleColor={`rgba(60,60,60,0.12)`}
              >
                Edit Profile
              </Button>
            </Surface>
          )
        }
        {/* Menu Cards */}
        <View style={styles.menuSection}>
          <TouchableRipple
            style={{ borderTopEndRadius: 16, borderTopLeftRadius: 16 }}
            mode="text"
            onPress={() => handleMenuPress('activities')}
            rippleColor={`rgba(60,60,60,0.12)`}
            borderless
          >
            <View style={[styles.menuCardContent]}>
              <ActivityIcon width={24} height={24} />
              <Text style={styles.menuText}>Activities</Text>
            </View>
          </TouchableRipple>
          <View style={{ height: 1, marginHorizontal: 18, backgroundColor: '#DAD8DF' }} />
          <TouchableRipple
            mode="text"
            onPress={() => handleMenuPress('personalized')}
            rippleColor={`rgba(60,60,60,0.12)`}
            borderless
          >
            <View style={styles.menuCardContent}>
              <SettingsIcon width={24} height={24} />
              <Text style={styles.menuText}>Personalised settings</Text>
            </View>
          </TouchableRipple>
          <View style={{ height: 1, marginHorizontal: 18, backgroundColor: '#DAD8DF' }} />
          <TouchableRipple
            mode="text"
            onPress={() => handleMenuPress('refer')}
            rippleColor={`rgba(60,60,60,0.12)`}
            borderless
            style={{ borderBottomEndRadius: 16, borderBottomLeftRadius: 16 }}
          >
            <View style={styles.menuCardContent}>
              <ReferIcon width={24} height={24} />
              <Text style={styles.menuText}>Refer a friend</Text>
            </View>
          </TouchableRipple>
        </View>
        {/* Logout Card */}
        <TouchableRipple
          mode="text"
          onPress={handleLogoutPress}
          rippleColor={`rgba(60,60,60,0.12)`}
          style={styles.logoutCard}
          borderless
        >
          <View style={styles.menuCardContent}>
            <Icon name="log-out" size={22} color="#FF5A5F" />
            <Text style={styles.logoutText}>Logout</Text>
          </View>

        </TouchableRipple>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.supportText}>For support, write to</Text>
          <Button
            mode="text"
            onPress={() => Linking.openURL('mailto:care@trundle.me')}
            labelStyle={styles.supportEmail}
            compact
          >
            care@trundle.me
          </Button>
          <View style={styles.footerLinks}>
            <Button
              mode="text"
              labelStyle={styles.footerLink}
              compact
              onPress={() => navigation.navigate('TermsAndConditions')}
            >
              Terms & Conditions
            </Button>
            <Text style={styles.footerDivider}>|</Text>
            <Button
              mode="text"
              labelStyle={styles.footerLink}
              compact
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              Privacy Policy
            </Button>
            <Text style={styles.footerDivider}>|</Text>
            <Button
              mode="text"
              labelStyle={styles.footerLink}
              compact
              onPress={() => navigation.navigate('TermsOfServices')}
            >
              Terms of Service
            </Button>
            <Button
              mode="text"
              labelStyle={styles.footerLink}
              compact
              onPress={() => navigation.navigate('RefundAndCancellation')}
            >
              Refund and Cancellation
            </Button>
          </View>
        </View>
        <ConfirmationModal
          visible={logoutModalVisible}
          onClose={handleLogoutCancel}
          onConfirm={handleLogoutConfirm}
          title="Logout"
          message="Are you sure you want to logout?"
          iconName="log-out"
          iconColor="#FF5A5F"
          confirmText="Logout"
          confirmColor="#FF5A5F"
        />
        <ConfirmationModal
          visible={removeImageModalVisible}
          onClose={handleRemoveImageCancel}
          onConfirm={handleRemoveImage}
          title="Remove Image"
          message="Do you want to remove the current profile picture?"
          iconName="trash-2"
          iconColor="#FF5A5F"
          confirmText="Remove"
          confirmColor="#FF5A5F"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'clash-display-600',
    color: '#222',
    marginTop: 12,
    marginBottom: 2,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 13,
    color: '#938EA2',
    fontFamily: 'instrument-sans-400',
    marginBottom: 12,
  },
  editProfileBtn: {
    borderWidth: 1,
    borderColor: '#DAD8DF',
    borderRadius: 20,
    marginTop: 4,
  },
  editProfileText: {
    color: '#3B3842',
    fontFamily: 'instrument-sans-500',
    fontSize: 14,
  },
  menuSection: {
    width: '92%',
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  menuCard: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    elevation: 1,
  },
  menuText: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'instrument-sans-400',
    marginLeft: 16,
  },
  logoutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  logoutText: {
    fontSize: 15,
    color: '#F57474',
    fontFamily: 'instrument-sans-600',
    marginLeft: 15,
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
  },
  supportText: {
    color: '#B9B6C3',
    fontSize: 13,
    fontFamily: 'instrument-sans-400',
    marginBottom: 2,
  },
  supportEmail: {
    color: '#222',
    fontFamily: 'instrument-sans-600',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerLink: {
    color: '#B9B6C3',
    fontFamily: 'instrument-sans-400',
    fontSize: 13,
    marginHorizontal: 4,
  },
  footerDivider: {
    color: '#B9B6C3',
    fontSize: 13,
    marginHorizontal: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'instrument-sans-600',
    color: '#222',
    marginLeft: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#DAD8DF',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#3B3842',
    fontFamily: 'instrument-sans-500',
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontFamily: 'instrument-sans-600',
    fontSize: 14,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  addPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default Account;
