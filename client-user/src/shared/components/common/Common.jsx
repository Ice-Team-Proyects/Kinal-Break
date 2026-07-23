// src/shared/components/common/Common.jsx

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme.js';

export function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.secondary} />
      {message && <Text style={styles.loadingText}>{message}</Text>}
    </View>
  );
}

export function EmptyState({ title = 'Sin registros', message = 'No hay datos disponibles por el momento.', icon }) {
  return (
    <View style={styles.emptyContainer}>
      {icon}
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({ label, type = 'info', style }) {
  const getBadgeStyle = () => {
    switch (type) {
      case 'success':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'warning':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'danger':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#e0f2fe', text: '#075985' };
    }
  };

  const currentType = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: currentType.bg }, style]}>
      <Text style={[styles.badgeText, { color: currentType.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.md,
  },
  emptyMessage: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
