import React, { useState } from 'react';
import { theme } from '../styles/themes';

const StyledInput = ({ 
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: theme.spacing.sm,
    border: `2px solid ${isFocused ? theme.colors.primary.main : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.sizes.base,
    transition: `all ${theme.transitions.normal}`,
    outline: 'none',
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.primary,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
  };

  const errorStyle = {
    color: theme.colors.status.error,
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.xs,
  };

  return (
    <div style={{ marginBottom: theme.spacing.md }}>
      {label && (
        <label htmlFor={props.id} style={labelStyle}>
          {label} {required && <span style={{ color: theme.colors.status.error }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          ...inputStyle,
          borderColor: error ? theme.colors.status.error : inputStyle.borderColor,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
};

export default StyledInput;