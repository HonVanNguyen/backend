import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {
  exportJsonToExcel(jsonData: any[], sheetName: string): Buffer {
    // Create a worksheet from the JSON data
    const worksheet = XLSX.utils.json_to_sheet(jsonData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Write the workbook to a buffer
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
