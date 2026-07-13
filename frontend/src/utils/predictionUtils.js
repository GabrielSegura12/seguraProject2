import * as XLSX from 'xlsx';

export const downloadTemplate = () => {
  const templateData = [
    {
      'codigo_producto': 'PROD001',
      'fecha_venta': '2024-01-01',
      'cantidad': 10,
    },
    {
      'codigo_producto': 'PROD001',
      'fecha_venta': '2024-01-02',
      'cantidad': 15,
    },
    {
      'codigo_producto': 'PROD002',
      'fecha_venta': '2024-01-01',
      'cantidad': 20,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
  XLSX.writeFile(workbook, 'plantilla_prediccion_ventas.xlsx');
};

export const downloadResults = (predictionResult) => {
  if (!predictionResult) return;

  const resultData = Object.keys(predictionResult).map(productCode => ({
    'codigo_producto': productCode,
    'promedio_historico': predictionResult[productCode].historicalAverage,
    'prediccion_siguiente_ano': predictionResult[productCode].nextYearPrediction,
    'confianza_%': predictionResult[productCode].confidence,
  }));

  const worksheet = XLSX.utils.json_to_sheet(resultData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Predicciones');
  XLSX.writeFile(workbook, 'predicciones_ventas.xlsx');
};