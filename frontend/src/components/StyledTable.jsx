import React from 'react';
import { theme } from '../styles/themes';

const StyledTable = ({ 
  data, 
  columns, 
  title,
  striped = true,
  hoverable = true,
  compact = false,
  ...props 
}) => {
  const getStatusColor = (value, type) => {
    if (type === 'confidence') {
      const num = parseFloat(value);
      if (num >= 80) return theme.colors.success.main;
      if (num >= 60) return theme.colors.status.warning;
      return theme.colors.status.error;
    }
    return theme.colors.text.primary;
  };

  return (
    <div style={{
      background: theme.colors.background.white,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.colors.shadow.main,
      overflow: 'hidden',
      border: `1px solid ${theme.colors.border.light}`,
    }}>
      {title && (
        <div style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.border.light}`,
          background: theme.colors.background.white,
        }}>
          <h3 style={{
            color: theme.colors.text.primary,
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.semibold,
            margin: 0,
          }}>
            {title}
          </h3>
        </div>
      )}
      
      <div style={{
        overflowX: 'auto',
        padding: theme.spacing.md,
        background: theme.colors.background.white,
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0',
          fontSize: compact ? theme.typography.sizes.sm : theme.typography.sizes.base,
          background: theme.colors.background.white,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          boxShadow: theme.colors.shadow.light,
        }}>
          <thead>
            <tr style={{
              background: theme.colors.primary.main,
              color: theme.colors.text.white,
            }}>
              {columns.map((col, index) => (
                <th
                  key={index}
                  style={{
                    padding: compact ? theme.spacing.sm : theme.spacing.md,
                    textAlign: col.align || 'left',
                    borderBottom: `2px solid ${theme.colors.primary.dark}`,
                    color: theme.colors.text.white,
                    fontWeight: theme.typography.weights.semibold,
                    fontSize: compact ? theme.typography.sizes.xs : theme.typography.sizes.sm,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    ...col.headerStyle,
                  }}
                >
                  {col.label || col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: theme.spacing['3xl'],
                    textAlign: 'center',
                    color: theme.colors.text.light,
                    background: theme.colors.background.white,
                  }}
                >
                  No hay datos para mostrar
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    background: striped && rowIndex % 2 === 0 
                      ? theme.colors.background.secondary 
                      : theme.colors.background.white,
                    transition: `background ${theme.transitions.fast}`,
                    cursor: hoverable ? 'pointer' : 'default',
                  }}
                  onMouseEnter={(e) => {
                    if (hoverable) {
                      e.currentTarget.style.background = theme.colors.gray[100];
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (hoverable) {
                      e.currentTarget.style.background = striped && rowIndex % 2 === 0 
                        ? theme.colors.background.secondary 
                        : theme.colors.background.white;
                    }
                  }}
                >
                  {columns.map((col, colIndex) => {
                    const value = row[col.key || col];
                    const isConfidence = col.type === 'confidence';
                    const isHighlight = col.type === 'highlight';
                    
                    return (
                      <td
                        key={colIndex}
                        style={{
                          padding: compact ? theme.spacing.sm : theme.spacing.md,
                          textAlign: col.align || 'left',
                          borderBottom: `1px solid ${theme.colors.border.light}`,
                          color: isHighlight 
                            ? theme.colors.primary.main 
                            : theme.colors.text.primary,
                          fontWeight: isHighlight 
                            ? theme.typography.weights.semibold 
                            : theme.typography.weights.normal,
                          fontSize: compact ? theme.typography.sizes.xs : theme.typography.sizes.sm,
                          background: 'transparent',
                          ...col.cellStyle,
                        }}
                      >
                        {col.render ? col.render(value, row) : (
                          isConfidence ? (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: theme.spacing.sm,
                            }}>
                              <div style={{
                                flex: 1,
                                height: '8px',
                                background: theme.colors.gray[200],
                                borderRadius: theme.borderRadius.full,
                                overflow: 'hidden',
                                minWidth: '60px',
                              }}>
                                <div style={{
                                  width: `${value}%`,
                                  height: '100%',
                                  background: getStatusColor(value, 'confidence'),
                                  transition: `width 1s ${theme.transitions.slow}`,
                                  borderRadius: theme.borderRadius.full,
                                }} />
                              </div>
                              <span style={{
                                fontWeight: theme.typography.weights.semibold,
                                color: getStatusColor(value, 'confidence'),
                                minWidth: '40px',
                                textAlign: 'right',
                              }}>
                                {value}%
                              </span>
                            </div>
                          ) : (
                            value || '-'
                          )
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{
        padding: theme.spacing.md,
        borderTop: `1px solid ${theme.colors.border.light}`,
        background: theme.colors.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.text.light,
      }}>
        <span>
          Total de registros: <strong style={{ color: theme.colors.text.primary }}>
            {data.length}
          </strong>
        </span>
        <span>
          Ultima actualizacion: <strong style={{ color: theme.colors.text.primary }}>
            {new Date().toLocaleString()}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default StyledTable;