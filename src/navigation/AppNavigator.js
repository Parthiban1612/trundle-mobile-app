import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

// Import screens
import IntroCarousel from '../screens/auth/IntroCarousel';
import SignUpTypeScreen from '../screens/auth/signup-type';
import SignInScreen from '../screens/auth/signin';
import OtpVerificationScreen from '../screens/auth/otp-verification';
import AuthSuccessScreen from '../screens/auth/AuthSuccessScreen';
import CreateProfile from '../screens/auth/create-profile';
import SelectCountryForTrip from '../screens/home/SelectCountryForTrip';
import Account from '../screens/account';
import Activities from '../screens/activities';
import PersonalisedSettings from '../screens/personolised-settings';
import BottomTabNavigator from './BottomTabNavigator';
import UpdateProfile from '../screens/account/update-profile';
import LocationDetails from '../screens/itinerary-details';
// import Testpage from '../screens/Testpage';
import { fetchQuestions } from '../redux/travelCountriesSlice';
import PrivacyPolicy from '../screens/cms/PrivacyPolicy';
import TermsAndConditions from '../screens/cms/TermsAndConditions';
import TermsOfServices from '../screens/cms/TermOfServices';
import RefundAndCancellation from '../screens/cms/RefundAndCancellation';

const Stack = createStackNavigator();

const AppNavigator = () => {

  const { isAuthenticated, introSeen, isViewSuccessScreen } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const navigationRef = useRef();

  const routeNameRef = useRef();

  const onStateChange = () => {
    if (isAuthenticated) {
      dispatch(fetchQuestions());
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={onStateChange}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'default',
        }}
      >
        {isAuthenticated ? (
          // Main screen when authenticated
          <>
            {!isViewSuccessScreen && (
              <Stack.Screen
                name="AuthSuccess"
                component={AuthSuccessScreen}
              />
            )}
            {/* <Stack.Screen
              name="Testpage"
              component={Testpage}
            /> */}
            <Stack.Screen
              name="MainTabs"
              component={BottomTabNavigator}
            />
            <Stack.Screen
              name="CreateProfile"
              component={CreateProfile}
            />
            <Stack.Screen
              name="Account"
              component={Account}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicy}
            />
            <Stack.Screen
              name="TermsAndConditions"
              component={TermsAndConditions}
            />
            <Stack.Screen
              name="TermsOfServices"
              component={TermsOfServices}
            />
            <Stack.Screen
              name="RefundAndCancellation"
              component={RefundAndCancellation}
            />
            <Stack.Screen
              name="SelectCountryForTrip"
              component={SelectCountryForTrip}
            />
            <Stack.Screen
              name="UpdateProfile"
              component={UpdateProfile}
            />
            <Stack.Screen
              name="Activities"
              component={Activities}
            />
            <Stack.Screen
              name="PersonalisedSettings"
              component={PersonalisedSettings}
            />
            <Stack.Screen
              name="LocationDetails"
              component={LocationDetails}
            />
          </>
        ) : !introSeen ? (
          // Intro carousel when not authenticated and intro not seen
          <Stack.Screen
            name="IntroCarousel"
            component={IntroCarousel}
          />
        ) : (
          // Auth flow screens when not authenticated but intro seen
          <>
            <Stack.Screen
              name="SignUpType"
              component={SignUpTypeScreen}
            />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
            />
            <Stack.Screen
              name="OtpVerification"
              component={OtpVerificationScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 