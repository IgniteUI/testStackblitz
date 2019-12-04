import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { OverviewComponentComponent } from './category-chart-overview-module/overview-component/overview-component.component';
import { OverviewComponent2Component } from './category-chart-overview-module/overview-component2/overview-component2.component';

const routes: Routes = [
  {path: `view1`, component: OverviewComponentComponent},
  {path: `view2`, component: OverviewComponent2Component}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ]
})
export class AppRoutingModule { }
