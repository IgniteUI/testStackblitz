import React from "react";

import "../styles.css";
import "./SharedStyles.css";

import { IgrExcelXlsxModule } from 'igniteui-react-excel';
import { IgrExcelCoreModule } from 'igniteui-react-excel';
import { IgrExcelModule } from 'igniteui-react-excel';

import { IgrSpreadsheetModule } from 'igniteui-react-spreadsheet';
import { IgrSpreadsheet } from 'igniteui-react-spreadsheet';

import { ExcelUtility } from "./ExcelUtility";

import { SharedComponent } from "./SharedComponent";
import { SpreadsheetAction } from 'igniteui-react-spreadsheet';

IgrExcelCoreModule.register();
IgrExcelModule.register();
IgrExcelXlsxModule.register();

IgrSpreadsheetModule.register();

export default class SpreadsheetCommands extends SharedComponent {
    public spreadsheet: IgrSpreadsheet;

    constructor(props: any) {
        super(props);
        this.onSpreadsheetRef = this.onSpreadsheetRef.bind(this);
        this.onCommandClick = this.onCommandClick.bind(this);
    }

    public render() {
        return (
            <div className="sampleContainer">
                <div className="options">
                    <input className="optionItem" id="zoomIn" value="Zoom In" onClick={this.onCommandClick} type="button" />
                    <input className="optionItem" id="zoomOut" value="Zoom Out" onClick={this.onCommandClick} type="button" />
                </div>
                <IgrSpreadsheet ref={this.onSpreadsheetRef} height="calc(100% - 25px)" width="100%" />
            </div>
        );
    }

    public onCommandClick(e: any) {
        const id: string = e.target.id;

        switch (id) {
            case "zoomIn": {
                this.spreadsheet.executeAction(SpreadsheetAction.ZoomIn);
                break;
            }
            case "zoomOut": {
                this.spreadsheet.executeAction(SpreadsheetAction.ZoomOut);
                break;
            }
        }
    }

    public onSpreadsheetRef(spreadsheet: IgrSpreadsheet) {
        this.spreadsheet = spreadsheet;
        ExcelUtility.loadFromUrl(process.env.PUBLIC_URL + "/ExcelFiles/SalesData.xlsx").then((w) => {
            this.spreadsheet.workbook = w;
        });
    }
}