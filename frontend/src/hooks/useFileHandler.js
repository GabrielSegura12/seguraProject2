import { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export const useFileHandler = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError(null);
    setColumns([]);
    setData([]);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

        let parsedData = [];
        let headers = [];

        if (fileExtension === 'csv') {
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

        // Validar columnas requeridas
        const requiredColumns = ['codigo_producto', 'fecha_venta', 'cantidad'];
        const missingColumns = requiredColumns.filter(col => 
          !headers.map(h => h.toLowerCase()).includes(col.toLowerCase())
        );

        if (missingColumns.length > 0) {
          setError(`Columnas faltantes: ${missingColumns.join(', ')}. Debe tener: codigo_producto, fecha_venta, cantidad`);
          return;
        }

        setColumns(headers);
        setData(parsedData);

        console.log('Columnas encontradas:', headers);
        console.log('Total de filas:', parsedData.length);
        console.log('Datos de ejemplo:', parsedData.slice(0, 3));
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

  return {
    file,
    fileName,
    columns,
    data,
    error,
    setError,
    handleFileUpload,
  };
};