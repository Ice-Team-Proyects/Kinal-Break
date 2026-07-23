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

export function LoginScreen({ navigation }) {
  const { handleLogin, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const res = await handleLogin(data);
    if (!res.success) {
      Alert.alert('Acceso Denegado', res.error);
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
        {/* Encabezado Comic Pop Art */}
        <View style={styles.header}>
          <View style={styles.comicBadgeTag}>
            <Text style={styles.comicBadgeText}>⚡ CAFETERÍA KINAL ⚡</Text>
          </View>

          <View style={styles.logoBadgeContainer}>
            <View style={styles.logoBadge}>
              <MaterialIcons name="local-cafe" size={52} color={COLORS.secondary} />
            </View>
          </View>

          <Text style={styles.title}>KINAL-BREAK!</Text>
          <View style={styles.subtitleTag}>
            <Text style={styles.subtitle}>¡Tu energía antes del timbre!</Text>
          </View>
        </View>

        {/* Tarjeta con Estilo Comic Panel */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBox}>
            <Text style={styles.cardTitle}>INICIAR SESIÓN</Text>
          </View>

          <Controller
            control={control}
            name="emailOrUsername"
            rules={{ required: 'Ingresa tu usuario o correo' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Usuario o Correo"
                placeholder="ej. aMorales-100"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.emailOrUsername?.message}
                icon={<MaterialIcons name="person-outline" size={22} color="#000000" />}
                style={styles.comicInputWrapper}
                inputStyle={styles.comicInputText}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Ingresa tu contraseña' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contraseña"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                icon={<MaterialIcons name="lock-outline" size={22} color="#000000" />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={22}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                }
                style={styles.comicInputWrapper}
                inputStyle={styles.comicInputText}
              />
            )}
          />

          {error && <Text style={styles.formError}>{error}</Text>}

          <Button
            title="¡ENTRAR AHORA!"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitBtn}
            textStyle={styles.submitBtnText}
          />

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <View style={styles.registerBubble}>
              <Text style={styles.registerText}>
                ¿Sin cuenta? <Text style={styles.registerHighlight}>¡Regístrate aquí!</Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Azul Marino
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  comicBadgeTag: {
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 8,
    transform: [{ rotate: '-2deg' }],
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  comicBadgeText: {
    color: COLORS.secondary,
    fontWeight: '900',
    fontSize: FONT_SIZE.xs,
    letterSpacing: 1.5,
  },
  logoBadgeContainer: {
    marginBottom: SPACING.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderColor: '#000000',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.secondary, // Naranja
    letterSpacing: 2,
    textShadowColor: '#000000',
    textShadowOffset: { width: 2.5, height: 2.5 },
    textShadowRadius: 0,
    marginTop: 4,
  },
  subtitleTag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000000',
    marginTop: 6,
    transform: [{ rotate: '1deg' }],
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    color: '#000000',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    borderWidth: 3.5,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  cardHeaderBox: {
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#000000',
    marginBottom: SPACING.lg,
    transform: [{ rotate: '-1deg' }],
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
    color: COLORS.surface,
    letterSpacing: 1,
    textAlign: 'center',
  },
  comicInputWrapper: {
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  comicInputText: {
    fontWeight: '700',
    color: '#000000',
  },
  submitBtn: {
    marginTop: SPACING.md,
    height: 56,
    backgroundColor: COLORS.secondary, // Naranja
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  submitBtnText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: FONT_SIZE.md,
    letterSpacing: 1,
  },
  formError: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontWeight: '800',
    backgroundColor: '#fee2e2',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.error,
  },
  registerLink: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  registerBubble: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  registerText: {
    fontSize: FONT_SIZE.sm,
    color: '#000000',
    fontWeight: '700',
  },
  registerHighlight: {
    color: COLORS.secondaryDark,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});

