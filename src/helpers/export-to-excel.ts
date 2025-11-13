import ExcelJS from 'exceljs';

export const exportJSONToExcel = async ({
  data,
  fileName = 'data.xlsx',
  columns,
  hyperlinkColumns = [],
}: {
  data: Array<Record<string, any>>;
  fileName?: string;
  columns: Partial<ExcelJS.Column>[];
  hyperlinkColumns?: number[];
}) => {
  // 1️⃣ Create a new workbook & worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  // 2️⃣ Define custom headers
  worksheet.columns = columns;
  // Freeze the header row
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  // 3️⃣ Add your data
  data.forEach((item) => worksheet.addRow(item));

  // 4️⃣ Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 20;
  headerRow.alignment = { wrapText: false, vertical: 'middle' };
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: '444444' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffc53d' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // 5️⃣ Optionally add borders to all data cells
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.eachCell((cell) => {
      cell.font = { color: { argb: '444444' } };
      cell.border = {
        top: { style: 'thin', color: { argb: '666666' } },
        left: { style: 'thin', color: { argb: '666666' } },
        bottom: { style: 'thin', color: { argb: '666666' } },
        right: { style: 'thin', color: { argb: '666666' } },
      };
    });
  });

  // turn hyperlinks for specified columns
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    hyperlinkColumns.forEach((colIndex) => {
      const cell = row.getCell(colIndex + 1);

      // assuming the format is "name|url"
      const [label, url] = (cell.value as string).split('|');
      if (
        url &&
        label &&
        typeof url === 'string' &&
        typeof label === 'string' &&
        url.startsWith('http')
      ) {
        cell.value = { text: label, hyperlink: url };
        cell.font = { color: { argb: '0000FF' }, underline: true };
      }
    });
  });

  // 6️⃣ Create a downloadable file in browser
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
