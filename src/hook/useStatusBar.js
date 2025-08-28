// hooks/useStatusBar.js

import { useFocusEffect } from '@react-navigation/native';
import { StatusBar, Platform } from 'react-native';
import { useCallback } from 'react';

export default function useStatusBar(barStyle = 'dark-content', bgColor = '#FFFFFF') {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(barStyle);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(bgColor);
      }
    }, [barStyle, bgColor])
  );
}