import { IgrDataChart } from 'igniteui-react-charts';
import { IgrDataChartCoreModule } from 'igniteui-react-charts';
import { IgrDataChartCategoryModule } from 'igniteui-react-charts';
import { IgrDataChartStackedModule } from 'igniteui-react-charts';
import { IgrColumnFragmentModule } from 'igniteui-react-charts'
import { IgrDataChartInteractivityModule } from 'igniteui-react-charts';

import { IgrStackedFragmentSeries } from 'igniteui-react-charts';

import { IgrNumericYAxis } from 'igniteui-react-charts';
import { IgrCategoryXAxis } from 'igniteui-react-charts';

import { IgrStackedSplineAreaSeries } from 'igniteui-react-charts';
// legend's modules:
import { IgrLegend } from 'igniteui-react-charts';
import { IgrLegendModule } from 'igniteui-react-charts';
import * as React from "react";
import "../styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";

IgrDataChartCoreModule.register();
IgrDataChartCategoryModule.register();
IgrDataChartStackedModule.register();
IgrColumnFragmentModule.register();
IgrDataChartInteractivityModule.register();
IgrLegendModule.register();

export default class DataChartTypeStackedSplineAreaSeries extends SharedComponent {
    public data: any[];
    public chart: IgrDataChart;
    public legend: IgrLegend;

    constructor(props: any) {
        super(props);

        this.onChartRef = this.onChartRef.bind(this);
        this.onLegendRef = this.onLegendRef.bind(this);

        this.initData();
    }

    public render() {
        return (
            <div className="sample">
                <div className="options">
                    <span className="legendTitle">Legend: </span>
                    <div className="legendInline">
                        <IgrLegend ref={this.onLegendRef}
                            orientation="Horizontal" />
                    </div>
                </div>
                <div className="chart" style={{height: "calc(100% - 35px)"}}>
                    <IgrDataChart ref={this.onChartRef}
                        width="100%"
                        height="100%"
                        dataSource={this.data}
                        isHorizontalZoomEnabled={true}
                        isVerticalZoomEnabled={true} >
                        <IgrCategoryXAxis name="xAxis" label="Country"/>
                        <IgrNumericYAxis name="yAxis" minimumValue={0} />

                        <IgrStackedSplineAreaSeries name="series"
                        xAxisName="xAxis"
                        yAxisName="yAxis"
                        showDefaultTooltip="true"
                        areaFillOpacity="1">
                            <IgrStackedFragmentSeries name="coal" valueMemberPath="Coal" title="Coal"/>
                            <IgrStackedFragmentSeries name="hydro" valueMemberPath="Hydro" title="Hydro"/>
                            <IgrStackedFragmentSeries name="nuclear" valueMemberPath="Nuclear" title="Nuclear"/>
                            <IgrStackedFragmentSeries name="gas" valueMemberPath="Gas" title="Gas" />
                            <IgrStackedFragmentSeries name="oil" valueMemberPath="Oil" title="Oil"/>
                        </IgrStackedSplineAreaSeries>
                    </IgrDataChart>
                </div>
            </div>
        );
    }

    public initData() {
        this.data = [
            { Country: "Canada", Coal: 400, Oil: 100, Gas: 175, Nuclear: 225, Hydro: 350 },
            { Country: "China", Coal: 925, Oil: 200, Gas: 350, Nuclear: 400, Hydro: 625 },
            { Country: "Russia", Coal: 550, Oil: 200, Gas: 250, Nuclear: 475, Hydro: 425 },
            { Country: "Australia", Coal: 450, Oil: 100, Gas: 150, Nuclear: 175, Hydro: 350 },
            { Country: "United States", Coal: 800, Oil: 250, Gas: 475, Nuclear: 575, Hydro: 750 },
            { Country: "France", Coal: 375, Oil: 150, Gas: 350, Nuclear: 275, Hydro: 325 }
        ];
    }

    public onChartRef(chart: IgrDataChart) {
        this.chart = chart;
        if (this.legend) {
            this.chart.legend = this.legend;
        }
    }

    public onLegendRef(legend: IgrLegend) {
        this.legend = legend;
        if (this.chart) {
            this.chart.legend = this.legend;
        }
    }
}