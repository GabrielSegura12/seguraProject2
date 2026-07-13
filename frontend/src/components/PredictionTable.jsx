import React, { useState, useEffect } from 'react';
import StyledTable from './StyledTable';
import { theme } from '../styles/themes';
import StyledButton from './StyledButton';

const PredictionTable = ({ predictionData, onExport }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (predictionData) {
      setFilteredData(Object.entries(predictionData).map(([code, data]) => ({
        code,
        ...data
      })));
    }
  }, [predictionData]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      
      if (typeof aVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      return direction === 'asc' 
        ? (aVal || 0) - (bVal || 0) 
        : (bVal || 0) - (aVal || 0);
    });
    
    setFilteredData(sorted);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const originalData = Object.entries(predictionData).map(([code, data]) => ({
      code,
      ...data
    }));
    
    const filtered = originalData.filter(item => 
      item.code.toLowerCase().includes(term) ||
      (item.productName && item.productName.toLowerCase().includes(term))
    );
    
    setFilteredData(filtered);
  };

  const columns = [
    {
      key: 'code',
      label: 'Codigo Producto',
      type: 'highlight',
      align: 'left',
      headerStyle: { color: theme.colors.gray[300] },
    },
    {
      key: 'productName',
      label: 'Producto',
      align: 'left',
      headerStyle: { color: theme.colors.gray[300] },
    },
    {
      key: 'historicalAverage',
      label: 'Promedio Historico',
      align: 'right',
      headerStyle: { color: theme.colors.gray[300] },
    },
    {
      key: 'nextYearPrediction',
      label: 'Prediccion Siguiente Ano',
      type: 'highlight',
      align: 'right',
      headerStyle: { color: theme.colors.gray[300] },
    },
    {
      key: 'confidence',
      label: 'Confianza',
      type: 'confidence',
      align: 'center',
      headerStyle: { color: theme.colors.gray[300] },
    },
    {
      key: 'trend',
      label: 'Tendencia',
      align: 'center',
      headerStyle: { color: theme.colors.gray[300] },
      render: (value) => {
        if (value === 'up') return 'Alza';
        if (value === 'down') return 'Baja';
        return 'Estable';
      }
    },
  ];

  if (!predictionData || Object.keys(predictionData).length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: theme.spacing['3xl'],
        color: theme.colors.text.light,
      }}>
        <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}></div>
        <p>No hay datos de prediccion disponibles</p>
        <p style={{ fontSize: theme.typography.sizes.sm }}>
          Importa un archivo para generar predicciones
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        flexWrap: 'wrap',
        gap: theme.spacing.md,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
        }}>
          <h2 style={{
            color: theme.colors.text.primary,
            margin: 0,
            fontSize: theme.typography.sizes['2xl'],
          }}>
            Resultados de Prediccion
          </h2>
          <span style={{
            background: theme.colors.primary.main,
            color: theme.colors.text.white,
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.full,
            fontSize: theme.typography.sizes.xs,
            fontWeight: theme.typography.weights.bold,
          }}>
            {Object.keys(predictionData).length} productos
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
          flexWrap: 'wrap',
        }}>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              border: `2px solid ${theme.colors.border.light}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.sizes.sm,
              outline: 'none',
              transition: `all ${theme.transitions.normal}`,
              background: theme.colors.background.primary,
              color: theme.colors.text.primary,
              minWidth: '200px',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary.main;
              e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary.main}25`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border.light;
              e.target.style.boxShadow = 'none';
            }}
          />
          
          {onExport && (
            <StyledButton
              variant="primary"
              onClick={onExport}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                fontSize: theme.typography.sizes.sm,
              }}
            >
              Exportar CSV
            </StyledButton>
          )}
        </div>
      </div>

      <StyledTable
        data={filteredData}
        columns={columns}
        compact={false}
        striped={true}
        hoverable={true}
      />

      <div style={{
        marginTop: theme.spacing.md,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        background: theme.colors.background.primary,
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.border.light}`,
      }}>
        <div>
          <div style={{ color: theme.colors.text.light, fontSize: theme.typography.sizes.xs }}>
            Confianza Alta
          </div>
          <div style={{ color: theme.colors.success.main, fontWeight: theme.typography.weights.bold }}>
            ≥ 80%
          </div>
        </div>
        <div>
          <div style={{ color: theme.colors.text.light, fontSize: theme.typography.sizes.xs }}>
            Confianza Media
          </div>
          <div style={{ color: theme.colors.status.warning, fontWeight: theme.typography.weights.bold }}>
            60% - 79%
          </div>
        </div>
        <div>
          <div style={{ color: theme.colors.text.light, fontSize: theme.typography.sizes.xs }}>
            Confianza Baja
          </div>
          <div style={{ color: theme.colors.status.error, fontWeight: theme.typography.weights.bold }}>
            &lt; 60%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionTable;