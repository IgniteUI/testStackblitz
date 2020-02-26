import { IgrFinancialChart } from 'igniteui-react-charts';
import { IgrFinancialChartModule } from 'igniteui-react-charts';
import * as React from "react";
import "./styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";
import { StocksHistory } from "./StocksHistory";

IgrFinancialChartModule.register();

export default class FinancialChartTooltipTypes extends SharedComponent {

    public data: any[];

    constructor(props: any) {
        super(props);
        this.state = { toolTipType: "Default" }
        this.initData();
    }

    public render() {
        return (
        <div className="sample">
            <div className="options">
                <span className="optionLabel">Tooltip Type: </span>
                <select value={this.state.toolTipType}
                    onChange={this.onToolTipTypeChanged}>
                    <option>Default</option>
                    <option>Item</option>
                    <option>Category</option>
                    <option>None</option>
                </select>
            </div>
            <div className="chart" style={{height: "calc(100% - 65px)"}}>
                <IgrFinancialChart
                    width="100%"
                    height="100%"
                    chartType="Line"
                    zoomSliderType="None"
                    yAxisMode="PercentChange"
                    dataSource={this.data}
                    toolTipType={this.state.toolTipType}
                    thickness={2} />
            </div>
        </div>
        );
    }

    public onToolTipTypeChanged = (e: any) =>{
        this.setState({toolTipType: e.target.value});
    }

    public initData() {
        this.data= [
            StocksHistory.getTesla(),
            StocksHistory.getAmazon(),
            StocksHistory.getMicrosoft()
        ];
    }
}

