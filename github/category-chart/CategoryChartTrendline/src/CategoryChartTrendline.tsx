import { IgrCategoryChart } from 'igniteui-react-charts';
import { IgrCategoryChartModule } from 'igniteui-react-charts';
import { IgrLegend } from 'igniteui-react-charts';
import { IgrLegendModule } from 'igniteui-react-charts';
import * as React from "react";
import "../styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";
import { SharedData } from "./SharedData";

IgrCategoryChartModule.register();
IgrLegendModule.register();

export default class CategoryChartTrendline extends SharedComponent {
    public data: any[];
    public chart: IgrCategoryChart;
    public legend: IgrLegend;

    constructor(props: any) {
        super(props);

        this.onChartRef = this.onChartRef.bind(this);
        this.onLegendRef = this.onLegendRef.bind(this);

        this.state = { trendLineType: "QuarticFit" }
        this.initData();
    }

    public render() {
        return (
            <div className="sampleContainer" >
                <div className="options">
                    <span className="optionLabel">Trend Line Type: </span>
                    <select
                        value={this.state.trendLineType}
                        onChange={this.onTrendlineTypeChanged}>
                        <option>LinearFit</option>
                        <option>QuadraticFit</option>
                        <option>CubicFit</option>
                        <option>QuarticFit</option>
                        <option>QuinticFit</option>
                        <option>LogarithmicFit</option>
                        <option>ExponentialFit</option>
                        <option>PowerLawFit</option>
                        <option>SimpleAverage</option>
                        <option>ExponentialAverage</option>
                        <option>ModifiedAverage</option>
                        <option>CumulativeAverage</option>
                        <option>WeightedAverage</option>
                        <option>None</option>
                    </select>
                </div>

            <div className="chart" style={{height: "calc(100% - 50px)"}} >
                <IgrCategoryChart
                    ref={this.onChartRef}
                    width="100%"
                    height="100%"
                    chartType="Point"
                    markerTypes="Circle"
                    chartTitle="Average Temperature over 2000 Years"
                    dataSource={this.data}
                    trendLineType={this.state.trendLineType}
                    trendLineThickness={2}
                    trendLinePeriod={20}
                    yAxisMinimumValue={0}
                    yAxisTitle="Temperature (C)"
                    xAxisTitle="Years"/>
            </div>
            <div className="legend">
                <IgrLegend ref={this.onLegendRef} orientation="Horizontal"  />
            </div>

        </div>
        );
    }

    public onTrendlineTypeChanged = (e: any) =>{
        this.setState({trendLineType: e.target.value});
    }

    public onChartRef(chart: IgrCategoryChart) {
        this.chart = chart;
        if (this.legend) {
            this.chart.legend = this.legend;
            this.chart.includedProperties = ["Value", "Label"];
            this.chart.excludedProperties = ["High", "Low"];
        }
    }

    public onLegendRef(legend: IgrLegend) {
        this.legend = legend;
        if (this.chart) {
            this.chart.legend = this.legend;
        }
    }

    public initData() {

        // generating average temperature for a few cities
        const eg: any = SharedData.getTemperatures(30, 0, 2000);
        const it: any = SharedData.getTemperatures(20, 0, 2000);
        const uk: any = SharedData.getTemperatures(10, 0, 2000);

        // setting data intent for Series Title
        uk.__dataIntents = {
            Value: ["SeriesTitle/London"]
        };
        it.__dataIntents = {
            Value: ["SeriesTitle/Rome"]
        };
        eg.__dataIntents = {
            Value: ["SeriesTitle/Cairo"]
        };
        this.data = [ eg, it, uk ];
    }
}
