//imports for gulp
var gulp = require('gulp');
var rename = require('gulp-rename');
var fs = require('fs.extra');
var path = require('path');
var flatten = require('gulp-flatten');
var del = require('del');
const es = require('event-stream');
const shell = require('gulp-shell');
var replace = require('gulp-replace');
var contains = require('gulp-contains');
 
//package version
var packageVersion = '"^16.11.7"';
//globals
var scriptsPath = './github/';
var templates = './templates/';
var templateFiles = [];

//**delete root** 
function clean(cb) {
    del("./github/**", {force:true});
    del("./github");
    cb();
}
exports.clean = clean;

//* Pack every sample into it's own dir.
function pack() {

    //move each tsx file into their own folder
   return gulp.src(['./src/samples/**/*.tsx',
        '!./src/samples/**/Shared*.tsx',
        '!./src/samples/**/Sample*.tsx',
        '!./src/samples/**/Stocks*.tsx',
        '!./src/samples/**/Shared*.tsx',
        '!./src/samples/**/Pager*.tsx',
        '!./src/samples/**/Test*.tsx',
        '!./src/samples/**/Igr*.tsx',
        '!./src/samples/**/World*.tsx',
    ])
    .pipe(flatten({ "includeParents": -1 }))
    .pipe(rename(function (path) {
        path.dirname += "/" + path.basename;
    }))
    .pipe(gulp.dest('./github/'))
    
    //CreateManifest file
    .pipe(es.map(function(file, cb) {
        var manifest = `
        {
            "sampleName": "${file.basename.replace('.tsx', '')}"   
        }
        `;       
        fs.writeFileSync(file.dirname + "/sample-manifest.json", manifest);
        fs.copyRecursive('./templates/', file.dirname, cb);
    }))
}
exports.pack = pack;

//* Copy Template Files
function getTemplates() {
    return gulp.src(templates + './**/*')
        .pipe(es.map(function(file, cb) {           
            var t = path.relative(templates, file.path);
            var stat = fs.lstatSync(file.path);
                if(!stat.isDirectory()) {
                    var f = fs.readFileSync(file.path);
                    templateFiles.push({name: t, content: f.toString()});
                } 
            cb();
    }));
}

exports.getTemplates = getTemplates;

//TODO Copy Template SharedComponent, SharedData, SharedFiles
// (varied per sample) (See getTemplates)

//Inject packages for package.json
var packageMap = [
    { name: "BulletGraph", package: "igniteui-react-gauges" },
    { name: "CategoryChart", package: "igniteui-react-charts"},
    { name: "DataChart", package: "igniteui-react-charts" },
    { name: "DataGrid", package: "igniteui-react-grids"},
    { name: "DoughnutChart", package: "igniteui-react-charts"},
    //Check if Spreadsheet is used
    { name: "ExcelLibrary", package: "igniteui-react-excel"},
    { name: "FinancialChart", package: "igniteui-react-charts"},
    { name: "Map", package: "igniteui-react-maps"},
    { name: "LinearGauge", package: "igniteui-react-gauges"},
    { name: "PieChart", package: "igniteui-react-charts"},
    { name: "RadialGauge", package: "igniteui-react-charts"},
    { name: "Sparkline", package: "igniteui-react-charts"},
    //Check if Excel, Chart Adapter is used
    { name: "Spreadsheet", package: "igniteui-react-charts"},
    { name: "TreeMap", package: "igniteui-react-charts"},
    { name: "ZoomSlider", package: "igniteui-react-charts"},
]

function getPackageNames(additionalDependencies, fileName) {
    var dependencies = [];
    for (var i = 0; i < packageMap.length; i++) {
        var currPackage = packageMap[i];
        if (fileName.indexOf(currPackage.name) == 0) {

            if (dependencies.indexOf(currPackage.package) == -1) {
                dependencies.push(currPackage.package)
            }
        }
        if (additionalDependencies && additionalDependencies.indexOf(currPackage.name) >= 0) {
            if (dependencies.indexOf(currPackage.package) == -1) {
                dependencies.push(currPackage.package)
            }
        }
    }
    return dependencies;
}

//Parse sample folders with templates. 
//Read manifest file and update files respectfully. 
//Move sample file into src folder
function scripts(cb) {
    gulp.src(scriptsPath + "**/sample-manifest.json")  
    .pipe(es.map(function(file, cb) {
        var manifestContent = fs.readFileSync(file.path);
        var manifest = JSON.parse(manifestContent.toString());
        var sampleName = manifest.sampleName;
        var dependencies = manifest.additionalDependencies;
        var packageNames = getPackageNames(dependencies, sampleName);
        var packageString = `"igniteui-react-core":` + packageVersion + `,
        `;
        for (var i = 0; i< packageNames.length; i++) {
            packageString += `"${packageNames[i]}":` + packageVersion +  `,
            `
        }

        //Move Sample file to src folder
        var sampleRootName = sampleName + '.tsx';
        var sampleFile = file.dirname + '\\' + sampleRootName;
        var sampleDest = file.dirname + '\\' + 'src';
        //console.count();
        
        
        if(fs.existsSync(sampleFile)) {
            
            var f = fs.readFileSync(sampleFile);

            //general
            var isStylesCssContent = f.toString().includes('import "../styles.css";');
            var isSharedStylesCssContent = f.toString().includes('import "./SharedStyles.css";');
            var isSharedStylesCssContent2 = f.toString().includes("import './SharedStyles.css';");
            var isSharedData = f.toString().includes('import { SharedData } from "./SharedData";');
            var isSharedComponent = f.toString().includes('import { SharedComponent } from "./SharedComponent"');
            //datachart
            var isSampleFinancialData = f.toString().includes('import { SampleFinancialData } from "./SampleFinancialData";');
            var isSampleScatterStats = f.toString().includes('import { SampleScatterStats  } from "./SampleScatterStats ";');
            var isSampleCategoryData = f.toString().includes('import { SampleCategoryData } from "./SampleCategoryData";');
            var isSamplePolarData = f.toString().includes('import { SamplePolarData } from "./SamplePolarData";');
            var isSampleRadialData = f.toString().includes('import { SampleRadialData } from "./SampleRadialData";');
            var isSampleRangeData = f.toString().includes('import { SampleRangeData } from "./SampleRangeData";');
            var isSampleDensityData = f.toString().includes('import { SampleDensityData } from "./SampleDensityData";');
            var isSampleShapeData  = f.toString().includes('import { SampleShapeData } from "./SampleShapeData";');
            //grid
            var isFinancialData  = f.toString().includes("import { FinancialData } from './FinancialData'");
            var isTaskUtil  = f.toString().includes('import { TaskUtil } from "../../utilities/TaskUtil";');
            var isOData = f.toString().includes("import './odatajs-4.0.0';");
            var isPager = f.toString().includes("import { Pager } from './pager/Pager';");
            //excel
            var isExcelUtility  = f.toString().includes('import { ExcelUtility } from "./ExcelUtility";');
            //financialchart
            var isStocksUtility  = f.toString().includes('import { StocksUtility } from "./StocksUtility";');
            var isStocksHistory  = f.toString().includes('import { StocksHistory } from "./StocksHistory";');
            //geomap
            var isGeoMapStyles  = f.toString().includes('import { GeoMapStyles } from "./GeoMapStyles";');
            var isGeoMapPanel  = f.toString().includes('import { GeoMapPanel } from "./GeoMapPanel";');
            var isDataUtils  = f.toString().includes('import DataUtils from "../../utilities/DataUtils";');
            var isWorldUtils  = f.toString().includes('import isWorldUtils from "../../utilities/isWorldUtils";');
            var isWorldConnections  = f.toString().includes('import isWorldConnections from "../../utilities/isWorldConnections";');
            var isMapUtils  = f.toString().includes('import { MapUtils } from "./MapUtils";');
            var isEsriUtility  = f.toString().includes('import { EsriUtility } from "./EsriUtility";');
            var isLegendItem  = f.toString().includes('import LegendItem from "../../components/LegendItem";');
            var isLegendOverlay  = f.toString().includes('import LegendOverlay from "../../components/LegendOverlay";');

            //sparkline
            var isProducts = f.toString().includes("import { Products } from '../../utilities/Products';");
            //spreadsheet
            //treemap
            var isSampleTreeMapData = f.toString().includes('import { SampleTreeMapData } from "../tree-map/WorldPopData";');            

            var getResources = path.join(file.dirname, "../");
            var original = path.basename(getResources);
            
            //Adding resource files
            if(isStylesCssContent == true) {
                gulp.src("./src/samples/styles.css")
                .pipe(gulp.dest(file.dirname))
            }            
            if(isSharedStylesCssContent == true) {
                gulp.src("./src/samples/" + original + "/" + "SharedStyles.css")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isSharedStylesCssContent2 == true) {
                gulp.src("./src/samples/" + original + "/" + "SharedStyles.css")
                .pipe(gulp.dest(file.dirname + "/src"))
            }            
            if(isSharedData == true) {
                gulp.src("./src/samples/" + original + "/" + "SharedData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isSharedComponent == true) {
                gulp.src("./src/samples/" + original + "/" + "SharedComponent.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            //DataChart
            if(isSampleFinancialData == true) {
                gulp.src("./src/samples/" + original + "/" + "SampleFinancialData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isSampleScatterStats == true) {
                gulp.src("./src/samples/" + original + "/" + "SampleScatterStats.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isSampleCategoryData == true) {
                gulp.src("./src/samples/" + original + "/" + "SampleCategoryData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isSamplePolarData == true) {
                gulp.src("./src/samples/" + original + "/" + "SamplePolarData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isSampleRadialData == true) {
                gulp.src("./src/samples/" + original + "/" + "SampleRadialData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isSampleRangeData == true) {
                gulp.src("./src/samples/" + original + "/" + "SampleRangeData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isSampleDensityData == true) {
                gulp.src("./src/samples/" + original + "/" + "SampleDensityData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isSampleShapeData == true) {
                gulp.src("./src/samples/" + original + "/" + "SampleShapeData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }  
            //Grid
            if(isFinancialData == true) {
                gulp.src("./src/samples/" + original + "/" + "FinancialData.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            }  
            if(isTaskUtil == true) {
                gulp.src("./src/utilities" + "/" + "TaskUtil.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isOData == true) {
                gulp.src("./src/samples/" + original + "/odatajs-4.0.0.js")
                .pipe(gulp.dest(file.dirname + "/src"))
            }  
            if(isPager == true) {
                gulp.src("./src/samples/" + original + "/pager/" + "Pager.tsx")
                .pipe(gulp.dest(file.dirname + "/src/"))
            }   
            //Excel
            if(isExcelUtility == true) {
                gulp.src("./src/samples/excel-library" + "/" + "ExcelUtility.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }  
            //Financial Chart
            if(isStocksUtility == true) {
                gulp.src("./src/samples/" + original + "/" + "StocksUtility.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }  
            if(isStocksHistory == true) {
                gulp.src("./src/samples/" + original + "/" + "StocksHistory.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }  
            //GeoMap
            if(isGeoMapStyles == true) {
                gulp.src("./src/samples/" + original + "/" + "GeoMapStyles.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isGeoMapPanel == true) {
                gulp.src("./src/samples/" + original + "/" + "GeoMapPanel.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isDataUtils == true) {
                gulp.src("./src/utilities" + "/" + "DataUtils.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isWorldUtils == true) {
                gulp.src("./src/utilities" + "/" + "WorldUtils.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isWorldConnections == true) {
                gulp.src("./src/utilities" + "/" + "WorldConnections.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isMapUtils == true) {
                gulp.src("./src/samples/" + original + "/" + "MapUtils.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isEsriUtility == true) {
                gulp.src("./src/samples/" + original + "/" + "EsriUtility.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isLegendItem == true) {
                gulp.src("/src/samples/components" + "/" + "LegendItem.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isLegendOverlay == true) {
                gulp.src("/src/samples/components" + "/" + "LegendOverlay.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            //Sparkline
            if(isProducts  == true) {
                gulp.src("./src/utilities" + "/" + "Products.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            //Spreadsheet
            //See above

            //TreeMap
            if(isSampleTreeMapData  == true) {
                gulp.src("./src/samples/" + original + "/" + "WorldPopData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }

            //move and delete sample
            gulp.src(sampleFile)            
            .pipe(replace("./pager/", "./"))
            .pipe(replace("../tree-map/", "./"))
            .pipe(replace('../../utilities/', './'))
            .pipe(replace('../../excel-library/', './'))
            .pipe(replace('../../components/', './'))
            .pipe(replace('../../', './'))
            .pipe(gulp.dest(sampleDest))
            .on('end', function() {
                del(sampleFile);            
            });
        }
        cb();    

        //Parse template files. Update build flags
        for (var i = 0; i < templateFiles.length; i++) {
            
            var currTemplate = templateFiles[i];
            var newContent = currTemplate.content.replace(/@@SampleName/gm, sampleName);
            newContent = newContent.replace(/@@Dependencies/gm, packageString);
            fs.writeFileSync(file.dirname + "/" + currTemplate.name, newContent);
        }
        cb();
    }));
    cb();
}

//Create Scripts per component
exports.scripts = gulp.series(getTemplates, scripts);
exports.default = gulp.series(pack, scripts);
exports.all = gulp.series(pack,
     getTemplates,     
     scripts);