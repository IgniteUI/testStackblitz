import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { IgxCategoryChartModule } from "igniteui-angular-charts/ES5/igx-category-chart-module";
import { CategoryChartOverviewModule } from "./category-chart-overview-module/category-chart-overview-module.module";
import { AppRoutingModule } from './app-routing.module';
import { OverviewComponentComponent } from "./category-chart-overview-module/overview-component/overview-component.component";
import { OverviewComponent2Component } from "./category-chart-overview-module/overview-component2/overview-component2.component";
import { RouterModule } from '@angular/router';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    IgxCategoryChartModule,
    CategoryChartOverviewModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  entryComponents: []
})
export class AppModule {}
