// src/features/orders/screens/OrdersHistoryScreen.jsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOrders } from '../hooks/useOrders.js';
import { Card, Badge, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

import { useAuthStore } from '../../../shared/store/authStore.js';

export function OrdersHistoryScreen({ navigation }) {
  const { orders, loading, refreshOrders, cancelOrder } = useOrders();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN_ROLE';

  const getStatusBadgeType = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('pendiente')) return 'warning';
    if (s.includes('preparacion') || s.includes('proceso')) return 'info';
    if (s.includes('listo') || s.includes('completado') || s.includes('entregado')) return 'success';
    if (s.includes('cancelado')) return 'danger';
    return 'info';
  };

  const handleCancelPrompt = (orderId, orderNum) => {
    Alert.alert(
      'Cancelar Pedido',
      `¿Estás seguro de que deseas cancelar el pedido #${orderNum.substring(0, 8)}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: async () => {
            const res = await cancelOrder(orderId);
            if (res.success) {
              Alert.alert('Cancelado', res.message);
            } else {
              Alert.alert('Error', res.error);
            }
          },
        },
      ]
    );
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner message={isAdmin ? "Cargando lista de pedidos de cafetería..." : "Cargando tus pedidos..."} />;
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title={isAdmin ? "Sin Pedidos en Cafetería" : "Sin Pedidos Realizados"}
          message={isAdmin ? "No hay pedidos registrados en el sistema actualmente." : "Aún no has ordenado comida en la cafetería. ¡Haz tu primer pedido!"}
          icon={<MaterialIcons name="receipt-long" size={70} color={COLORS.textLight} />}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{isAdmin ? 'Gestión de Pedidos Cafetería' : 'Mis Pedidos'}</Text>
        <Text style={styles.headerSubtitle}>
          {isAdmin ? `Monitoreo de ${orders.length} pedidos activos` : `${orders.length} pedidos registrados`}
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshOrders} colors={[COLORS.secondary]} />
        }
        renderItem={({ item }) => {
          const statusStr = item.estado || 'Pendiente';
          const orderNum = item.numeroPedido || item._id;
          const isCancelable = statusStr.toLowerCase() === 'pendiente';

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('OrderDetail', { order: item })}
            >
              <Card style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderNumber}>
                      Pedido #{orderNum.substring(0, 8)}
                    </Text>
                    <Text style={styles.orderDate}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString('es-GT', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : 'Reciente'}
                    </Text>
                  </View>
                  <Badge label={statusStr} type={getStatusBadgeType(statusStr)} />
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.itemCountText}>
                    {item.items?.length || item.productos?.length || 1} producto(s)
                  </Text>
                  <Text style={styles.totalText}>
                    Total: Q{(item.totalCobrar || item.totalFinal || item.total || 0).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <Text style={styles.viewDetailText}>Ver detalles →</Text>

                  {isCancelable && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancelPrompt(item._id, orderNum)}
                    >
                      <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
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
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  listContent: {
    padding: SPACING.md,
  },
  orderCard: {
    padding: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  orderNumber: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  orderDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  itemCountText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  totalText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  viewDetailText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  cancelBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    fontWeight: 'bold',
  },
});
