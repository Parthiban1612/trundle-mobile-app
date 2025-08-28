import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    // Get these values from Google Cloud Console
    // For Android: Use your SHA-1 fingerprint and package name
    // For iOS: Use your bundle identifier
    webClientId: '1015972329649-kdmpvmdagf6f3ndqnmqqpp7svgoe699e.apps.googleusercontent.com', // Get this from Google Cloud Console
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
    // Add scopes for better debugging
    scopes: ['profile', 'email']
  });

  // Debug: Check if configuration is working
  console.log('Google Sign-In configured with webClientId:', '1015972329649-kdmpvmdagf6f3ndqnmqqpp7svgoe699e.apps.googleusercontent.com');
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices();

    // Get the users ID token
    const userInfo = await GoogleSignin.signIn();

    // Get the user's ID token for server-side verification
    const { accessToken } = await GoogleSignin.getTokens();

    return {
      success: true,
      user: userInfo.user,
      idToken: userInfo.idToken,
      accessToken: accessToken,
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        success: false,
        error: 'User cancelled the sign-in flow',
      };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return {
        success: false,
        error: 'Sign-in is already in progress',
      };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        success: false,
        error: 'Google Play Services not available',
      };
    } else {
      return {
        success: false,
        error: error.message || 'An unknown error occurred',
      };
    }
  }
};

// Sign out from Google
export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    return { success: true };
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during sign out',
    };
  }
};

// Check if user is signed ina
export const isSignedIn = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    return isSignedIn;
  } catch (error) {
    console.error('Error checking sign-in status:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    return userInfo;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};



