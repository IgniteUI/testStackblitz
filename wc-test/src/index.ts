import "@webcomponents/custom-elements/src/native-shim.js";
import {
  IgcCategoryChartModule,
  IgcCategoryChartComponent
} from "igniteui-webcomponents-charts";

import { ModuleManager } from "igniteui-webcomponents-core";

export class SimpleCategoryChartSample {
  public constructor() {
    //initialize template
    ModuleManager.register(IgcCategoryChartModule);
    let cc: IgcCategoryChartComponent = document.getElementById("chart");

    cc.dataSource = [
      { label: "A", value: 0 },
      { label: "B", value: 1 },
      { label: "C", value: 2 },
      { label: "D", value: 4 },
      { label: "E", value: 3 }
    ];
  }
}

let sample = new SimpleCategoryChartSample();
