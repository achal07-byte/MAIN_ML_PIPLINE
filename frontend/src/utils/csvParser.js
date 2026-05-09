import Papa from 'papaparse'; // you'll need to add papaparse to package.json

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: reject
    });
  });
};

export const getCSVPreview = (data, rows = 5) => data.slice(0, rows);