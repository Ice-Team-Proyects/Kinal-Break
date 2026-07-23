// src/features/profile/screens/ProfileScreen.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { Card, Badge } from '../../../shared/components/common/Common.jsx';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || user?.username || '',
      phone: user?.phone || '',
    },
  });

  const handleSaveProfile = (data) => {
    updateUser({ name: data.name, phone: data.phone });
    setIsEditing(false);
    Alert.alert('Perfil Actualizado', 'Tus datos han sido guardados en el dispositivo.');
  };

  const handleLogoutPrompt = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de Kinal-Break?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  const avatarUri = user?.profilePicture?.startsWith('http')
    ? user.profilePicture
    : null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card Avatar & Encabezado */}
        <Card style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={60} color={COLORS.secondary} />
              </View>
            )}
          </View>

          <Text style={styles.userName}>{user?.name || user?.username || 'Usuario Kinal'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'usuario@kinal.edu.gt'}</Text>

          <View style={styles.roleBadgeContainer}>
            <Badge
              label={user?.role === 'ADMIN_ROLE' ? '⚡ ADMINISTRADOR' : '🎓 ESTUDIANTE'}
              type={user?.role === 'ADMIN_ROLE' ? 'danger' : 'info'}
            />
          </View>
        </Card>

        {/* Panel para Administradores */}
        {user?.role === 'ADMIN_ROLE' && (
          <Card style={styles.adminPanelCard}>
            <View style={styles.adminPanelHeader}>
              <MaterialIcons name="admin-panel-settings" size={24} color={COLORS.secondary} />
              <Text style={styles.adminPanelTitle}>PANEL DE ADMINISTRACIÓN</Text>
            </View>
            <Text style={styles.adminPanelDesc}>
              Iniciaste sesión con privilegios de Administrador. Tienes control de CRUD sobre el menú y monitoreo de pedidos.
            </Text>
            <View style={styles.adminStatsRow}>
              <View style={styles.adminStatChip}>
                <MaterialIcons name="edit" size={16} color={COLORS.primary} />
                <Text style={styles.adminStatText}>CRUD de Platillos</Text>
              </View>
              <View style={styles.adminStatChip}>
                <MaterialIcons name="insights" size={16} color={COLORS.primary} />
                <Text style={styles.adminStatText}>Control de Pedidos</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Cuentas de Prueba para cambiar de rol */}
        <Card style={styles.demoAccountsCard}>
          <View style={styles.demoHeader}>
            <MaterialIcons name="swap-horiz" size={22} color={COLORS.primary} />
            <Text style={styles.demoTitle}>Cuentas para Pruebas de Rol</Text>
          </View>
          <Text style={styles.demoDesc}>
            Para probar las diferencias entre el Administrador y el Usuario Normal:
          </Text>

          <View style={styles.demoItem}>
            <Text style={styles.demoRole}>👑 Administrador (CRUD Admin):</Text>
            <Text style={styles.demoCreds}>Usuario: <Text style={{fontWeight:'900'}}>admin</Text>  |  Clave: <Text style={{fontWeight:'900'}}>Kinal2026!</Text></Text>
          </View>

          <View style={styles.demoItem}>
            <Text style={styles.demoRole}>🎓 Estudiante (Usuario Normal):</Text>
            <Text style={styles.demoCreds}>Usuario: <Text style={{fontWeight:'900'}}>aMorales-100</Text>  |  Clave: <Text style={{fontWeight:'900'}}>Kinal2026!</Text></Text>
          </View>
        </Card>

        {/* Formulario de Perfil / Edición */}
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Información Personal</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editToggleText}>
                {isEditing ? 'Cancelar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <>
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Nombre requerido' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Nombre"
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
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Teléfono"
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    icon={<MaterialIcons name="phone" size={20} color={COLORS.primary} />}
                  />
                )}
              />

              <Button
                title="Guardar Cambios"
                onPress={handleSubmit(handleSaveProfile)}
                style={{ marginTop: SPACING.sm }}
              />
            </>
          ) : (
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <MaterialIcons name="badge" size={20} color={COLORS.primary} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Usuario</Text>
                  <Text style={styles.infoValue}>{user?.username || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <MaterialIcons name="phone" size={20} color={COLORS.primary} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Teléfono</Text>
                  <Text style={styles.infoValue}>{user?.phone || 'No registrado'}</Text>
                </View>
              </View>
            </View>
          )}
        </Card>

        {/* Botón de Cerrar Sesión */}
        <Button
          title="Cerrar Sesión"
          variant="secondary"
          icon={<MaterialIcons name="logout" size={20} color={COLORS.surface} />}
          onPress={handleLogoutPrompt}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  profileHeaderCard: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    color: COLORS.primary,
  },
  userEmail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  roleBadgeContainer: {
    marginTop: SPACING.sm,
  },
  formCard: {
    padding: SPACING.lg,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  formTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  editToggleText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  infoList: {
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  logoutBtn: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  adminPanelCard: {
    backgroundColor: '#fff7ed',
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    borderRadius: 16,
  },
  adminPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  adminPanelTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  adminPanelDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    lineHeight: 18,
    marginTop: 2,
  },
  adminStatsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  adminStatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adminStatText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  demoAccountsCard: {
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  demoTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  demoDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  demoItem: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  demoRole: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    color: COLORS.primary,
  },
  demoCreds: {
    fontSize: FONT_SIZE.xs,
    color: '#334155',
    marginTop: 2,
  },
});

