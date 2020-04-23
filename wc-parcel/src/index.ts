import "@webcomponents/custom-elements/src/native-shim.js";
import {
  IgcGeographicMapModule,
  IgcGeographicMapComponent,
  IgcGeographicShapeSeriesComponent
} from "igniteui-webcomponents-maps";
import { IgcDataChartInteractivityModule } from "igniteui-webcomponents-charts";
import { ModuleManager, VerticalAlignment } from "igniteui-webcomponents-core";
import { NumberAbbreviator } from "igniteui-webcomponents-charts";
import {
  IgcLinearGaugeModule,
  IgcLinearGaugeComponent,
  IgcLinearGraphRangeComponent
} from "igniteui-webcomponents-gauges";

ModuleManager.register(
  IgcGeographicMapModule,
  IgcDataChartInteractivityModule,
  IgcLinearGaugeModule
);

var map = document.getElementById("map") as IgcGeographicMapComponent;
map.backgroundContent = null;

var shapeSeries = document.getElementById(
  "shapeSeries"
) as IgcGeographicShapeSeriesComponent;

shapeSeries.styleShape = (s, e) => {
  var lowR = 40;
  var lowG = 69;
  var lowB = 115;

  var highR = 132;
  var highG = 168;
  var highB = 224;

  var pop = e.item.fieldValues.POP2005;

  var max = Math.log(1500000000);
  var min = Math.log(300000);
  var p = (Math.log(pop) - min) / (max - min);
  if (p < 0) {
    p = 0;
  }
  if (p > 1) {
    p = 1;
  }

  var color =
    "rgb(" +
    Math.round(lowR + (highR - lowR) * p) +
    ", " +
    Math.round(lowG + (highG - lowG) * p) +
    ", " +
    Math.round(lowB + (highB - lowB) * p) +
    ")";

  e.shapeFill = color;
  e.shapeStroke = color; //color.replace(")", ", .9)").replace("rgb(", "rgba(");
  //console.log(pop);
};

var gauge = document.getElementById("gauge") as IgcLinearGaugeComponent;
gauge.minimumValue = Math.log(300000);
gauge.maximumValue = Math.log(1500000000);
gauge.interval = (gauge.maximumValue - gauge.minimumValue) / 6.0;
gauge.formatLabel = (s, e) => {
  var val = Math.pow(Math.E, e.value);
  var abbr = new NumberAbbreviator();
  e.label = abbr.abbreviate(val);
};
gauge.tickBrush = "transparent";
gauge.minorTickBrush = "transparent";

var lastVal = 0;
function addSwatch(value) {
  var lowR = 40;
  var lowG = 69;
  var lowB = 115;

  var highR = 132;
  var highG = 168;
  var highB = 224;
  var r = new IgcLinearGraphRangeComponent();
  var max = Math.log(1500000000);
  var min = Math.log(300000);
  var p = (Math.log(value) - min) / (max - min);
  if (p < 0) {
    p = 0;
  }
  if (p > 1) {
    p = 1;
  }

  var color =
    "rgb(" +
    Math.round(lowR + (highR - lowR) * p) +
    ", " +
    Math.round(lowG + (highG - lowG) * p) +
    ", " +
    Math.round(lowB + (highB - lowB) * p) +
    ")";
  r.brush = color;
  r.outline = color;
  r.startValue = lastVal; // - Math.log(75000000);
  r.endValue = Math.log(value); // + Math.log(75000000);
  gauge.ranges.add(r);
  lastVal = r.endValue;
}

for (var i = 0; i < Math.log(1500000000); i += ((Math.log(1500000000) - Math.log(300000)) / 15) {
  addSwatch(Math.pow(Math.E, i))
}
