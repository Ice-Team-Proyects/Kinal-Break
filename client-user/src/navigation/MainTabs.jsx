import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { MenuScreen } from '../features/menu/screens/MenuScreen.jsx';
import { ProductDetailScreen } from '../features/menu/screens/ProductDetailScreen.jsx';
import { CartScreen } from '../features/cart/screens/CartScreen.jsx';
import { OrdersHistoryScreen } from '../features/orders/screens/OrdersHistoryScreen.jsx';
import { OrderDetailScreen } from '../features/orders/screens/OrderDetailScreen.jsx';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen.jsx';
import { useCartStore } from '../shared/store/cartStore.js';
import { COLORS, FONT_SIZE } from '../shared/constants/theme.js';

const Tab = createBottomTabNavigator();
const MenuStackNav = createNativeStackNavigator();
const OrdersStackNav = createNativeStackNavigator();

function MenuStack() {
  return (
    <MenuStackNav.Navigator screenOptions={{ headerShown: false }}>
      <MenuStackNav.Screen name="MenuList" component={MenuScreen} />
      <MenuStackNav.Screen name="ProductDetail" component={ProductDetailScreen} />
    </MenuStackNav.Navigator>
  );
}

function OrdersStack() {
  return (
    <OrdersStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.surface,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <OrdersStackNav.Screen
        name="OrdersHistory"
        component={OrdersHistoryScreen}
        options={{ title: 'Historial de Pedidos' }}
      />
      <OrdersStackNav.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Detalle del Pedido' }}
      />
    </OrdersStackNav.Navigator>
  );
}

import { useAuthStore } from '../shared/store/authStore.js';

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN_ROLE';
  const cartItems = useCartStore((state) => state.cartItems);
  const cartBadgeCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 56 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 6,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="MenuTab"
        component={MenuStack}
        options={{
          tabBarLabel: isAdmin ? 'Catálogo' : 'Menú',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant-menu" size={size} color={color} />
          ),
        }}
      />

      {!isAdmin && (
        <Tab.Screen
          name="CartTab"
          component={CartScreen}
          options={{
            tabBarLabel: 'Carrito',
            tabBarBadge: cartBadgeCount > 0 ? cartBadgeCount : undefined,
            tabBarBadgeStyle: { backgroundColor: COLORS.secondary, color: COLORS.primary, fontWeight: 'bold' },
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="shopping-cart" size={size} color={color} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          tabBarLabel: isAdmin ? 'Pedidos' : 'Mis Pedidos',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={isAdmin ? 'assignment' : 'receipt-long'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          headerShown: true,
          headerTitle: isAdmin ? 'Perfil Administrador' : 'Mi Perfil',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.surface,
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={isAdmin ? 'admin-panel-settings' : 'person'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
