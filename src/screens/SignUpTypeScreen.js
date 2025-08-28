import React, { useEffect } from 'react';
import { View, Alert, Text, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NextButton from '../components/NextButton';
import PrimaryHeader from '../components/PrimaryHeader';
import { configureGoogleSignIn, signInWithGoogle } from '../services/googleAuth';
import { Divider } from 'react-native-paper';
import MailIcon from "../../assets/mail.svg";
import GoogleIcon from "../../assets/google.svg";

export default function SignUpTypeScreen() {

  const navigation = useNavigation();

  // Configure Google Sign-In when component mounts
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleEmailSignUp = () => {
    // For email signup, we'll navigate to SignIn screen
    // This is acceptable since it's within the same navigator
    navigation.navigate('SignIn');
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        console.log('Google sign-in successful:', result.user);
        console.log('User ID Token:', result.idToken);
        console.log('Access Token:', result.accessToken);

        // Here you can handle the successful sign-in
        // For example, save user data to your app state or navigate to main screen
        // You might want to send the idToken to your backend for verification

        // For now, let's navigate to the main screen
        navigation.navigate('Main');
      } else {
        Alert.alert('Sign-In Error', result.error);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      Alert.alert('Error', 'An unexpected error occurred during sign-in');
    }
  };

  return (
    <PrimaryHeader title="Welcome to Trundle" text1="Sign in quickly with your email or Gmail">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={{ gap: 12, width: "100%" }}>
        <NextButton
          theme="dark"
          onPress={handleEmailSignUp}
          icon={() => <MailIcon height={16} width={16} />}
          text="Sign up with Email"
        />
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 24, marginHorizontal: 40 }}>
          <Divider
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#DAD8DF',
            }}
            theme={{ colors: { primary: '#DAD8DF' } }} />
          <Text>
            Or
          </Text>
          <Divider
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#DAD8DF',
            }}
            theme={{ colors: { primary: '#DAD8DF' } }} />
        </View>
        <NextButton
          theme="light"
          onPress={handleGoogleSignUp}
          icon={() => <GoogleIcon height={16} width={16} color={"white"} name='mail-outline' />}
          text="Sign up with Google"
        />
      </View>
    </PrimaryHeader>
  )
}