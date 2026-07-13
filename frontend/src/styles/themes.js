export const theme = {
  colors: {
    // Colores primarios - escala de grises con alto contraste
    primary: {
      light: '#f0f0f0',
      main: '#d4d4d4',
      dark: '#6b6b6b',
      gradient: 'linear-gradient(135deg, #4b4b4b 0%, #1a1a1a 100%)',
    },
    // Colores secundarios - grises más oscuros para contraste
    secondary: {
      light: '#8a8a8a',
      main: '#4b4b4b',
      dark: '#1a1a1a',
    },
    // Colores de fondo - extremos claros y oscuros
    background: {
      primary: '#f5f5f5',
      secondary: '#ffffff',
      dark: '#0d0d0d',
      white: '#fff'
    },
    // Colores de texto - contraste máximo
    text: {
      primary: '#000000',      // Negro puro para máximo contraste
      secondary: '#2b2b2b',    // Casi negro
      light: '#666666',        // Gris medio
      white: '#ffffff',
    },
    // Colores de estado - colores vibrantes para destacar
    status: {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
    // Colores de borde - contrastes marcados
    border: {
      light: '#d1d1d1',
      main: '#8a8a8a',
      dark: '#4b4b4b',
    },
    // Colores de sombra - sombras más pronunciadas
    shadow: {
      light: '0 2px 4px rgba(0,0,0,0.1)',
      main: '0 4px 24px rgba(0,0,0,0.15)',
      dark: '0 8px 32px rgba(0,0,0,0.25)',
    },
    // Colores de hover - visibles y distinguibles
    hover: {
      primary: 'rgba(0, 0, 0, 0.08)',
      secondary: 'rgba(0, 0, 0, 0.15)',
    },
    // Colores de overlay - más opacos para mejor contraste
    overlay: {
      light: 'rgba(255,255,255,0.15)',
      medium: 'rgba(0,0,0,0.08)',
      dark: 'rgba(0,0,0,0.15)',
    },
    // Colores de error - contrastes claros
    error: {
      light: '#fee2e2',
      main: '#dc2626',
      dark: '#991b1b',
      background: 'rgba(220, 38, 38, 0.1)',
      border: 'rgba(220, 38, 38, 0.3)',
    },
    // Colores de éxito - contrastes claros
    success: {
      light: '#dcfce7',
      main: '#16a34a',
      dark: '#14532d',
      background: 'rgba(22, 163, 74, 0.1)',
      border: 'rgba(22, 163, 74, 0.3)',
    },
    // Colores de warning - contrastes claros
    warning: {
      light: '#fef3c7',
      main: '#d97706',
      dark: '#92400e',
      background: 'rgba(217, 119, 6, 0.1)',
      border: 'rgba(217, 119, 6, 0.3)',
    },
    // Escala completa de grises para mayor control
    gray: {
      50: '#fafafa',
      100: '#f0f0f0',
      200: '#e0e0e0',
      300: '#c4c4c4',
      400: '#9a9a9a',
      500: '#6b6b6b',
      600: '#4b4b4b',
      700: '#333333',
      800: '#1a1a1a',
      900: '#0d0d0d',
    },
  },
  // Tipografía
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  // Espaciado
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  // Bordes
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  // Transiciones
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export default theme;