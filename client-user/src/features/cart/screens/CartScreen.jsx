// src/features/cart/screens/CartScreen.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCartStore } from '../../../shared/store/cartStore.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { menuClient } from '../../../shared/api/menuClient.js';
import { Button } from '../../../shared/components/common/Button.jsx';
import { EmptyState, Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  const totalAmount = getTotal();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!user?.id) {
      Alert.alert('Sesión Requerida', 'Por favor inicia sesión para realizar tu pedido.', [
        { text: 'Ir al Login', onPress: () => useAuthStore.getState().logout() },
      ]);
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        usuarioId: user.id,
        items: cartItems.map((item) => ({
          productoId: item.product._id,
          nombreProducto: item.product.name,
          cantidad: item.quantity,
          precioUnitario: item.unitPrice,
          subtotal: item.unitPrice * item.quantity,
          acompanamientoId: item.accompaniment?._id || null,
        })),
        total: totalAmount,
        metodoPago: paymentMethod,
      };

      const response = await menuClient.post('/orders', orderPayload);
      const { success, data, msg } = response.data || {};

      if (success || data) {
        const orderNum = data?.numeroPedido || 'N/A';
        clearCart();
        Alert.alert(
          '¡Pedido Realizado!',
          `Tu pedido #${orderNum.substring(0, 8)} ha sido enviado a la cafetería. Presenta tu nombre en ventanilla para recogerlo.`,
          [
            {
              text: 'Ver Mis Pedidos',
              onPress: () => navigation.navigate('OrdersTab'),
            },
          ]
        );
      } else {
        Alert.alert('Error', msg || 'No se pudo registrar el pedido.');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        'Error de conexión al procesar el pedido';
      Alert.alert('Error', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Tu Carrito está Vacío"
          message="Explora nuestro menú y agrega tus desayunos o almuerzos favoritos."
          icon={<MaterialIcons name="remove-shopping-cart" size={70} color={COLORS.textLight} />}
        />
        <View style={styles.emptyButtonWrapper}>
          <Button
            title="Explorar Menú"
            onPress={() => navigation.navigate('MenuTab')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Carrito</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearCartText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.itemCard}>
            <View style={styles.itemMain}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                {item.accompaniment && (
                  <Text style={styles.acompText}>
                    + {item.accompaniment.name} (Q{item.accompaniment.price?.toFixed(2)})
                  </Text>
                )}
                <Text style={styles.itemUnitPrice}>
                  Q{item.unitPrice.toFixed(2)} c/u
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => removeFromCart(item.id)}
                style={styles.deleteBtn}
              >
                <MaterialIcons name="delete-outline" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>

            <View style={styles.itemFooter}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <MaterialIcons name="remove" size={16} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <MaterialIcons name="add" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.itemSubtotal}>
                Q{(item.unitPrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          </Card>
        )}
      />

      {/* Método de Pago */}
      <View style={styles.paymentSection}>
        <Text style={styles.paymentTitle}>Forma de Pago en Ventanilla</Text>
        <View style={styles.paymentRow}>
          {['Efectivo', 'Tarjeta'].map((method) => {
            const isSelected = paymentMethod === method;
            return (
              <TouchableOpacity
                key={method}
                style={[styles.paymentChip, isSelected && styles.paymentChipSelected]}
                onPress={() => setPaymentMethod(method)}
              >
                <MaterialIcons
                  name={method === 'Efectivo' ? 'payments' : 'credit-card'}
                  size={20}
                  color={isSelected ? COLORS.secondary : COLORS.textLight}
                />
                <Text style={[styles.paymentText, isSelected && styles.paymentTextSelected]}>
                  {method}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Footer Fijo con Checkout */}
      <View style={styles.checkoutFooter}>
        <View>
          <Text style={styles.totalLabel}>Total del Pedido</Text>
          <Text style={styles.totalValue}>Q{totalAmount.toFixed(2)}</Text>
        </View>
        <Button
          title="Confirmar Pedido"
          loading={submitting}
          onPress={handleCheckout}
          style={styles.checkoutBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyButtonWrapper: {
    paddingHorizontal: SPACING.xl,
    marginTop: -SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
    color: COLORS.primary,
  },
  clearCartText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    fontWeight: 'bold',
  },
  listContent: {
    padding: SPACING.md,
  },
  itemCard: {
    padding: SPACING.md,
  },
  itemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  acompText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  itemUnitPrice: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    minWidth: 20,
    textAlign: 'center',
  },
  itemSubtotal: {
    fontSize: FONT_SIZE.md,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  paymentSection: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  paymentTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  paymentChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 6,
  },
  paymentChipSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: '#fff7ed',
  },
  paymentText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  paymentTextSelected: {
    color: COLORS.primary,
  },
  checkoutFooter: {
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
  totalValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    color: COLORS.primary,
  },
  checkoutBtn: {
    flex: 1,
    marginLeft: SPACING.md,
  },
});
