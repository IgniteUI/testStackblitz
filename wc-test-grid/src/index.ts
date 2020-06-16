import {
  IgcDataGridModule,
  IgcDataGridComponent,
  IgcGridColumnOptionsModule,
} from 'igniteui-webcomponents-grids';

import { ModuleManager } from "igniteui-webcomponents-core";
import { DataGenerator } from './data/dataGenerator';

export class SimpleDataGridSample {
  public constructor() {
    //initialize template
    ModuleManager.register(
      IgcDataGridModule,
      IgcGridColumnOptionsModule // this lets us use the column options feature
    );
    
    let dataGrid = document.getElementById("igDataGrid") as IgcDataGridComponent;
    dataGrid.dataSource = DataGenerator.getSales();
    
  }
}

let sample = new SimpleDataGridSample();
