import { IgrItemLegend } from 'igniteui-react-charts';
import { IgrItemLegendModule } from 'igniteui-react-charts';
import { IgrPieChart } from 'igniteui-react-charts';
import { IgrPieChartModule } from 'igniteui-react-charts';

import * as React from "react";
import "../styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";

IgrPieChartModule.register();
IgrItemLegendModule.register();

export default class PieChartLegend extends SharedComponent {

    public data: any[];
    public chart: IgrPieChart;
    public legend: IgrItemLegend;

    constructor(props: any) {
        super(props);

        this.onChartRef = this.onChartRef.bind(this);
        this.onLegendRef = this.onLegendRef.bind(this);

        this.state = { componentVisible: true }
        this.initData();
    }

    public onChartRef(chart: IgrPieChart) {
        this.chart = chart;
        if (this.legend) {
            this.chart.legend = this.legend;
        }
    }

    public onLegendRef(legend: IgrItemLegend) {
        this.legend = legend;
        if (this.chart) {
            this.chart.legend = this.legend;
        }
    }

    public render() {
        return (
            <div className="sample">

                <div className="legend">
                    <IgrItemLegend ref={this.onLegendRef} />
                </div>

                <div className="chart">
                    <IgrPieChart ref={this.onChartRef}
                                 dataSource={this.state.data}
                                 labelMemberPath="MarketShare"
                                 valueMemberPath="MarketShare"
                                 legendLabelMemberPath="Company"
                                 outlines="white"
                                 width="100%"
                                 height="100%" />
                </div>
            </div>
        );
    }

    public initData() {
        this.state = {
            data: [
                { MarketShare: 30, Company: "Google",    },
                { MarketShare: 30, Company: "Apple",     },
                { MarketShare: 15, Company: "Microsoft", },
                { MarketShare: 15, Company: "Samsung",   },
                { MarketShare: 10, Company: "Other",     },
        ] };
    }
}