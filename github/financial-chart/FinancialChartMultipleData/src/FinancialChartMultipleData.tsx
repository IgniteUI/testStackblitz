import { IgrFinancialChart } from 'igniteui-react-charts';
import { IgrFinancialChartModule } from 'igniteui-react-charts';
import * as React from "react";
import "../styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";
import { StocksHistory } from "./StocksHistory";

IgrFinancialChartModule.register();

export default class FinancialChartMultipleData extends SharedComponent {
    public data: any[];

    constructor(props: any) {
        super(props);
        this.initData();
    }

    public render() {
        return (
            <div className="sample" >
                <div className="chart" style={{height: "calc(100% - 25px)"}}>
                <IgrFinancialChart
                    width="100%"
                    height="100%"
                    chartType="Line"
                    zoomSliderType="None"
                    chartTitle="Tesla vs Amazon vs Microsoft Changes"
                    subtitle="Between 2013 and 2017"
                    yAxisMode="PercentChange"
                    yAxisTitle="Percent Changed Since 2013"
                    yAxisInterval={100}
                    yAxisMaximumValue={950}
                    yAxisMinimumValue={-100}
                    thickness={2}
                    dataSource={this.data} />
                </div>
            </div>
        );
    }

    public initData() {
        this.data= [
            StocksHistory.getTesla(),
            StocksHistory.getAmazon(),
            StocksHistory.getMicrosoft()
        ];
    }
}

