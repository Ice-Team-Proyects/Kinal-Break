// src/shared/components/common/Input.jsx

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme.js';

export function Input({
  label,
  error,
  icon,
  rightIcon,
  style,
  inputStyle,
  containerStyle,
  ...props
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError, style]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={COLORS.textLight}
          {...props}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  rightIconContainer: {
    marginLeft: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
});
