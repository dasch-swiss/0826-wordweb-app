import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class ExportService {
    // Service was mainly taken from https://dev.to/idrisrampurawala/exporting-data-to-excel-and-csv-in-angular-3643

    readonly CSV_EXTENSION = '.csv';
    readonly CSV_TYPE = 'text/plain;charset=utf-8';

    constructor() {
    }

    private saveAsFile(buffer: any, fileName: string, fileType: string): void {
        const data: Blob = new Blob([buffer], {type: fileType});
        FileSaver.saveAs(data, fileName);
    }

    public exportToCsv(rows: object[], fileName: string, columns?: string[]): string {
        if (!rows || !rows.length) {
            return;
        }
        const separator = ';';
        const keys = Object.keys(rows[0]).filter(k => {
            if (columns?.length) {
                return columns.includes(k);
            } else {
                return true;
            }
        });
        const csvContent =
            keys.join(separator) +
            '\n' +
            rows.map(row => {
                return keys.map(k => {
                    let cell = row[k] === null || row[k] === undefined ? '' : row[k];
                    cell = cell instanceof Date
                        ? cell.toLocaleString()
                        : cell.toString().replace(/"/g, '""');
                    if (cell.search(/("|;|\n)/g) >= 0) {
                        cell = `"${cell}"`;
                    }
                    return cell;
                }).join(separator);
            }).join('\n');
        this.saveAsFile(csvContent, `${fileName}${this.CSV_EXTENSION}`, this.CSV_TYPE);
    }
}
