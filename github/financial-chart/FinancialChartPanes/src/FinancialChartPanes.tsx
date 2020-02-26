import { IgrFinancialChart } from 'igniteui-react-charts';
import { IgrFinancialChartModule } from 'igniteui-react-charts';
import * as React from "react";
import "./styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";
import { StocksUtility } from "./StocksUtility";

IgrFinancialChartModule.register();

export default class FinancialChartPanes extends SharedComponent {

    public data: any[];

    constructor(props: any) {
        super(props);
         this.initData();
    }

    public render() {
        return (
            <div className="sample" style={{height: "calc(100% - 25px)"}} >
                <div className="chart">
                    <IgrFinancialChart
                        width="100%"
                        height="100%"
                        chartType="Candle"
                        zoomSliderType="Candle"
                        volumeType="Area"
                        overlayTypes="PriceChannel"
                        overlayBrushes="rgba(5, 138, 0, 0.17)"
                        overlayOutlines="rgba(5, 138, 0, 0.4)"
                        overlayThickness={1}
                        dataSource={this.data} />
                </div>
            </div>
        );
    }

    public initData() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const dateEnd = new Date(year, month, 1);
        const dateStart = new Date(year - 1, month, 1);

        this.data = StocksUtility.GetStocksBetween(dateStart, dateEnd);
    }
}