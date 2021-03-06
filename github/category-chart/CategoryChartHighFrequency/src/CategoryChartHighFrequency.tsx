import { IgrCategoryChart } from 'igniteui-react-charts';
import { IgrCategoryChartModule } from 'igniteui-react-charts';
import * as React from "react";
import "../styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";
import { SharedData } from "./SharedData";

IgrCategoryChartModule.register();

export default class CategoryChartHighFrequency extends SharedComponent {
    public dataIndex: number = 0;
    public dataPoints: number = 100000;
    public data: any[];

    public refreshMilliseconds: number = 10;
    public interval: number = -1;

    public chart: IgrCategoryChart;
    public fps: HTMLSpanElement;
    public frameTime: Date;
    public frameCount: number = 0;

    constructor(props: any) {
        super(props);

        this.onChartRef = this.onChartRef.bind(this);
        this.onFpsRef = this.onFpsRef.bind(this);
        this.onScalingRatioChanged = this.onScalingRatioChanged.bind(this);
        this.onRefreshFrequencyChanged = this.onRefreshFrequencyChanged.bind(this);
        this.onDataGenerateClick = this.onDataGenerateClick.bind(this);
        this.onDataPointsChanged = this.onDataPointsChanged.bind(this);

        this.data = SharedData.generateItems(100, this.dataPoints, false);
        this.dataIndex = this.data.length;

        this.state = {
            dataInfo: SharedData.toShortString(this.dataPoints),
            dataPoints: this.dataPoints,
            dataSource: this.data,
            scalingRatio: window.devicePixelRatio,
            refreshInterval: this.refreshMilliseconds,
            refreshInfo: (this.refreshMilliseconds / 1000).toFixed(3) + "s"
        }
    }

    public render() {
        return (
        <div className="sampleContainer">
            <div className="options">
                <label className="optionLabel">Refresh Interval: </label>
                <label className="optionValue" >
                    {this.state.refreshInfo}
                </label>
                <input className="slider" type="range" min="10" max="500"
                    value={this.state.refreshInterval}
                    onChange={this.onRefreshFrequencyChanged}/>
                <label className="optionLabel">Data Points: </label>
                <label className="optionValue" >
                    {this.state.dataInfo}
                </label>
                <input className="slider" type="range" min="10000" max="1000000" step="1000"
                    value={this.state.dataPoints}
                    onChange={this.onDataPointsChanged}/>
                <button onClick={this.onDataGenerateClick}>Generate Data</button>
                <label className="optionItem"><input type="checkbox"
                    onChange={this.onScalingRatioChanged}/> Optimize Scaling </label>
                <span ref={this.onFpsRef} className="optionLabel" />
            </div>
            <div className="chart" style={{height: "calc(100% - 45px)"}} >
                <IgrCategoryChart ref={this.onChartRef}
                    width="100%"
                    height="100%"
                    chartType="Line"
                    dataSource={this.state.dataSource}/>
            </div>
        </div>
        );
    }

    public componentWillUnmount() {
        if (this.interval >= 0) {
             window.clearInterval(this.interval);
             this.interval = -1;
         }
    }

    public onFpsRef(span: HTMLSpanElement) {
        this.fps = span;
    }

    public onChartRef(chart: IgrCategoryChart) {
        this.chart = chart;
        this.onChartInit();
    }

    public onChartInit(): void {
        this.frameTime = new Date();
        this.setupInterval();
    }

    public onScalingRatioChanged = (e: any) =>{
        if (e.target.checked) {
            this.setState({ scalingRatio: 1.0 });
        } else {
            this.setState({ scalingRatio: NaN });
        }
    }

    public onDataGenerateClick() {
        this.data = SharedData.generateItems(100, this.dataPoints, false);
        this.dataIndex = this.data.length;

        this.setState({ dataSource: this.data });
    }

    public onDataPointsChanged = (e: any) => {
        let num: number = parseInt(e.target.value, 10);

        if (isNaN(num)) {
            num = 10000;
        }
        if (num < 10000) {
            num = 10000;
        }
        if (num > 1000000) {
            num = 1000000;
        }
        const info = SharedData.toShortString(num);
        this.dataPoints = num;
        this.setState({ dataPoints: num, dataInfo: info });
    }

    public ngOnDestroy(): void {
        if (this.interval >= 0) {
            window.clearInterval(this.interval);
            this.interval = -1;
        }
    }

    public onRefreshFrequencyChanged = (e: any) => {
        let num: number = parseInt(e.target.value, 10);

        if (isNaN(num)) {
            num = 10;
        }
        if (num < 10) {
            num = 10;
        }
        if (num > 500) {
            num = 500;
        }
        this.refreshMilliseconds = num;
        const info = (this.refreshMilliseconds / 1000).toFixed(3) + "s";
        this.setState({refreshInterval: num, refreshInfo: info });
        this.setupInterval();
    }

    public setupInterval(): void {
        if (this.interval >= 0) {
            window.clearInterval(this.interval);
            this.interval = -1;
        }

        this.interval = window.setInterval(() => this.tick(),
        this.refreshMilliseconds);
    }

    public tick(): void {
        this.dataIndex++;
        const oldItem = this.data[0];
        const newItem = SharedData.getNewItem(this.data, this.dataIndex);

        // updating data source and notifying category chart
        this.data.push(newItem);
        this.chart.notifyInsertItem(this.data, this.data.length - 1, newItem);
        this.data.shift();
        this.chart.notifyRemoveItem(this.data, 0, oldItem);

        this.frameCount++;
        const currTime = new Date();
        const elapsed = (currTime.getTime() - this.frameTime.getTime());
        if (elapsed > 5000) {
            const fps = this.frameCount / (elapsed / 1000.0);
            this.frameTime = currTime;
            this.frameCount = 0;
            this.fps.textContent = " FPS: " + Math.round(fps).toString();
        }
    }
}
