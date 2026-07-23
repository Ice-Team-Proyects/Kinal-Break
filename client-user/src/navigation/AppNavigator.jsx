// src/navigation/AppNavigator.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../shared/store/authStore.js';
import { AuthStack } from './AuthStack.jsx';
import { MainTabs } from './MainTabs.jsx';
import { LoadingSpinner } from '../shared/components/common/Common.jsx';
import { COLORS } from '../shared/constants/theme.js';

export function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  if (!_hasHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message="Iniciando Kinal-Break..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
