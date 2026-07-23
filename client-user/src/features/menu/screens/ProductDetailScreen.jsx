// src/features/menu/screens/ProductDetailScreen.jsx

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
import { MaterialIcons } from '@expo/vector-icons';
import { useMenu } from '../hooks/useMenu.js';
import { useCartStore } from '../../../shared/store/cartStore.js';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Badge } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

import { useAuthStore } from '../../../shared/store/authStore.js';

import { AdminProductModal } from '../components/AdminProductModal.jsx';

export function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params || {};
  const { accompaniments, updateProduct, deleteProduct } = useMenu();
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN_ROLE';

  const [quantity, setQuantity] = useState(1);
  const [selectedAccompaniment, setSelectedAccompaniment] = useState(null);
  
  // Admin Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);

  if (!currentProduct) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Producto no encontrado.</Text>
        <Button title="Volver al Menú" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const basePrice = currentProduct.price || 0;
  const acompPrice = selectedAccompaniment ? selectedAccompaniment.price || 0 : 0;
  const unitPrice = basePrice + acompPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (isAdmin) {
      Alert.alert('Modo Administrador', 'El usuario Administrador no realiza compras de comida.');
      return;
    }
    addToCart(currentProduct, quantity, selectedAccompaniment);
    Alert.alert(
      '¡Agregado!',
      `${currentProduct.name} ha sido añadido a tu carrito.`,
      [
        { text: 'Seguir Pidiendo', style: 'cancel', onPress: () => navigation.goBack() },
        { text: 'Ver Carrito', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const handleDeleteProductPrompt = () => {
    Alert.alert(
      'Eliminar Platillo',
      `¿Estás seguro de que deseas eliminar "${currentProduct.name}" del catálogo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteProduct(currentProduct._id);
            if (res.success) {
              Alert.alert('Eliminado', 'El platillo ha sido eliminado correctamente.');
              navigation.goBack();
            } else {
              Alert.alert('Error', res.error);
            }
          },
        },
      ]
    );
  };

  const handleUpdateProductSubmit = async (formData) => {
    setModalLoading(true);
    const res = await updateProduct(currentProduct._id, formData);
    setModalLoading(false);

    if (res.success) {
      setCurrentProduct({ ...currentProduct, ...formData });
      setIsEditModalOpen(false);
      Alert.alert('¡Actualizado!', 'Los datos del platillo se han guardado exitosamente.');
    } else {
      Alert.alert('Error', res.error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagen del Producto */}
        <View style={styles.imageHeader}>
          {currentProduct.photo ? (
            <Image source={{ uri: currentProduct.photo }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialIcons name="fastfood" size={80} color={COLORS.textLight} />
            </View>
          )}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Info Principal */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{currentProduct.name}</Text>
            <Badge label={(currentProduct.category || 'Menú').toUpperCase()} type="info" />
          </View>

          <Text style={styles.price}>Q{basePrice.toFixed(2)}</Text>

          <Text style={styles.description}>
            {currentProduct.description || 'Deliciosa preparación fresca elaborada diariamente en la cafetería Kinal.'}
          </Text>

          {/* Selector de Acompañamientos */}
          {currentProduct.allowAccompaniments && accompaniments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Acompañamiento Opcional</Text>
              {accompaniments.map((acomp) => {
                const isSelected = selectedAccompaniment?._id === acomp._id;
                return (
                  <TouchableOpacity
                    key={acomp._id}
                    style={[styles.acompOption, isSelected && styles.acompSelected]}
                    onPress={() =>
                      setSelectedAccompaniment(isSelected ? null : acomp)
                    }
                  >
                    <View style={styles.acompLeft}>
                      <MaterialIcons
                        name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                        size={20}
                        color={isSelected ? COLORS.secondary : COLORS.textLight}
                      />
                      <Text style={styles.acompName}>{acomp.name}</Text>
                    </View>
                    <Text style={styles.acompPrice}>
                      +{acomp.price > 0 ? `Q${acomp.price.toFixed(2)}` : 'Gratis'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Control de Cantidad (Solo para Usuarios Normales) */}
          {!isAdmin ? (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Cantidad</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <MaterialIcons name="remove" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.counterText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <MaterialIcons name="add" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.adminNoticeBox}>
              <MaterialIcons name="admin-panel-settings" size={24} color={COLORS.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.adminNoticeTitle}>PANEL DE GESTIÓN ADMINISTRADOR</Text>
                <Text style={styles.adminNoticeSubtitle}>
                  Como Administrador de la cafetería, puedes editar los detalles de este platillo o removerlo del catálogo.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer Fijo */}
      {!isAdmin ? (
        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.totalPrice}>Q{totalPrice.toFixed(2)}</Text>
          </View>
          <Button
            title="Agregar al Carrito"
            icon={<MaterialIcons name="add-shopping-cart" size={20} color={COLORS.primary} />}
            onPress={handleAddToCart}
            style={styles.addCartBtn}
          />
        </View>
      ) : (
        <View style={styles.adminFooterRow}>
          <Button
            title="Editar Platillo"
            icon={<MaterialIcons name="edit" size={18} color={COLORS.primary} />}
            onPress={() => setIsEditModalOpen(true)}
            style={{ flex: 1, backgroundColor: COLORS.secondary }}
          />
          <TouchableOpacity
            style={styles.adminDeleteBtnFooter}
            onPress={handleDeleteProductPrompt}
          >
            <MaterialIcons name="delete" size={22} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para Editar Platillo */}
      <AdminProductModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProductSubmit}
        initialData={currentProduct}
        loading={modalLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  notFoundText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  imageHeader: {
    height: 240,
    width: '100%',
    backgroundColor: COLORS.surfaceVariant,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  content: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    color: COLORS.primary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  price: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.secondary,
    marginVertical: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  acompOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  acompSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: '#fff7ed',
  },
  acompLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  acompName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  acompPrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  quantitySection: {
    marginTop: SPACING.lg,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
    color: COLORS.primary,
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
  },
  totalLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  totalPrice: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    color: COLORS.primary,
  },
  addCartBtn: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  adminNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: '#fff7ed',
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    marginTop: SPACING.lg,
  },
  adminNoticeTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  adminNoticeSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    lineHeight: 16,
    marginTop: 2,
  },
  adminFooterBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    elevation: 10,
  },
  adminFooterRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    elevation: 10,
  },
  adminDeleteBtnFooter: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.error,
  },
});


