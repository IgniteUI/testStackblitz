import { ExcelUtility } from "./utilities/ExcelUtility";

import {
  IgcSpreadsheetModule,
  IgcSpreadsheetComponent
} from 'igniteui-webcomponents-spreadsheet';

import { IgcSpreadsheetChartAdapterModule, 
  SpreadsheetChartAdapter 
} from 'igniteui-webcomponents-spreadsheet-chart-adapter';

import { 
  ChartType, 
  ChartTitle, 
  FormattedString, 
  WorksheetCell, 
  Worksheet } from "igniteui-webcomponents-excel";

import { ModuleManager } from "igniteui-webcomponents-core";

export class SimpleDataGridSample {

  private spreadsheet: IgcSpreadsheetComponent;

  constructor() {

    //initialize template
    ModuleManager.register(
      IgcSpreadsheetModule,
      IgcSpreadsheetChartAdapterModule
    );
    this.spreadsheet = document.getElementById("spreadsheet") as IgcSpreadsheetComponent;
    this.connectedCallback();
  }

  connectedCallback() {

    
        this.spreadsheet.chartAdapter = new SpreadsheetChartAdapter();

        let path = "https://static.infragistics.com/xplatform/excel/ChartData.xlsx";
        ExcelUtility.loadFromUrl(path).then((w) => {
            this.spreadsheet.workbook = w;

            const sheet: Worksheet = this.spreadsheet.workbook.worksheets(0);

            sheet.defaultColumnWidth = 450 * 20;
            sheet.rows(0).height = 150 * 20;

            const cell1: WorksheetCell = sheet.getCell("A1");
            const cell2: WorksheetCell = sheet.getCell("B1");
            const cell3: WorksheetCell = sheet.getCell("C1");
            const cell4: WorksheetCell = sheet.getCell("D1");

            const dataCellAddress = "A3:D6";

            const title: ChartTitle = new ChartTitle();
            title.text = new FormattedString("Line Chart");
            const chart1 = sheet.shapes().addChart(ChartType.Line, cell1, { x: 5, y: 5 }, cell1, { x: 90, y: 90 });
            chart1.chartTitle = title;
            chart1.setSourceData(dataCellAddress, true);

            const title2: ChartTitle = new ChartTitle();
            title2.text = new FormattedString("Column Chart");
            const chart2 = sheet.shapes().addChart(ChartType.ColumnClustered, cell2, { x: 5, y: 5 }, cell2, { x: 90, y: 90 });
            chart2.chartTitle = title2;
            chart2.setSourceData(dataCellAddress, true);

            const title3: ChartTitle = new ChartTitle();
            title3.text = new FormattedString("Area Chart");
            const chart3 = sheet.shapes().addChart(ChartType.Area, cell3, { x: 5, y: 5 }, cell3, { x: 90, y: 90 });
            chart3.chartTitle = title3;
            chart3.setSourceData(dataCellAddress, true);

            const title4: ChartTitle = new ChartTitle();
            title4.text = new FormattedString("Pie Chart");
            const chart4 = sheet.shapes().addChart(ChartType.Pie, cell4, { x: 5, y: 5 }, cell4, { x: 90, y: 90 });
            chart4.chartTitle = title4;
            chart4.setSourceData(dataCellAddress, true);
        });


  }

  
}

let sample = new SimpleDataGridSample();