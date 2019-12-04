import { NgModule } from '@angular/core';
import { IgxCategoryChartModule } from "igniteui-angular-charts/ES5/igx-category-chart-module";
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { OverviewComponentComponent } from './overview-component/overview-component.component';
import { OverviewComponent2Component } from './overview-component2/overview-component2.component';

@NgModule({
  declarations: [OverviewComponentComponent, OverviewComponent2Component],
  imports: [
    CommonModule,FormsModule, IgxCategoryChartModule
  ], 
  exports: [OverviewComponentComponent, OverviewComponent2Component]
})
export class CategoryChartOverviewModule { }
