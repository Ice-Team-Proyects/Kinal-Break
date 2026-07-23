// src/features/menu/screens/MenuScreen.jsx

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useMenu } from '../hooks/useMenu.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Card, LoadingSpinner, EmptyState, Badge } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { AdminProductModal } from '../components/AdminProductModal.jsx';

const CATEGORIES = [
  { id: '', label: 'Todos', icon: 'restaurant-menu' },
  { id: 'desayunos', label: 'Desayunos', icon: 'free-breakfast' },
  { id: 'almuerzos', label: 'Almuerzos', icon: 'lunch-dining' },
  { id: 'bebidas', label: 'Bebidas', icon: 'local-drink' },
  { id: 'snacks', label: 'Snacks', icon: 'fastfood' },
];

export function MenuScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { products, loading, refreshMenu, createProduct, updateProduct, deleteProduct } = useMenu();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN_ROLE';

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados del Modal Admin
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = !selectedCategory || item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && !item.isDeleted && item.isActive !== false;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProductPrompt = (product) => {
    Alert.alert(
      'Eliminar Platillo',
      `¿Estás seguro de que deseas eliminar "${product.name}" del menú?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteProduct(product._id);
            if (res.success) {
              Alert.alert('Éxito', 'El platillo ha sido eliminado.');
            } else {
              Alert.alert('Error', res.error);
            }
          },
        },
      ]
    );
  };

  const handleSaveProduct = async (formData) => {
    setModalLoading(true);
    let res;
    if (editingProduct) {
      res = await updateProduct(editingProduct._id, formData);
    } else {
      res = await createProduct(formData);
    }
    setModalLoading(false);

    if (res.success) {
      setIsModalOpen(false);
      Alert.alert(
        '¡Guardado!',
        editingProduct ? 'Platillo actualizado correctamente.' : 'Nuevo platillo agregado al menú.'
      );
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Card style={styles.productCard}>
        <View style={styles.imageContainer}>
          {item.photo ? (
            <Image source={{ uri: item.photo }} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialIcons name="fastfood" size={40} color={COLORS.secondary} />
            </View>
          )}
          <View style={styles.categoryBadgePosition}>
            <Badge
              label={(item.category || 'General').toUpperCase()}
              type="info"
              style={styles.categoryBadge}
            />
          </View>
        </View>

        <View style={styles.productInfo}>
          <View style={styles.productHeaderRow}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            {isAdmin && (
              <Badge label="ADMIN" type="danger" style={{ marginLeft: 4 }} />
            )}
          </View>

          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description || 'Delicioso platillo preparado en la cafetería Kinal.'}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.productPrice}>Q{(item.price || 0).toFixed(2)}</Text>

            {/* Acciones de Botón: Para Usuario Normal (+) y para Admin (Editar ✏️ y Eliminar 🗑️) */}
            {isAdmin ? (
              <View style={styles.adminActionRow}>
                <TouchableOpacity
                  style={styles.adminEditBtn}
                  onPress={() => handleOpenEditModal(item)}
                >
                  <MaterialIcons name="edit" size={18} color={COLORS.surface} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminDeleteBtn}
                  onPress={() => handleDeleteProductPrompt(item)}
                >
                  <MaterialIcons name="delete" size={18} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.addButton}>
                <MaterialIcons name="add" size={22} color={COLORS.primary} />
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Banner adaptable a cualquier pantalla Android */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 16) + SPACING.xs }]}>
        <View style={styles.topHeaderLeft}>
          <View style={styles.titleRow}>
            <Text style={styles.greetingTitle}>CAFETERÍA KINAL</Text>
            {isAdmin && (
              <Badge label="ADMIN" type="warning" style={styles.adminRoleBadge} />
            )}
          </View>
          <Text style={styles.greetingSubtitle}>Servicio de 6:15 AM a 3:20 PM 🌅</Text>
        </View>

        {!isAdmin && (
          <TouchableOpacity
            style={styles.cartIconBadge}
            onPress={() => navigation.navigate('Cart')}
          >
            <MaterialIcons name="shopping-bag" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar desayunos, hamburguesas, bebidas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<MaterialIcons name="search" size={22} color={COLORS.primary} />}
          containerStyle={{ marginBottom: 0 }}
          style={styles.searchInputWrapper}
        />
      </View>

      {/* Selector de Categorías */}
      <View style={styles.categoryScroll}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(cat) => cat.id}
          renderItem={({ item: cat }) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                style={[styles.categoryChip, isActive && styles.activeChip]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <MaterialIcons
                  name={cat.icon}
                  size={18}
                  color={isActive ? COLORS.primary : COLORS.textLight}
                />
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: SPACING.xs }}
        />
      </View>

      {/* Contenido Principal */}
      {loading && products.length === 0 ? (
        <LoadingSpinner message="Cargando menú de hoy..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="Menú No Disponible"
          message="No encontramos productos que coincidan con tu búsqueda."
          icon={<MaterialIcons name="no-meals" size={60} color={COLORS.textLight} />}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProductItem}
          contentContainerStyle={[styles.listContent, { paddingBottom: isAdmin ? 80 : 24 }]}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshMenu} colors={[COLORS.secondary]} />
          }
        />
      )}

      {/* Botón Flotante de Acción (FAB) para Administrador */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.adminFabButton}
          onPress={handleOpenAddModal}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add" size={24} color={COLORS.primary} />
          <Text style={styles.adminFabText}>Nuevo Platillo</Text>
        </TouchableOpacity>
      )}

      {/* Modal de Administración para Crear / Editar Platillo */}
      <AdminProductModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
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
  topHeader: {
    backgroundColor: COLORS.primary,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
  },
  topHeaderLeft: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  adminRoleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  greetingSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  cartIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    borderWidth: 2,
    borderColor: '#000000',
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  searchInputWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoryScroll: {
    marginVertical: SPACING.sm,
    height: 44,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 6,
    height: 38,
  },
  activeChip: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  activeChipText: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  listContent: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  productCard: {
    flexDirection: 'row',
    padding: SPACING.sm,
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fff7ed',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff7ed',
  },
  categoryBadgePosition: {
    position: 'absolute',
    bottom: 4,
    left: 4,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  productInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
    height: 96,
  },
  productHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.primary,
    flex: 1,
  },
  productDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    lineHeight: 16,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  productPrice: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  adminAddBtnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  adminAddBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '900',
    color: COLORS.primary,
  },
  adminActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminEditBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  adminDeleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  adminFabButton: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    gap: 6,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  adminFabText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
});

