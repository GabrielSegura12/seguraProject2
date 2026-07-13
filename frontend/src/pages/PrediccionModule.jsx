import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/themes';
import StyledButton from '../components/StyledButton';
import StyledTable from '../components/StyledTable';
import { useFileHandler } from '../hooks/useFileHandler';
import { usePrediction } from '../hooks/usePrediction';
import { downloadTemplate, downloadResults } from '../utils/predictionUtils';

const PredictionModule = () => {
  const { user, logout } = useAuth();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear_regression');
  const [predictionResult, setPredictionResult] = useState(null);
  
  const {
    file,
    fileName,
    columns,
    data,
    error,
    setError,
    handleFileUpload
  } = useFileHandler();

  const {
    isAnalyzing,
    generatePredictions,
    algorithms
  } = usePrediction();

  const handlePrediction = async () => {
    if (data.length === 0) {
      setError('Por favor carga un archivo primero.');
      return;
    }

    const result = await generatePredictions(data, columns, selectedAlgorithm);
    setPredictionResult(result);
  };

  const getTableData = () => {
    if (!predictionResult) return [];
    return Object.values(predictionResult);
  };

  const tableColumns = [
    {
      key: 'code',
      label: 'Código Producto',
      type: 'highlight',
      align: 'left',
    },
    {
      key: 'productName',
      label: 'Producto',
      align: 'left',
    },
    {
      key: 'historicalAverage',
      label: 'Promedio Histórico',
      align: 'right',
    },
    {
      key: 'nextYearPrediction',
      label: 'Predicción Siguiente Año',
      type: 'highlight',
      align: 'right',
    },
    {
      key: 'confidence',
      label: 'Confianza',
      type: 'confidence',
      align: 'center',
    },
    {
      key: 'trend',
      label: 'Tendencia',
      align: 'center',
      render: (value) => {
        if (value === 'up') return 'Alza';
        if (value === 'down') return 'Baja';
        return 'Estable';
      }
    },
  ];

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: theme.colors.primary.gradient,
        color: theme.colors.text.white,
        padding: theme.spacing.xl,
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
      }}>
        <h2 style={{
          marginBottom: theme.spacing.xl,
          fontSize: theme.typography.sizes['2xl'],
        }}>
          Modelo de Predicción
        </h2>
        <div style={{
          padding: theme.spacing.md,
          background: theme.colors.overlay.light,
          borderRadius: theme.borderRadius.lg,
          marginBottom: theme.spacing.xl,
        }}>
          <div style={{
            fontWeight: theme.typography.weights.semibold,
            fontSize: theme.typography.sizes.lg,
          }}>
            {user.full_name || user.username}
          </div>
          <div style={{
            opacity: 0.8,
            fontSize: theme.typography.sizes.sm,
          }}>
            {user.email}
          </div>
        </div>
        <StyledButton
          variant="secondary"
          fullWidth
          onClick={() => logout()}
          style={{
            background: theme.colors.overlay.medium,
            border: `2px solid ${theme.colors.overlay.dark}`,
            color: theme.colors.text.white,
          }}
        >
          Cerrar Sesión
        </StyledButton>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: '280px',
        padding: theme.spacing.xl,
        background: theme.colors.background.primary,
        minHeight: '100vh',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: theme.typography.sizes['3xl'],
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
          }}>
            Módulo de Predicción
          </h1>

          {/* Drag and Drop Area */}
          <div style={{
            background: theme.colors.background.secondary,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.xl,
            boxShadow: theme.colors.shadow.main,
            marginBottom: theme.spacing.xl,
          }}>
            <div
              style={{
                border: `2px dashed ${theme.colors.border.main}`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing['3xl'],
                textAlign: 'center',
                transition: `all ${theme.transitions.normal}`,
                cursor: 'pointer',
                background: theme.colors.background.primary,
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = theme.colors.primary.main;
                e.currentTarget.style.background = theme.colors.hover.primary;
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border.main;
                e.currentTarget.style.background = theme.colors.background.primary;
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = theme.colors.border.main;
                e.currentTarget.style.background = theme.colors.background.primary;
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  const input = document.getElementById('fileInput');
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(droppedFile);
                  input.files = dataTransfer.files;
                  input.dispatchEvent(new Event('change'));
                }
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}></div>
              <h3 style={{
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
              }}>
                {fileName || 'Arrastra tu archivo aquí'}
              </h3>
              <p style={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.sizes.sm,
                marginBottom: theme.spacing.md,
              }}>
                o haz clic para seleccionar
              </p>
              <input
                id="fileInput"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <StyledButton
                variant="primary"
                onClick={() => document.getElementById('fileInput').click()}
              >
                Seleccionar Archivo
              </StyledButton>
              {fileName && (
                <div style={{
                  marginTop: theme.spacing.md,
                  color: theme.colors.success.main,
                  fontSize: theme.typography.sizes.sm,
                }}>
                  {fileName} cargado correctamente
                </div>
              )}
            </div>

            {error && (
              <div style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.md,
                background: theme.colors.error.background,
                color: theme.colors.error.main,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.error.border}`,
                fontSize: theme.typography.sizes.sm,
              }}>
                ❌ {error}
              </div>
            )}
          </div>

          {/* Algorithm Selection */}
          {data.length > 0 && (
            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.colors.shadow.main,
              marginBottom: theme.spacing.xl,
            }}>
              <h3 style={{
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.lg,
              }}>
                Selecciona un algoritmo de predicción
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: theme.spacing.md,
                marginBottom: theme.spacing.lg,
              }}>
                {algorithms.map((algo) => (
                  <div
                    key={algo.id}
                    onClick={() => setSelectedAlgorithm(algo.id)}
                    style={{
                      padding: theme.spacing.lg,
                      borderRadius: theme.borderRadius.lg,
                      border: `2px solid ${selectedAlgorithm === algo.id ? theme.colors.primary.main : theme.colors.border.main}`,
                      background: selectedAlgorithm === algo.id ? theme.colors.hover.primary : theme.colors.background.primary,
                      cursor: 'pointer',
                      transition: `all ${theme.transitions.normal}`,
                    }}
                  >
                    <div style={{
                      fontWeight: theme.typography.weights.semibold,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.sm,
                    }}>
                      {algo.name}
                    </div>
                    <p style={{
                      color: theme.colors.text.secondary,
                      fontSize: theme.typography.sizes.sm,
                      margin: 0,
                    }}>
                      {algo.description}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{
                padding: theme.spacing.md,
                background: theme.colors.background.primary,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.lg,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: theme.spacing.sm,
              }}>
                <span style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.sizes.sm,
                }}>
                  Datos cargados: <strong>{data.length}</strong> registros de ventas
                </span>
                <span style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.sizes.sm,
                }}>
                  Algoritmo: <strong>{algorithms.find(a => a.id === selectedAlgorithm)?.name}</strong>
                </span>
              </div>

              <StyledButton
                variant="primary"
                fullWidth
                onClick={handlePrediction}
                disabled={isAnalyzing}
                style={{ opacity: isAnalyzing ? 0.6 : 1 }}
              >
                {isAnalyzing ? 'Analizando...' : 'Realizar Predicción'}
              </StyledButton>
            </div>
          )}

          {/* Analyzing Animation */}
          {isAnalyzing && (
            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.colors.shadow.main,
              marginBottom: theme.spacing.xl,
              textAlign: 'center',
            }}>
              <div style={{
                display: 'inline-block',
                marginBottom: theme.spacing.lg,
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: `4px solid ${theme.colors.border.light}`,
                  borderTop: `4px solid ${theme.colors.primary.main}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
              </div>
              <h3 style={{
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
              }}>
                Analizando tus datos...
              </h3>
              <p style={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.sizes.sm,
              }}>
                Nuestra IA está procesando tus datos históricos de ventas para generar predicciones precisas.
              </p>
            </div>
          )}

          {/* Prediction Results */}
          {predictionResult && (
            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.colors.shadow.main,
              marginTop: theme.spacing.xl,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: theme.spacing.md,
                marginBottom: theme.spacing.lg,
              }}>
                <div>
                  <h3 style={{
                    color: theme.colors.text.primary,
                    margin: 0,
                  }}>
                    Resultados de Predicción
                  </h3>
                  <p style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.sizes.sm,
                    margin: 0,
                  }}>
                    Generado con: {algorithms.find(a => a.id === selectedAlgorithm)?.name}
                  </p>
                </div>
                <StyledButton
                  variant="primary"
                  onClick={() => downloadResults(predictionResult)}
                >
                  Descargar Excel
                </StyledButton>
              </div>

              <StyledTable
                data={getTableData()}
                columns={tableColumns}
                title="Predicciones de Ventas"
                striped={true}
                hoverable={true}
              />

              <div style={{
                marginTop: theme.spacing.lg,
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
                    🔴 Confianza Baja
                  </div>
                  <div style={{ color: theme.colors.status.error, fontWeight: theme.typography.weights.bold }}>
                    &lt; 60%
                  </div>
                </div>
                <div>
                  <div style={{ color: theme.colors.text.light, fontSize: theme.typography.sizes.xs }}>
                    🟡 Confianza Media
                  </div>
                  <div style={{ color: theme.colors.status.warning, fontWeight: theme.typography.weights.bold }}>
                    60% - 79%
                  </div>
                </div>
                <div>
                  <div style={{ color: theme.colors.text.light, fontSize: theme.typography.sizes.xs }}>
                    🟢 Confianza Alta
                  </div>
                  <div style={{ color: theme.colors.success.main, fontWeight: theme.typography.weights.bold }}>
                    ≥ 80%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PredictionModule;