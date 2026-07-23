// src/features/menu/components/AdminProductModal.jsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

let ImagePicker = null;
try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  console.warn('expo-image-picker package pending install');
}

const CATEGORIES = [
  { id: 'desayunos', label: 'Desayunos' },
  { id: 'almuerzos', label: 'Almuerzos' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'complementos', label: 'Complementos' },
];

export function AdminProductModal({
  visible,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      category: 'almuerzos',
      description: '',
      price: '',
      photo: '',
      allowAccompaniments: false,
    },
  });

  const selectedCategory = watch('category');
  const allowAccompaniments = watch('allowAccompaniments');
  const photoValue = watch('photo');

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        category: initialData.category || 'almuerzos',
        description: initialData.description || '',
        price: initialData.price ? String(initialData.price) : '',
        photo: initialData.photo || '',
        allowAccompaniments: Boolean(initialData.allowAccompaniments),
      });
    } else {
      reset({
        name: '',
        category: 'almuerzos',
        description: '',
        price: '',
        photo: '',
        allowAccompaniments: false,
      });
    }
  }, [initialData, visible, reset]);

  const handlePickImage = async () => {
    if (!ImagePicker) {
      Alert.alert(
        'Instalando Galería',
        'El módulo de galería requiere instalar el paquete `expo-image-picker`. Corre `pnpm install` en client-user.'
      );
      return;
    }
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Requerido',
          'Necesitamos acceso a tu galería para poder seleccionar la foto del platillo.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const photoUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setValue('photo', photoUri);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen de la galería.');
    }
  };

  const handleFormSubmit = async (formData) => {
    const numericPrice = parseFloat(formData.price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      Alert.alert('Precio Inválido', 'Ingresa un precio numérico válido.');
      return;
    }

    const payload = {
      ...formData,
      price: numericPrice,
    };

    await onSubmit(payload);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Encabezado del Modal */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <MaterialIcons
                name={initialData ? 'edit' : 'add-circle-outline'}
                size={26}
                color={COLORS.secondary}
              />
              <Text style={styles.headerTitle}>
                {initialData ? 'Editar Platillo' : 'Nuevo Platillo'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={24} color={COLORS.surface} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.formContent}>
            {/* Nombre del Platillo */}
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Ingresa el nombre del platillo' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nombre del Platillo"
                  placeholder="ej. Hamburguesa Kinal"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                  icon={<MaterialIcons name="fastfood" size={20} color={COLORS.primary} />}
                />
              )}
            />

            {/* Categoría */}
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.categoriesRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryOption, isSelected && styles.categorySelected]}
                    onPress={() => setValue('category', cat.id)}
                  >
                    <Text
                      style={[styles.categoryText, isSelected && styles.categoryTextSelected]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Precio (Simbolo Q Quetzal) */}
            <Controller
              control={control}
              name="price"
              rules={{ required: 'Ingresa el precio' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Precio (Q)"
                  placeholder="ej. 25.00"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.price?.message}
                  icon={<Text style={styles.quetzalIconSymbol}>Q</Text>}
                />
              )}
            />

            {/* Descripción */}
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Descripción"
                  placeholder="ej. Deliciosa preparación artesanal..."
                  multiline
                  numberOfLines={3}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  icon={<MaterialIcons name="notes" size={20} color={COLORS.primary} />}
                />
              )}
            />

            {/* Selector de Foto desde la Galería */}
            <Text style={styles.label}>Fotografía del Platillo</Text>
            <View style={styles.imagePickerSection}>
              {photoValue ? (
                <View style={styles.imagePreviewWrapper}>
                  <Image source={{ uri: photoValue }} style={styles.imagePreview} />
                  <View style={styles.imageActionsRow}>
                    <TouchableOpacity
                      style={styles.changeImageBtn}
                      onPress={handlePickImage}
                    >
                      <MaterialIcons name="photo-library" size={18} color={COLORS.surface} />
                      <Text style={styles.changeImageText}>Cambiar Foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeImageBtn}
                      onPress={() => setValue('photo', '')}
                    >
                      <MaterialIcons name="delete" size={18} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadBox}
                  onPress={handlePickImage}
                  activeOpacity={0.85}
                >
                  <View style={styles.uploadIconBadge}>
                    <MaterialIcons name="add-a-photo" size={26} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.uploadBoxTitle}>Seleccionar de la Galería 📱</Text>
                    <Text style={styles.uploadBoxSub}>
                      Toca para elegir una foto del platillo desde tu teléfono
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Switch Acompañamientos */}
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Permitir Acompañamientos</Text>
                <Text style={styles.switchSub}>
                  Permite añadir extras como papas o bebidas al ordenar
                </Text>
              </View>
              <Switch
                value={allowAccompaniments}
                onValueChange={(val) => setValue('allowAccompaniments', val)}
                trackColor={{ false: COLORS.border, true: COLORS.secondary }}
                thumbColor={allowAccompaniments ? COLORS.primary : '#f4f3f4'}
              />
            </View>

            {/* Botón de Envío */}
            <Button
              title={initialData ? 'Guardar Cambios' : 'Crear Platillo'}
              onPress={handleSubmit(handleFormSubmit)}
              loading={loading}
              style={styles.submitBtn}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    paddingBottom: SPACING.lg,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
    color: COLORS.surface,
  },
  closeBtn: {
    padding: 4,
  },
  formContent: {
    padding: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.md,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categorySelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  categoryTextSelected: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  quetzalIconSymbol: {
    fontSize: FONT_SIZE.md,
    fontWeight: '900',
    color: COLORS.primary,
    width: 20,
    textAlign: 'center',
  },
  imagePickerSection: {
    marginBottom: SPACING.md,
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderStyle: 'dashed',
    gap: SPACING.md,
  },
  uploadIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
  },
  uploadBoxTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '900',
    color: COLORS.primary,
  },
  uploadBoxSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  imagePreviewWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  imagePreview: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  imageActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  changeImageText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    color: COLORS.surface,
  },
  removeImageBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  switchSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  submitBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.secondary,
  },
});
