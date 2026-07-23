import { Platform } from 'react-native';

const formatUrl = (url) => {
  if (!url) return '';
  if (Platform.OS === 'android') {
    return url.replace(/localhost|127\.0\.0\.1/g, '10.0.2.2');
  }
  return url;
};

const DEFAULT_AUTH_URL = 'http://localhost:5296/api/v1';
const DEFAULT_API_URL = 'http://localhost:3021/KinalBreak/v1';
const DEFAULT_PEDIDOS_URL = 'http://localhost:3021/KinalBreak/v1/orders';

const rawAuth = process.env.EXPO_PUBLIC_AUTH_URL || DEFAULT_AUTH_URL;
const rawApi = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;
const rawPedidos = process.env.EXPO_PUBLIC_PEDIDOS_URL || DEFAULT_PEDIDOS_URL;

export const ENDPOINTS = {
  AUTH: formatUrl(rawAuth),
  API: formatUrl(rawApi),
  PEDIDOS: formatUrl(rawPedidos),
};

