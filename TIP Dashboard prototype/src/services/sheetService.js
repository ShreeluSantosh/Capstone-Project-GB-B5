import Papa from 'papaparse';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_d3l6sqMA2mzhdJzwSTKjtV_5Q_K4FJMDx2Bx27OLOeZPFPtZxzYx-ZcGmb0wFsRUsb9oGgFUvsKl/pub?gid=0&single=true&output=csv';

export const fetchAPTData = async () => {
  const response = await fetch(SHEET_URL);
  const csvData = await response.text();
  const parsedData = Papa.parse(csvData, { header: true });
  return parsedData.data;
};
