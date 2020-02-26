import React from "react";

import "../styles.css";
import "./SharedStyles.css";
import { ExcelUtility } from "../excel-library/ExcelUtility";

import { IgrExcelXlsxModule } from 'igniteui-react-excel';
import { IgrExcelCoreModule } from 'igniteui-react-excel';
import { IgrExcelModule } from 'igniteui-react-excel';
import { IgrSpreadsheetModule } from 'igniteui-react-spreadsheet';
import { IgrSpreadsheet } from 'igniteui-react-spreadsheet';

IgrExcelCoreModule.register();
IgrExcelModule.register();
IgrExcelXlsxModule.register();

IgrSpreadsheetModule.register();

export default class SpreadsheetConditionalFormatting extends React.Component {
    public spreadsheet: IgrSpreadsheet;

    constructor(props: any) {
        super(props);
        this.onSpreadsheetRef = this.onSpreadsheetRef.bind(this);
    }

    public render() {
        return (
            <div className="sampleContainer">
                <IgrSpreadsheet ref={this.onSpreadsheetRef} height="100%" width="100%" />
            </div>
        );
    }

    public onSpreadsheetRef(spreadsheet: IgrSpreadsheet) {
        this.spreadsheet = spreadsheet;
        const path = process.env.PUBLIC_URL + "/ExcelFiles/ConditionalData.xlsx";
        ExcelUtility.loadFromUrl(path).then((w) => {
            this.spreadsheet.workbook = w;
        });
    }
}