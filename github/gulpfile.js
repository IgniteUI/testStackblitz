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
//additional dependencies
var addDependencies = [];
//globals
var scriptsPath = './github/';
var templates = './templates/';
var templateFiles = [];

//**delete root** 
function clean(cb) {
    del.sync("./github/**/*.*", {force:true});
    del.sync("./github");
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
            "additionalDependencies": "",       
            "sampleName": "${file.basename.replace('.tsx', '')}"             
        }
        `;       
        fs.writeFileSync(file.dirname + "/sample-manifest.json", manifest);
        cb(null, file);
    }))
    //Create README file
    .pipe(es.map(function(file, cb) {
        var getResources = path.join(file.dirname, "../");
        var original = path.basename(getResources);
        var config = `
# View on CodeSandbox 
[Run this sample in CodeSandbox](https://codesandbox.io/embed/github/IgniteUI/testStackblitz/tree/master/github/${original + "/" + file.basename.replace('.tsx','')}?fontsize=14&hidenavigation=1&theme=dark&view=preview)                        
        
# View on CodeSandbox with Editor
            
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <body>           
        <a target="_blank" href="https://codesandbox.io/s/github/IgniteUI/testStackblitz/tree/master/github/${original + "/" + file.basename.replace('.tsx','')}?fontsize=14&hidenavigation=1&theme=dark&view=preview">
            <img alt="Edit fbusv" src="https://codesandbox.io/static/img/play-codesandbox.svg"/>
        </a>
    </body>
</html>
        `;       
        fs.writeFileSync(file.dirname + "/README.md", config);
        cb(null, file);
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

// (varied per sample) (See getTemplates)

//Inject packages for package.json
var packageMap = [
    { name: "BulletGraph", package: `"igniteui-react-gauges"` },
    { name: "CategoryChart", package: `"igniteui-react-charts"`},
    { name: "DataChart", package: `"igniteui-react-charts"` },
    { name: "DataGrid", package: `"igniteui-react-grids"`},
    { name: "DataGridBindingRemoteData", package: `"igniteui-react-datasources"`},
    { name: "DataGridBindingLiveData", package: `"igniteui-react-charts"`},
    { name: "DoughnutChart", package: `"igniteui-react-charts"`},
    //Check if Spreadsheet is used
    { name: "ExcelLibrary", package: `"igniteui-react-excel"`},
    { name: "ExcelLibrarySparklines", package: `"igniteui-react-grids"`},
    { name: "FinancialChart", package: `"igniteui-react-charts"`},
    //Check if Chart is used
    { name: "Map", package: `"igniteui-react-maps"`+ `:` + packageVersion + `,
    ` + `"igniteui-react-charts"`},   
    { name: "LinearGauge", package: `"igniteui-react-gauges"`},
    { name: "PieChart", package: `"igniteui-react-charts"`},
    { name: "RadialGauge", package: `"igniteui-react-gauges"`},
    { name: "Sparkline", package: `"igniteui-react-charts"`},
    { name: "SparklineGrid", package: `"igniteui-react-grids"`},
    //Check if Excel, Chart Adapter is used
    { name: "Spreadsheet", package: `"igniteui-react-spreadsheet"` + `:` + packageVersion + `,
    ` + `"igniteui-react-excel"`},   
    { name: "SpreadsheetAdapter", package: `"igniteui-react-spreadsheet-chart-adapter"`},
    { name: "TreeMap", package: `"igniteui-react-charts"`},
    { name: "ZoomSlider", package: `"igniteui-react-charts"`},
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
        var m = manifestContent.toString();
        var manifest = JSON.parse(manifestContent.toString());
        var sampleName = manifest.sampleName;
        var dependencies = manifest.additionalDependencies;
        //console.log(dependencies);
        
        //Move Sample file to src folder
        var sampleRootName = sampleName + '.tsx';
        var sampleFile = file.dirname + '\\' + sampleRootName;
        var sampleDest = file.dirname + '\\' + 'src';
        //console.count();
        
        
        if(fs.existsSync(sampleFile)) {
            
            var f = fs.readFileSync(sampleFile);

            var readFile = f.toString();

            //general
            var isStylesCssContent = readFile.includes('import "../styles.css";');
            var isSharedStylesCssContent = readFile.includes('import "./SharedStyles.css";');
            var isSharedStylesCssContent2 = readFile.includes("import './SharedStyles.css';");
            var isSharedData = readFile.includes('import { SharedData } from "./SharedData";');
            var isSharedComponent = readFile.includes('import { SharedComponent } from "./SharedComponent"');
            //datachart
            var isSampleFinancialData = readFile.includes('import { SampleFinancialData } from "./SampleFinancialData";');
            var isSampleScatterData = readFile.includes('import { SampleScatterData } from "./SampleScatterData"');
            var isSampleScatterStats = readFile.includes('import { SampleScatterStats } from "./SampleScatterStats";');
            var isSampleScatterStats2 = readFile.includes('import { SampleScatterStats } from "../data-chart/SampleScatterStats";');
            var isSampleCategoryData = readFile.includes('import { SampleCategoryData } from "./SampleCategoryData";');
            var isSamplePolarData = readFile.includes('import { SamplePolarData } from "./SamplePolarData";');
            var isSampleRadialData = readFile.includes('import { SampleRadialData } from "./SampleRadialData";');
            var isSampleRangeData = readFile.includes('import { SampleRangeData } from "./SampleRangeData";');
            var isSampleDensityData = readFile.includes('import { SampleDensityData } from "./SampleDensityData";');
            var isSampleShapeData  = readFile.includes('import { SampleShapeData } from "./SampleShapeData";');
            //grid
            var isFinancialData  = readFile.includes('import { FinancialData } from "./FinancialData"');
            var isTaskUtil  = readFile.includes('import { TaskUtil } from "../../utilities/TaskUtil";');
            var isTaskUtil2 = readFile.includes('import { TaskUtil } from "./TaskUtil";')
            var isOData = readFile.includes("import './odatajs-4.0.0';");
            var isPager = readFile.includes("import { Pager } from './pager/Pager';");
            var isFlags = readFile.includes("'./flags/'");
            var isFlagsX = readFile.includes('import "./flags.tsx";');
            //excel
            var isExcelUtilityLocal = readFile.includes('import { ExcelUtility } from "./ExcelUtility";');
            var isExcelUtility  = readFile.includes('import { ExcelUtility } from "../excel-library/ExcelUtility";');
            var isExcelUtility2  = readFile.includes("import { ExcelUtility } from '../excel-library/ExcelUtility';");
            var isExcelFile = readFile.includes("/ExcelFiles/");
            //financialchart
            var isStocksUtility  = readFile.includes('import { StocksUtility } from "./StocksUtility";');
            var isStocksHistory  = readFile.includes('import { StocksHistory } from "./StocksHistory";');
            //geomap
            var isMapBindingDataCSV = readFile.includes("import MapBindingDataCSV from './MapBindingDataCSV';")
            var isGeoMapStyles  = readFile.includes('import "./GeoMapStyles.css"');
            var isGeoMapPanel  = readFile.includes('import { GeoMapPanel } from "./GeoMapPanel";');
            var isDataUtils  = readFile.includes('import DataUtils from "../../utilities/DataUtils";');
            var isDataUtils2 = readFile.includes('import DataUtils from "../../utilities/DataUtils"');
            var isWorldUtils  = readFile.includes('import isWorldUtils from "../../utilities/isWorldUtils";');
            var isWorldUtils2 = readFile.includes('import WorldUtils from "../../utilities/WorldUtils"');
            var isWorldConnections  = readFile.includes('import isWorldConnections from "../../utilities/isWorldConnections";');
            var isWorldConnections2 = readFile.includes('import WorldConnections from "./WorldConnections";');
            var isMapUtils  = readFile.includes('import { MapUtils } from "./MapUtils";');
            var isEsriUtility  = readFile.includes('import { EsriUtility } from "./EsriUtility";');
            var isLegendItem  = readFile.includes('import LegendItem from "../../components/LegendItem";');
            var isLegendOverlay  = readFile.includes('import LegendOverlay from "../../components/LegendOverlay";');
            var isData = readFile.includes('/Data/');
            var isImages = readFile.includes('/images/');
            //sparkline
            var isProducts = readFile.includes("import { Products } from '../../utilities/Products';");
            //spreadsheet
            //treemap
            var isSampleTreeMapData = readFile.includes('import { SampleTreeMapData } from "../tree-map/WorldPopData";');            

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
            if(isSampleScatterData == true) {
                gulp.src("./src/samples/" + original + "/" + "SampleScatterData.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isSampleScatterStats == true) {
                gulp.src("./src/samples/" + original + "/" + "SampleScatterStats.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isSampleScatterStats2 == true) {
                gulp.src("./src/samples/data-chart" + "/" + "SampleScatterStats.tsx")
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
            if(isTaskUtil2 == true) {
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
            if(isFlags == true) {
                gulp.src("./src/samples/data-grid/flags/**")
                .pipe(gulp.dest(file.dirname + "/src" + "/flags"))
            }  
            if(isFlagsX == true) {
                gulp.src("./src/samples/data-grid/flags/flags.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            //Excel
            isExcelUtilityLocal
            if(isExcelUtilityLocal == true) {
                gulp.src("./src/samples/excel-library" + "/" + "ExcelUtility.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }  
            if(isExcelUtility == true) {
                gulp.src("./src/samples/excel-library" + "/" + "ExcelUtility.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }  
            if(isExcelUtility2 == true) {
                gulp.src("./src/samples/excel-library" + "/" + "ExcelUtility.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            }  
            if(isExcelFile == true) {
                gulp.src("./public/ExcelFiles/**")
                .pipe(gulp.dest(file.dirname + "/src" + "/ExcelFiles"))
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
            if(isMapBindingDataCSV  == true) {
                gulp.src("./src/samples/" + original + "/" + "isMapBindingDataCSV.tsx")
                .pipe(gulp.dest(file.dirname + "/src"))
            } 
            if(isGeoMapStyles == true) {
                gulp.src("./src/samples/" + original + "/" + "GeoMapStyles.css")
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
            if(isDataUtils2 == true) {
                gulp.src("./src/utilities" + "/" + "DataUtils.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isWorldUtils == true) {
                gulp.src("./src/utilities" + "/" + "WorldUtils.ts")
                .pipe(gulp.dest(file.dirname + "/src"))
            }
            if(isWorldUtils2 == true) {
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
            if(isData == true) {
                gulp.src("./public/Data/**")
                .pipe(gulp.dest(file.dirname + "/src" + "/Data"))
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
            //Misc
            if(isImages  == true) {
                gulp.src("./public/images/**")
                .pipe(gulp.dest(file.dirname + "/src" + "/images"))
            }
            //move and delete sample
            gulp.src(sampleFile)            
            .pipe(replace("./pager/", "./"))
            .pipe(replace("../tree-map/", "./"))
            .pipe(replace("../data-chart/", "./"))
            .pipe(replace('../../utilities/', './'))
            .pipe(replace('../../excel-library/', './'))
            .pipe(replace('../excel-library/', './') )
            .pipe(replace('../../components/', './'))
            .pipe(replace('../../', './'))
            .pipe(gulp.dest(sampleDest))
            .on('end', function() {
                del(sampleFile);            
            });
        }
        cb();    

        //TODO Update Manifest to additional dependencies
        // for (var i = 0; i < addDependencies.length; i++) {
        //     var currDependency = addDependencies[i];
        //     dependencies = currDependency; 
        //     var newContent = currDependency.content.replace(/additionalDependencies/gm, currDependency.toString());
        //     console.log(addDependencies);
        //     fs.writeFileSync(scriptsPath + "**/sample-manifest.json", newContent);
        // }

        //Add Common Dependency
        var packageNames = getPackageNames(dependencies, sampleName);
        var packageString = `"igniteui-react-core":` + packageVersion + `,
        `;

        
        //Add Additional Dependencies
        for (var i = 0; i< packageNames.length; i++) {
            //console.log(dependencies);
            packageString += `${packageNames[i]}` + dependencies + `:` + packageVersion +`,
            `;
        }

        //Parse template files. Update build flags
        for (var i = 0; i < templateFiles.length; i++) {
            
            var currTemplate = templateFiles[i];
            var newContent = currTemplate.content.replace(/@@SampleName/gm, sampleName);
            newContent = newContent.replace(/@@Dependencies/gm, packageString);
            var ind = currTemplate.name.lastIndexOf("\\");
            var pathPath = currTemplate.name.substr(0, ind);
            fs.mkdirSync(file.dirname + "/" + pathPath, {recursive: true});
            fs.writeFileSync(file.dirname + "/" + currTemplate.name, newContent);
        }
        cb();
    }));
    cb();
}

function readMeScripts(cb) {
    gulp.src(scriptsPath + "**/README.md")  
    .pipe(es.map(function(file, cb) {
    }));
    cb();
}

//Create Scripts per component
exports.scripts = gulp.series(getTemplates, scripts);
exports.readMeScripts = gulp.series(readMeScripts);
exports.default = gulp.series(pack, scripts);
exports.all = gulp.series(pack,
     getTemplates,     
     scripts,
     readMeScripts);