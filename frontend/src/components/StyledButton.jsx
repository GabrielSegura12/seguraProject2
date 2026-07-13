import React from 'react';
import { theme } from '../styles/themes';

const StyledButton = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  onClick,
  type = 'button',
  style = {},
  ...props 
}) => {
  const variants = {
    primary: {
      background: theme.colors.primary.gradient,
      color: theme.colors.text.white,
      border: 'none',
      hover: {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${theme.colors.primary.main}66`,
      }
    },
    secondary: {
      background: 'transparent',
      color: theme.colors.primary.main,
      border: `2px solid ${theme.colors.primary.main}`,
      hover: {
        background: theme.colors.primary.main,
        color: theme.colors.text.white,
      }
    },
    danger: {
      background: theme.colors.status.error,
      color: theme.colors.text.white,
      border: 'none',
      hover: {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${theme.colors.status.error}66`,
      }
    },
    success: {
      background: theme.colors.status.success,
      color: theme.colors.text.white,
      border: 'none',
      hover: {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${theme.colors.status.success}66`,
      }
    },
  };

  const variantStyle = variants[variant] || variants.primary;
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle = {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: `all ${theme.transitions.normal}`,
    width: fullWidth ? '100%' : 'auto',
    ...variantStyle,
    ...style,
  };

  const hoverStyle = isHovered ? variantStyle.hover || {} : {};

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...baseStyle,
        ...hoverStyle,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default StyledButton;