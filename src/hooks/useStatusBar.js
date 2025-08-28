// hooks/useStatusBar.js

import { useFocusEffect } from '@react-navigation/native';
import { StatusBar, Platform } from 'react-native';
import { useCallback } from 'react';

export default function useStatusBar(barStyle = 'dark-content', bgColor = '#FFFFFF') {
  useFocusEffect(
    useCallback(() => {
      // Set status bar style for both platforms
      StatusBar.setBarStyle(barStyle);

      // Set background color only for Android (iOS handles this automatically)
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(bgColor);
        StatusBar.setTranslucent(false);
      }
    }, [barStyle, bgColor])
  );
}
