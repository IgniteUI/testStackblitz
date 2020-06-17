import { WorldConnections } from "./WorldConnections";

import { IgcGeographicMapModule } from 'igniteui-webcomponents-maps';
import { IgcGeographicMapComponent } from 'igniteui-webcomponents-maps';
import { IgcGeographicSymbolSeriesComponent } from 'igniteui-webcomponents-maps';
import { IgcGeographicPolylineSeriesComponent } from 'igniteui-webcomponents-maps';
import { IgcDataChartInteractivityModule } from 'igniteui-webcomponents-charts';
import { MarkerType } from 'igniteui-webcomponents-charts';
import { ModuleManager } from 'igniteui-webcomponents-core';

export class SimpleMapSample {

  private geoMap: IgcGeographicMapComponent;

  constructor() {   

    //initialize template
    ModuleManager.register(
      IgcDataChartInteractivityModule,
      IgcGeographicMapModule
  );
  this.geoMap = document.getElementById("geoMap") as IgcGeographicMapComponent;
  this.connectedCallback();

  this.addPolylineSeriesWith = this.addPolylineSeriesWith.bind(this);
  this.addGridlineSeriesWith = this.addGridlineSeriesWith.bind(this);
  this.addSymbolSeriesWith = this.addSymbolSeriesWith.bind(this);
 
  }

  connectedCallback() {

    const worldFlights = WorldConnections.getFlights();
    const worldAirports = WorldConnections.getAirports();
    const worldGridlines = WorldConnections.getGridlines();

    this.addPolylineSeriesWith(worldFlights);
    this.addGridlineSeriesWith(worldGridlines);
    this.addSymbolSeriesWith(worldAirports);
  }

  public addGridlineSeriesWith(data: any[]) {
    const gridSeries = new IgcGeographicPolylineSeriesComponent();
    gridSeries.dataSource = data;
    gridSeries.shapeMemberPath = "points";
    gridSeries.shapeStroke = "Gray";
    gridSeries.shapeStrokeThickness = 1;
    this.geoMap.series.add(gridSeries);
}

public addPolylineSeriesWith(data: any[]) {
    const lineSeries = new IgcGeographicPolylineSeriesComponent();
    lineSeries.dataSource = data;
    lineSeries.shapeMemberPath = "points";
    lineSeries.shapeStroke = "rgba(196, 14, 14,0.05)";
    lineSeries.shapeStrokeThickness = 4;
    this.geoMap.series.add(lineSeries);
}

public addSymbolSeriesWith(data: any[]) {
    const symbolSeries = new IgcGeographicSymbolSeriesComponent();
    symbolSeries.dataSource = data;
    symbolSeries.markerType = MarkerType.Circle;
    symbolSeries.latitudeMemberPath = "lat";
    symbolSeries.longitudeMemberPath = "lon";
    symbolSeries.markerBrush = "#aad3df";
    symbolSeries.markerOutline = "rgb(73, 73, 73)";
    symbolSeries.thickness = 1;
    this.geoMap.series.add(symbolSeries);
}
}

let sample = new SimpleMapSample();
