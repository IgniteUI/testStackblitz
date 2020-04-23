import '@webcomponents/custom-elements/custom-elements.min';
import '@webcomponents/custom-elements/src/native-shim.js';
import { html, render } from 'lit-html';


import { IgcDataChartCategoryModule } from "igniteui-webcomponents-charts";
import { IgcDataChartInteractivityModule } from "igniteui-webcomponents-charts";
import { MarkerType } from 'igniteui-webcomponents-charts';
import { IgcDataChartComponent } from 'igniteui-webcomponents-charts';
import { IgcColumnSeriesComponent } from 'igniteui-webcomponents-charts';
import { IgcCategoryChartModule } from "igniteui-webcomponents-charts";
import { ModuleManager } from 'igniteui-webcomponents-core';
import { IgcFinancialChartModule } from 'igniteui-webcomponents-charts';
import { IgcFinancialChartComponent } from 'igniteui-webcomponents-charts';
import { IgcRadialGaugeModule } from 'igniteui-webcomponents-gauges';
import { IgcLinearGaugeModule } from 'igniteui-webcomponents-gauges';
import { IgcBulletGraphModule } from 'igniteui-webcomponents-gauges';
import { IgcLiveGridModule } from 'igniteui-webcomponents-grids';
import { IgcLiveGridComponent } from 'igniteui-webcomponents-grids';

// IgcDataChartInteractivityModule.register();
// IgcDataChartCategoryModule.register();
// IgcCategoryChartModule.register();
ModuleManager.register(
    IgcCategoryChartModule,
    IgcDataChartCategoryModule,
    IgcDataChartInteractivityModule,
    IgcFinancialChartModule,
    IgcRadialGaugeModule,
    IgcLinearGaugeModule,
    IgcBulletGraphModule,
    IgcLiveGridModule
)


let val = "test";
let dis = false;
let test = html`<div ?disabled=${dis}>
    <span >${val}</span>
    <button @click=${() => console.log("test")}></button>
    <span evil="${"first"}this is evil=${"huh"}"></span>
    
</div>`;
console.log(test);

let finData  = [
    { label: "A", open: 5, high: 8, low: 1, close: 2 },
   { label: "B", open: 2, high: 4, low: 0, close: 1 },
   { label: "C", open: 1, high: 3, low: 2, close: 5 },
   { label: "D", open: 5, high: 8, low: 5, close: 7 },
   { label: "E", open: 7, high: 7, low: 4, close: 6 },
   { label: "F", open: 6, high: 7, low: 7, close: 9 },
   { label: "G", open: 9, high: 11, low: 2, close: 5 },
   { label: "H", open: 5, high: 6, low: 4, close: 5 }
 ]

let data = [{
    label: "Item1",
    close: 1,
    x: 0,
    y: 0
},{
    label: "Item2",
    close: 2,
    x: 10,
    y: 10
},{
    label: "Item3",
    close: 3,
    x: 20,
    y: 20
},{
    label: "Item4",
    close: 4,
    x: 40,
    y: 40
},{
    label: "Item5",
    close: 5,
    x: 20,
    y: 20
}];

(document.getElementById("xAxis") as IgcDataChartComponent).dataSource = data;
(document.getElementById("series1") as IgcColumnSeriesComponent).dataSource = data;

(document.getElementById("chart2") as IgcDataChartComponent).dataSource = data;

(document.getElementById("chart3") as IgcFinancialChartComponent).dataSource = finData;

(document.getElementById("grid1") as IgcLiveGridComponent).dataSource = data;