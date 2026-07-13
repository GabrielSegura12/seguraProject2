import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/themes';
import StyledButton from '../components/StyledButton';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const ImportData = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState({});

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError(null);
    setColumns([]);
    setData([]);
    setSelectedColumns({});

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        
        let parsedData = [];
        let headers = [];

        if (fileExtension === 'csv') {
          // Leer CSV
          const csvText = event.target.result;
          const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            trimHeaders: true,
          });
          
          if (result.errors.length > 0) {
            setError('Error al leer el archivo CSV. Verifica el formato.');
            return;
          }
          
          headers = result.meta.fields || [];
          parsedData = result.data;
          
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          // Leer Excel
          const workbook = XLSX.read(event.target.result, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
          
          if (jsonData.length > 0) {
            headers = Object.keys(jsonData[0]);
            parsedData = jsonData;
          }
        } else {
          setError('Formato no soportado. Usa archivos CSV o Excel (.xlsx, .xls)');
          return;
        }

        if (headers.length === 0) {
          setError('No se encontraron columnas en el archivo.');
          return;
        }

        setColumns(headers);
        setData(parsedData);
        
        // Inicializar selección de columnas
        const initialSelection = {};
        headers.forEach(header => {
          initialSelection[header] = false;
        });
        setSelectedColumns(initialSelection);

        console.log('📊 Columnas encontradas:', headers);
        console.log('📈 Total de filas:', parsedData.length);
        console.log('📝 Datos de ejemplo:', parsedData.slice(0, 3));

      } catch (err) {
        console.error('Error al procesar el archivo:', err);
        setError('Error al procesar el archivo. Verifica que sea un archivo válido.');
      }
    };

    if (selectedFile.name.endsWith('.csv')) {
      reader.readAsText(selectedFile);
    } else {
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedColumns).every(val => val === true);
    const newSelection = {};
    columns.forEach(col => {
      newSelection[col] = !allSelected;
    });
    setSelectedColumns(newSelection);
  };

  const handleProcessData = () => {
    const selected = Object.keys(selectedColumns).filter(key => selectedColumns[key]);
    
    if (selected.length === 0) {
      setError('Selecciona al menos una columna para procesar.');
      return;
    }

    // Filtrar datos con las columnas seleccionadas
    const processedData = data.map(row => {
      const newRow = {};
      selected.forEach(col => {
        newRow[col] = row[col] || '';
      });
      return newRow;
    });

    console.log('📋 Columnas seleccionadas:', selected);
    console.log('📊 Datos procesados:', processedData);
    console.log('📈 Total de registros:', processedData.length);
    
    // Mostrar resumen en consola
    console.log('📝 Resumen del archivo:');
    console.log(`- Archivo: ${fileName}`);
    console.log(`- Columnas totales: ${columns.length}`);
    console.log(`- Columnas seleccionadas: ${selected.length}`);
    console.log(`- Filas procesadas: ${processedData.length}`);
    
    // Mostrar primeros 3 registros
    console.log('📄 Primeros 3 registros:');
    processedData.slice(0, 3).forEach((row, index) => {
      console.log(`  Registro ${index + 1}:`, row);
    });

    alert(`✅ Procesamiento completado!\n\n` +
          `Archivo: ${fileName}\n` +
          `Columnas totales: ${columns.length}\n` +
          `Columnas seleccionadas: ${selected.length}\n` +
          `Filas procesadas: ${processedData.length}\n\n` +
          `📊 Revisa la consola para ver los detalles.`);
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
    }}>
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
          fontSize: theme.typography.sizes['2xl'] 
        }}>
          Mi App
        </h2>
        <div style={{
          padding: theme.spacing.md,
          background: theme.colors.overlay.light,
          borderRadius: theme.borderRadius.lg,
          marginBottom: theme.spacing.xl,
        }}>
          <div style={{ 
            fontWeight: theme.typography.weights.semibold, 
            fontSize: theme.typography.sizes.lg 
          }}>
            {user.full_name || user.username}
          </div>
          <div style={{ 
            opacity: 0.8, 
            fontSize: theme.typography.sizes.sm 
          }}>
            {user.email}
          </div>
        </div>
        <StyledButton
          variant="secondary"
          fullWidth
          onClick={() => window.location.href = '/'}
          style={{
            background: theme.colors.overlay.medium,
            border: `2px solid ${theme.colors.overlay.dark}`,
            color: theme.colors.text.white,
          }}
        >
          Volver al Dashboard
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
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <h1 style={{
            fontSize: theme.typography.sizes['3xl'],
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
          }}>
            📤 Importar Datos
          </h1>
          <p style={{
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.xl,
          }}>
            Sube un archivo CSV o Excel para importar tus datos.
          </p>

          {/* Área de carga */}
          <div style={{
            background: theme.colors.background.secondary,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.xl,
            boxShadow: theme.colors.shadow.main,
            marginBottom: theme.spacing.xl,
          }}>
            <div style={{
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
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📁</div>
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
                style={{
                  display: 'none',
                }}
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
                  ✅ {fileName} cargado correctamente
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

          {/* Columnas */}
          {columns.length > 0 && (
            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.colors.shadow.main,
              marginBottom: theme.spacing.xl,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing.md,
              }}>
                <h3 style={{
                  color: theme.colors.text.primary,
                }}>
                  📋 Columnas encontradas ({columns.length})
                </h3>
                <StyledButton
                  variant="secondary"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {Object.values(selectedColumns).every(val => val === true) 
                    ? 'Deseleccionar todas' 
                    : 'Seleccionar todas'}
                </StyledButton>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: theme.spacing.sm,
                maxHeight: '300px',
                overflowY: 'auto',
                padding: theme.spacing.sm,
              }}>
                {columns.map((col, index) => (
                  <label
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: theme.spacing.sm,
                      background: selectedColumns[col] 
                        ? theme.colors.hover.primary 
                        : 'transparent',
                      borderRadius: theme.borderRadius.sm,
                      cursor: 'pointer',
                      transition: `all ${theme.transitions.fast}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns[col] || false}
                      onChange={() => handleColumnToggle(col)}
                      style={{
                        marginRight: theme.spacing.sm,
                        accentColor: theme.colors.primary.main,
                      }}
                    />
                    <span style={{
                      color: theme.colors.text.primary,
                      fontSize: theme.typography.sizes.sm,
                    }}>
                      {col}
                    </span>
                  </label>
                ))}
              </div>

              <div style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.md,
                background: theme.colors.background.primary,
                borderRadius: theme.borderRadius.md,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.sizes.sm,
                }}>
                  {data.length} filas encontradas
                </span>
                <span style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.sizes.sm,
                }}>
                  {Object.values(selectedColumns).filter(v => v).length} columnas seleccionadas
                </span>
              </div>

              <StyledButton
                variant="primary"
                fullWidth
                onClick={handleProcessData}
                style={{ marginTop: theme.spacing.md }}
              >
                🚀 Procesar Datos
              </StyledButton>
            </div>
          )}

          {/* Preview de datos */}
          {data.length > 0 && (
            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.colors.shadow.main,
            }}>
              <h3 style={{
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md,
              }}>
                👁️ Vista previa
              </h3>
              <div style={{
                overflowX: 'auto',
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: theme.typography.sizes.sm,
                }}>
                  <thead style={{
                    position: 'sticky',
                    top: 0,
                    background: theme.colors.background.secondary,
                    zIndex: 1,
                  }}>
                    <tr>
                      {columns.filter(col => selectedColumns[col]).map((col, index) => (
                        <th
                          key={index}
                          style={{
                            padding: theme.spacing.sm,
                            textAlign: 'left',
                            borderBottom: `2px solid ${theme.colors.border.main}`,
                            color: theme.colors.text.primary,
                            fontWeight: theme.typography.weights.semibold,
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {columns.filter(col => selectedColumns[col]).map((col, colIndex) => (
                          <td
                            key={colIndex}
                            style={{
                              padding: theme.spacing.sm,
                              borderBottom: `1px solid ${theme.colors.border.light}`,
                              color: theme.colors.text.secondary,
                            }}
                          >
                            {row[col] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{
                marginTop: theme.spacing.sm,
                color: theme.colors.text.light,
                fontSize: theme.typography.sizes.xs,
                textAlign: 'center',
              }}>
                Mostrando 5 de {data.length} filas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportData;
