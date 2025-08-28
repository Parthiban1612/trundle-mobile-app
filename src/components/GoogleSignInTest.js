import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { configureGoogleSignIn, signInWithGoogle, isSignedIn, getCurrentUser } from '../services/googleAuth';

const GoogleSignInTest = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    // Configure Google Sign-In when component mounts
    try {
      configureGoogleSignIn();
      setIsConfigured(true);
      console.log('Google Sign-In configured successfully');
    } catch (error) {
      console.error('Failed to configure Google Sign-In:', error);
      setIsConfigured(false);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        setUserInfo(result.user);
        setIsUserSignedIn(true);
        Alert.alert('Success', 'Google Sign-In successful!');
        console.log('User signed in:', result.user);
        console.log('ID Token:', result.idToken);
        console.log('Access Token:', result.accessToken);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const checkSignInStatus = async () => {
    try {
      const signedIn = await isSignedIn();
      setIsUserSignedIn(signedIn);

      if (signedIn) {
        const currentUser = await getCurrentUser();
        setUserInfo(currentUser);
        Alert.alert('Status', 'User is signed in');
      } else {
        setUserInfo(null);
        Alert.alert('Status', 'User is not signed in');
      }
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      Alert.alert('Error', 'Failed to check sign-in status');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Sign-In Test</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Configuration: {isConfigured ? '✅ Configured' : '❌ Not Configured'}
        </Text>
        <Text style={styles.statusText}>
          Sign-In Status: {isUserSignedIn ? '✅ Signed In' : '❌ Not Signed In'}
        </Text>
      </View>

      {userInfo && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoTitle}>User Information:</Text>
          <Text style={styles.userInfoText}>Name: {userInfo.name}</Text>
          <Text style={styles.userInfoText}>Email: {userInfo.email}</Text>
          <Text style={styles.userInfoText}>ID: {userInfo.id}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={checkSignInStatus}>
          <Text style={styles.buttonText}>Check Sign-In Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  userInfoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#34A853',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoogleSignInTest; 