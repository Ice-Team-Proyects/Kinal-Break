import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth.js';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export function RegisterScreen({ navigation }) {
  const { handleRegister, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const res = await handleRegister(data);
    if (res.success) {
      Alert.alert('Registro Exitoso', res.message, [
        {
          text: 'Activar Cuenta',
          onPress: () => navigation.navigate('VerifyEmail'),
        },
      ]);
    } else {
      Alert.alert('Error', res.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Forma parte de Kinal-Break</Text>
        </View>

        <View style={styles.card}>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Tu nombre es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nombre"
                placeholder="ej. Carlos"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
                icon={<MaterialIcons name="person" size={20} color={COLORS.primary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="surname"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Apellido"
                placeholder="ej. Lopez"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                icon={<MaterialIcons name="person-outline" size={20} color={COLORS.primary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="username"
            rules={{ required: 'Usuario requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nombre de Usuario"
                placeholder="ej. clopez-2024100"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.username?.message}
                icon={<MaterialIcons name="badge" size={20} color={COLORS.primary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{ required: 'Correo electrónico requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Correo Institucional"
                placeholder="ej. estudiante@kinal.edu.gt"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
                icon={<MaterialIcons name="email" size={20} color={COLORS.primary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Contraseña requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contraseña"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                icon={<MaterialIcons name="lock" size={20} color={COLORS.primary} />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                }
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Teléfono (Opcional)"
                placeholder="ej. 55554444"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                icon={<MaterialIcons name="phone" size={20} color={COLORS.primary} />}
              />
            )}
          />

          {error && <Text style={styles.formError}>{error}</Text>}

          <Button
            title="Registrarse"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitBtn}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? <Text style={styles.loginHighlight}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.surface,
    opacity: 0.8,
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
  loginLink: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  loginText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  loginHighlight: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
});
