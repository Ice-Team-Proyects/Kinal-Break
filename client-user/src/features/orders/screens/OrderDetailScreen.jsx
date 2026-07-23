// src/features/orders/screens/OrderDetailScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, Badge } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

export function OrderDetailScreen({ route, navigation }) {
  const { order } = route.params || {};

  if (!order) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Detalles del pedido no disponibles.</Text>
      </View>
    );
  }

  const orderNum = order.numeroPedido || order._id;
  const items = order.items || order.productos || [];
  const statusStr = order.estado || 'Pendiente';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner PIN para Ventanilla */}
        <View style={styles.pinBanner}>
          <Text style={styles.pinLabel}>CÓDIGO DE RETIRO EN VENTANILLA</Text>
          <Text style={styles.pinValue}>{orderNum.substring(0, 8).toUpperCase()}</Text>
          <Text style={styles.pinInstruction}>Muestra este código al cajero para recibir tu pedido</Text>
        </View>

        <Card style={styles.detailCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Estado del Pedido</Text>
            <Badge label={statusStr} type={statusStr.toLowerCase() === 'pendiente' ? 'warning' : 'success'} />
          </View>
          <Text style={styles.dateText}>
            Fecha: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Reciente'}
          </Text>
        </Card>

        {/* Productos del Pedido */}
        <Card style={styles.detailCard}>
          <Text style={styles.cardTitle}>Ítems Ordenados</Text>
          {items.map((prod, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemMainInfo}>
                <Text style={styles.itemName}>
                  {prod.cantidad || prod.quantity || 1}x {prod.nombreProducto || prod.name || 'Producto'}
                </Text>
                {prod.nombreAcompanamiento && (
                  <Text style={styles.acompText}>+ {prod.nombreAcompanamiento}</Text>
                )}
              </View>
              <Text style={styles.itemPrice}>
                Q{(prod.subtotal || (prod.precioUnitario * prod.cantidad) || 0).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Cobrado</Text>
            <Text style={styles.totalValue}>
              Q{(order.totalCobrar || order.totalFinal || order.total || 0).toFixed(2)}
            </Text>
          </View>
        </Card>
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  notFoundText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
  },
  pinBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  pinLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  pinValue: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.surface,
    letterSpacing: 4,
    marginVertical: SPACING.xs,
  },
  pinInstruction: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.surface,
    opacity: 0.8,
    textAlign: 'center',
  },
  detailCard: {
    padding: SPACING.md,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  dateText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  itemMainInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  acompText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
  },
  itemPrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
    color: COLORS.secondary,
  },
});
