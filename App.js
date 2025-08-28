import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import * as Font from 'expo-font';
// import { configureGoogleSignIn } from './src/services/googleAuth';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalBottomSheetProvider } from './src/context/GlobalBottomSheetContext';

function AppFlow() {
  return <AppNavigator />;
}

function PersistLoading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#7E5BEF" />
      <Text style={styles.loadingText}>Loading app data...</Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "instrument-sans-400": require("./assets/fonts/InstrumentSans-Regular.ttf"),
          "instrument-sans-500": require("./assets/fonts/InstrumentSans-Medium.ttf"),
          "instrument-sans-600": require("./assets/fonts/InstrumentSans-SemiBold.ttf"),
          "instrument-sans-700": require("./assets/fonts/InstrumentSans-Bold.ttf"),
          "clash-display-600": require("./assets/fonts/ClashDisplay-Semibold.otf"),
          "clash-display-700": require("./assets/fonts/ClashDisplay-Bold.otf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true);
      }
    }

    // configureGoogleSignIn();
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7E5BEF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<PersistLoading />} persistor={persistor}>
          <PaperProvider>
            <GlobalBottomSheetProvider>
              <AppFlow />
              <Toast />
            </GlobalBottomSheetProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'instrument-sans-500',
  },
});