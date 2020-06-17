import { WorldConnections } from "./WorldConnections";

import { SampleFinancialData } from './SampleFinancialData';

import { IgcDataChartComponent } from 'igniteui-webcomponents-charts';
import { IgcDataChartCoreModule } from 'igniteui-webcomponents-charts';
import { IgcDataChartCategoryModule } from 'igniteui-webcomponents-charts';
import { IgcDataChartInteractivityModule } from 'igniteui-webcomponents-charts';
import { IgcFinancialPriceSeriesModule } from 'igniteui-webcomponents-charts';
import { ModuleManager } from 'igniteui-webcomponents-core';

export class SimpleChartSample {

  private chart: IgcDataChartComponent;

  constructor() {   

    //initialize template
    ModuleManager.register(
      IgcDataChartCoreModule,
      IgcDataChartCategoryModule,
      IgcDataChartInteractivityModule,
      IgcFinancialPriceSeriesModule
  );
  this.chart = document.getElementById("chart") as IgcDataChartComponent;
  this.chart.dataSource = SampleFinancialData.create();
 
  }
}

let sample = new SimpleChartSample();
