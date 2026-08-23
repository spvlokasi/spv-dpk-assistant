import { Branch, DailyPerformance } from '../../types';
import { downloadPerformanceExcelTemplate } from './excelTemplate';
import { parseHtmlTableXls } from './excelHtmlParser';
import { parseBinaryXlsx } from './excelBinaryParser';

export function parsePerformanceExcelOrCsv(
  fileContent: string | ArrayBuffer,
  branches: Branch[],
  activeBranch?: Branch
): DailyPerformance[] {
  try {
    const text = typeof fileContent === 'string' ? fileContent : new TextDecoder().decode(fileContent);
    if (text.includes('<table') || text.includes('<tr')) {
      const htmlEntries = parseHtmlTableXls(text, branches, activeBranch);
      if (htmlEntries.length > 0) return htmlEntries;
    }
    return parseBinaryXlsx(fileContent, branches, activeBranch);
  } catch (err) {
    console.error('Parse Excel error:', err);
    return [];
  }
}

export { downloadPerformanceExcelTemplate };
