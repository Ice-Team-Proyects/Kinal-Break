// src/features/auth/screens/VerifyEmailScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth.js';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export function VerifyEmailScreen({ navigation }) {
  const { handleVerifyEmail, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      token: '',
    },
  });

  const onSubmit = async (data) => {
    const res = await handleVerifyEmail(data.token);
    if (res.success) {
      Alert.alert('¡Cuenta Verificada!', 'Tu correo ha sido activado correctamente. Ya puedes iniciar sesión.', [
        { text: 'Ir al Login', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      Alert.alert('Error de Verificación', res.error || 'Token inválido o expirado.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="mark-email-read" size={60} color={COLORS.secondary} />
        <Text style={styles.title}>Activar Cuenta</Text>
        <Text style={styles.subtitle}>Ingresa el código enviado a tu correo institucional</Text>
      </View>

      <View style={styles.card}>
        <Controller
          control={control}
          name="token"
          rules={{ required: 'Ingresa el código o token' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Token de Verificación"
              placeholder="Pega el token aquí"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.token?.message}
              icon={<MaterialIcons name="vpn-key" size={20} color={COLORS.primary} />}
            />
          )}
        />

        {error && <Text style={styles.formError}>{error}</Text>}

        <Button
          title="Verificar Correo"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.submitBtn}
        />

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backText}>Volver al Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.secondary,
    marginTop: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.surface,
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
  },
  submitBtn: {
    marginTop: SPACING.md,
  },
  formError: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  backLink: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  backText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
