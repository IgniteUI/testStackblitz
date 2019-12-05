import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';


import { IgrDataChartCategoryModule } from 'igniteui-react-charts/ES5/igr-data-chart-category-module';

import { IgrDataChartInteractivityModule } from 'igniteui-react-charts/ES5/igr-data-chart-interactivity-module';

import { IgrDataChart } from 'igniteui-react-charts/ES5/igr-data-chart';
import { IgrCategoryXAxis } from 'igniteui-react-charts/ES5/igr-category-x-axis';
import { IgrNumericYAxis } from 'igniteui-react-charts/ES5/igr-numeric-y-axis';
import { IgrLineSeries } from 'igniteui-react-charts/ES5/igr-line-series';

import { DataContext } from 'igniteui-react-core/ES5/igr-data-context';

import { IgrCrosshairLayer } from 'igniteui-react-charts/ES5/igr-crosshair-layer';
import { IgrDataChartAnnotationModule } from 'igniteui-react-charts/ES5/igr-data-chart-annotation-module';
 
IgrDataChartCategoryModule.register();
IgrDataChartInteractivityModule.register();
IgrDataChartAnnotationModule.register();

interface AppProps { }
interface AppState {
  name: string;
  data: any[];
  data2: any[];
}

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);

    this.onChartRef = this.onChartRef.bind(this);
    this.state = {
      name: 'React',
      data: this.generateData(100000),
      data2: this.generateData(100000)
    };
  }

  generateData(num: number): any[] {
    let data = [];
    let curr = 15.0;
    for (let i = 0; i < num; i++) {
      curr += Math.random() * 4.0 - 2.0;
      data.push({label: i.toString(), value: curr})
    }
    return data;
  }

  onChartRef(chart: IgrDataChart) {
    chart.syncChannel = "channel1";
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <IgrDataChart 
        ref={this.onChartRef}
        width="100%"
        height="50%"
        isHorizontalZoomEnabled="true"
        isVerticalZoomEnabled="true"
        >
        <IgrCategoryXAxis label="label"
        name="xAxis"
        dataSource={this.state.data}
        />
        <IgrNumericYAxis name="yAxis" />
        <IgrLineSeries 
        name="lineSeries"
        xAxisName="xAxis"
        yAxisName="yAxis"
        dataSource={this.state.data}
        valueMemberPath="value" />
        <IgrCrosshairLayer name="crosshairLayer" />
        </IgrDataChart>

        <IgrDataChart 
        ref={this.onChartRef}
        width="100%"
        height="50%"
        isHorizontalZoomEnabled="true"
        isVerticalZoomEnabled="true"
        >
        <IgrCategoryXAxis label="label"
        name="xAxis"
        dataSource={this.state.data2}
        />
        <IgrNumericYAxis name="yAxis" />
        <IgrLineSeries 
        name="lineSeries"
        xAxisName="xAxis"
        yAxisName="yAxis"
        dataSource={this.state.data2}
        valueMemberPath="value" />
        <IgrCrosshairLayer name="crosshairLayer" />
        </IgrDataChart>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
