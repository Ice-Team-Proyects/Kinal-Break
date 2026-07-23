// src/shared/constants/theme.js

export const COLORS = {
  primary: '#031633',       // Azul Marino Kinal Profundo
  primaryDark: '#010c1e',   // Sombra azul
  secondary: '#ff8928',     // Naranja Energético Kinal-Break
  secondaryDark: '#e67315',
  accent: '#38bdf8',        // Azul Neón / Destacados
  background: '#f8fafc',    // Fondo claro slate
  surface: '#ffffff',       // Tarjetas / Paneles blancos
  surfaceVariant: '#f1f5f9',
  text: '#0f172a',          // Texto principal
  textLight: '#64748b',     // Texto secundario / muted
  border: '#e2e8f0',        // Bordes suaves
  borderActive: '#ff8928',
  error: '#ef4444',         // Rojo errores
  success: '#10b981',       // Verde éxito
  warning: '#f59e0b',       // Amarillo advertencia
  disabled: '#cbd5e1',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: '#031633',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  medium: {
    shadowColor: '#031633',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  large: {
    shadowColor: '#031633',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 9,
  },
  glow: {
    shadowColor: '#ff8928',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
};
