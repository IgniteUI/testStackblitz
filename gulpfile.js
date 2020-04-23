// imports for gulp
var gulp = require('gulp');
var rename = require('gulp-rename');
var fs = require('fs.extra');
path = require('path');
var flatten = require('gulp-flatten');
var del = require('del');
const es = require('event-stream');
const shell = require('gulp-shell');
var replace = require('gulp-replace');
var contains = require('gulp-contains');
 
// package version
var packageVersion = '"^16.11.7"';
//additional dependencies
var addDependencies = [];
// globals
var scriptsPath = './github/';
var templates = './templates/';
var templatesShared = './templates-shared/';
var templateFiles = [];
var templateSharedFiles = [];

// **delete root** 
function clean(cb) {
    del.sync("./github/**/*.*", {force:true});
    del.sync("./github");
    cb();
}
exports.clean = clean;

// * Pack every sample into it's own dir.
function pack() {

    // move each tsx file into their own folder
   return gulp.src(['./src/samples/**/*.tsx',
        '!./src/samples/**/ExcelUtility*.tsx',
        '!./src/samples/**/LegendItem*.tsx',
        '!./src/samples/**/LegendOverlay*.tsx',
        '!./src/samples/**/SourceInfo*.tsx',
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
    
    // CreateManifest file
    .pipe(es.map(function(file, cb) {
        var manifest = `
{     
    "additionalDependencies": "@@AdditionalDependencies",       
    "sampleName": "${file.basename.replace('.tsx', '')}", 
    "sharedFiles": "@@SharedFiles"
}
        `;       
        fs.writeFileSync(file.dirname + "/manifest.json", manifest);
        cb(null, file);
    }))
    // Create README file
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

// * Cross sample statis specific Copy Template Files
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

//Get SharedTemplate Files
function getSharedFiles() {
    return gulp.src(templatesShared + './*')
        .pipe(es.map(function(file, cb) {                       
            var t = path.relative(templatesShared, file.path);
            var stat = fs.lstatSync(file.path);            
            if(!stat.isDirectory()) {
                var f = fs.readFileSync(file.path);               
                templateSharedFiles.push({name: t, content: f.toString()});
            } 
            cb();
    }));
}
exports.getSharedFiles = getSharedFiles;

//Iterate

// * Set SharedTemplate Files
// function getSharedFiles(sharedFile, file) {
//     return gulp.src(sharedFiles + './**/*')
//         .pipe(es.map(function(file, cb) {           
//             var t = path.relative(sharedFiles, file.path);
//             var stat = fs.lstatSync(file.path);
//             if(!stat.isDirectory()) {
//                 var f = fs.readFileSync(file.path);
//                 sharedFiles.push({name: t, content: f.toString()});
//             } 
//             cb();
//     }));
// }
// exports.getSharedFiles = getSharedFiles;


// (varied per sample) (See getTemplates)

// Inject packages for package.json
var packageMap = [
    { name: "BulletGraph", package: `"igniteui-react-gauges"` },
    { name: "CategoryChart", package: `"igniteui-react-charts"`},
    { name: "DataChart", package: `"igniteui-react-charts"` },
    { name: "DataGrid", package: `"igniteui-react-grids"`},
    { name: "DataGridBindingRemoteData", package: `"igniteui-react-datasources"`},
    { name: "DataGridBindingLiveData", package: `"igniteui-react-charts"`},
    { name: "DoughnutChart", package: `"igniteui-react-charts"`},
    // Check if Spreadsheet is used
    { name: "ExcelLibrary", package: `"igniteui-react-excel"`},
    { name: "ExcelLibraryCharts", package: `"igniteui-react-charts"`+ `:` + packageVersion + `,
    ` + `"igniteui-react-grids"`},
    { name: "ExcelLibrarySparklines", package: `"igniteui-react-grids"`},
    { name: "FinancialChart", package: `"igniteui-react-charts"`},
    // Check if Chart is used
    { name: "Map", package: `"igniteui-react-maps"`+ `:` + packageVersion + `,
    ` + `"igniteui-react-charts"`},   
    { name: "LinearGauge", package: `"igniteui-react-gauges"`},
    { name: "PieChart", package: `"igniteui-react-charts"`},
    { name: "RadialGauge", package: `"igniteui-react-gauges"`},
    { name: "Sparkline", package: `"igniteui-react-charts"`},
    { name: "SparklineGrid", package: `"igniteui-react-grids"`},
    // Check if Excel, Chart Adapter is used
    { name: "Spreadsheet", package: `"igniteui-react-spreadsheet"` + `:` + packageVersion + `,
    ` + `"igniteui-react-excel"`},   
    { name: "SpreadsheetAdapter", package: `"igniteui-react-spreadsheet-chart-adapter"`},
    { name: "TreeMap", package: `"igniteui-react-charts"`},
    { name: "ZoomSlider", package: `"igniteui-react-charts"`},
]

var dependencyMap = [
    { name: "BulletGraph", package: `"igniteui-react-gauges"` },
    { name: "CategoryChart", package: `"igniteui-react-charts"`},
    { name: "DataChart", package: `"igniteui-react-charts"` },
    { name: "DataGrid", package: `igniteui-react-grids`},
    { name: "DataGridBindingRemoteData", package: `igniteui-react-grids, igniteui-react-datasources`},
    { name: "DataGridBindingLiveData", package: `igniteui-react-grids, igniteui-react-charts`},
    { name: "DoughnutChart", package: `igniteui-react-charts`},
    // Check if Spreadsheet is used
    { name: "ExcelLibrary", package: `igniteui-react-excel`},
    { name: "ExcelLibraryCharts", package: `igniteui-react-charts, igniteui-react-grids`},
    { name: "ExcelLibrarySparklines", package: `igniteui-react-grids`},
    { name: "FinancialChart", package: `igniteui-react-charts`},
    // Check if Chart is used
    { name: "Map", package: `igniteui-react-maps` + `,
    ` + `igniteui-react-charts`},   
    { name: "LinearGauge", package: `igniteui-react-gauges`},
    { name: "PieChart", package: `igniteui-react-charts`},
    { name: "RadialGauge", package: `igniteui-react-gauges`},
    { name: "Sparkline", package: `igniteui-react-charts`},
    { name: "SparklineGrid", package: `igniteui-react-grids`},
    // Check if Excel, Chart Adapter is used
    { name: "Spreadsheet", package: `igniteui-react-spreadsheet` + `,
    ` + `igniteui-react-excel`},   
    { name: "SpreadsheetAdapter", package: `"igniteui-react-spreadsheet-chart-adapter"`+ `,
    ` + `"igniteui-react-excel"`},   
    { name: "TreeMap", package: `igniteui-react-charts`},
    { name: "ZoomSlider", package: `igniteui-react-charts`},
]

var sharedCSS = [
    { name: "BulletGraph", css: `BulletGraphSharedStyles.css` },
    { name: "CategoryChart", css: `CategoryChartSharedStyles.css`},
    { name: "DataChart", css: `DataChartSharedStyles.css` },
    { name: "DataGrid", css: `DataGridSharedStyles.css`},
    { name: "DoughnutChart", css: `DoughnutChartSharedStyles.css`},
    { name: "ExcelLibrary", css: `ExcelLibrarySharedStyles.css`},
    { name: "FinancialChart", css: `FinancialChartSharedStyles.css`},
    { name: "Map", css: `GeoMapSharedStyles.css`},
    { name: "LinearGauge", css: `LinearGaugeSharedStyles.css`},
    { name: "PieChart", css: `PieChartSharedStyles.css`},
    { name: "RadialGauge", css: `RadialGaugeSharedStyles.css`},
    { name: "Sparkline", css: `SparklineSharedStyles.css`},
    { name: "Spreadsheet", css: `SpreadsheetSharedStyles.css`},
    { name: "TreeMap", css: `DataGridSharedStyles.css`},
    { name: "ZoomSlider", css: `ZoomSliderSharedStyles.css`},
]

var sharedComponent = [
    { name: "BulletGraph", component: `BulletGraphSharedComponent.tsx` },
    { name: "CategoryChart", component: `CategoryChartSharedComponent.tsx`},
    { name: "DataChart", component: `DataChartSharedComponent.tsx` },
    { name: "DataGrid", component: `DataGridSharedComponent.tsx`},
    { name: "DoughnutChart", component: `DoughnutChartSharedComponent.tsx`},
    { name: "ExcelLibrary", component: `ExcelLibrarySharedComponent.tsx`},
    { name: "FinancialChart", component: `FinancialChartSharedComponent.tsx`},
    { name: "Map", component: `GeoMapSharedComponent.tsx`},
    { name: "LinearGauge", component: `LinearGaugeSharedComponent.tsx`},
    { name: "PieChart", component: `PieChartSharedComponent.tsx`},
    { name: "RadialGauge", component: `RadialGaugeSharedComponent.tsx`},
    { name: "Sparkline", component: `SparklineSharedComponent.tsx`},
    { name: "Spreadsheet", component: `SpreadsheetSharedComponent.tsx`},
    { name: "TreeMap", component: `DataGridSharedComponent.tsx`},
    { name: "ZoomSlider", component: `ZoomSliderSharedComponent.tsx`},
]

var sharedData = [
    { name: "CategoryChart", data: `CategoryChartSharedData.tsx`},
    { name: "DataChart", data: `DataChartSharedData.tsx`},
    { name: "DataGrid", data: `DataGridSharedData.tsx`},
    { name: "Excel", data: `ExcelLibrarySharedData.tsx`},    
]

var dataChartSharedFiles = [
    { name: "DataChart", data: `SampleCategoryData.tsx`},
    { name: "DataChart", data: `SampleDensityData.tsx`},
    { name: "DataChart", data: `SampleFinancialData.tsx`},
    { name: "DataChart", data: `SamplePolarData.tsx`},
    { name: "DataChart", data: `SampleRadialData.tsx`},
    { name: "DataChart", data: `SampleRangeData.tsx`},
    { name: "DataChart", data: `SampleScatterData.tsx`},
    { name: "DataChart", data: `SampleScatterStats.tsx`},
    { name: "DataChart", data: `SampleShapeData.tsx`},    
]

var dataGridSharedFiles = [
    { name: "DataGrid", data: `DataUtils.ts`},
    { name: "DataGrid", data: `FinancialData.ts`},
    { name: "DataGrid", data: `odatajs-4.0.0.js`},
    { name: "DataGrid", data: `Pager.css`},
    { name: "DataGrid", data: `TaskUtil.ts`},
]

var excelSharedFiles = [
    { name: "ExcelLibrary", data: `ExcelUtility.tsx`},
]

var financialChartSharedFiles = [
    { name: "FinancialChart", data: `StocksHistory.tsx`},
    { name: "FinancialChart", data: `StocksUtility.tsx`},
]


function getPackageNames(additionalDependencies, fileName) {
    var dependencies = [];
    for (var i = 0; i < packageMap.length; i++) {
        var currPackage = packageMap[i];
        if (fileName.indexOf(currPackage.name) === 0) {

            if (dependencies.indexOf(currPackage.package) === -1) {
                dependencies.push(currPackage.package)
            }
        }
        if (additionalDependencies && additionalDependencies.indexOf(currPackage.name) >= 0) {
            if (dependencies.indexOf(currPackage.package) === -1) {
                dependencies.push(currPackage.package)
            }
        }
    }
    return dependencies;
}

function getDependencyNames(additionalDependencies, fileName) {
    var dependencies = [];
    for (var i = 0; i < dependencyMap.length; i++) {
        var currPackage = dependencyMap[i];
        if (fileName.indexOf(currPackage.name) === 0) {

            if (dependencies.indexOf(currPackage.package) === -1) {
                dependencies.push(currPackage.package)
            }
        }
        if (additionalDependencies && additionalDependencies.indexOf(currPackage.name) >= 0) {
            if (dependencies.indexOf(currPackage.package) === -1) {
                dependencies.push(currPackage.package)
            }
        }
    }
    return dependencies;
}

function getSharedCSS(additionalCSS, fileName) {
    var css = [];
    for (var i = 0; i < sharedCSS.length; i++) {
        var currCSS = sharedCSS[i]
        if (fileName.indexOf(currCSS.name) === 0) {

            if (css.indexOf(currCSS.css) === -1) {
                css.push(currCSS.css)
                
            }
        }
    }

    return css;
}

function getSharedComponent(additionalComponent, fileName) {
    var component = [];
    for (var i = 0; i < sharedComponent.length; i++) {
        var currComponent = sharedComponent[i]
        if (fileName.indexOf(currComponent.name) === 0) {

            if (css.indexOf(currComponent.component) === -1) {
                css.push(currComponent.component)
                //console.log(css);
            }
        }
    }

    return css;
}

// * Parse sample folders with templates. 
// Read manifest file and update files respectfully. 
// Move sample file into src folder
function scripts(cb) {
    gulp.src(scriptsPath + "**/manifest.json")  
    .pipe(es.map(function(file, cb) {
        var manifestContent = fs.readFileSync(file.path);
        var m = manifestContent.toString();
        var manifest = JSON.parse(manifestContent.toString());
        var sampleName = manifest.sampleName;
        var dependencies = manifest.additionalDependencies;        
        // var sharedCSS = manifest.sharedCSS;
        // var sharedFiles = manifest.sharedFiles;

        // Move Sample file to src folder
        var sampleRootName = sampleName + '.tsx';
        var sampleFile = file.dirname + '\\' + sampleRootName;
        var sampleDest = file.dirname + '\\' + 'src';
        // console.count();
        
        //Discover imports / iterate templates shared files
        if(fs.existsSync(sampleFile)) {
            
            var f = fs.readFileSync(sampleFile);

            var readFile = f.toString();
            var sharedFiles = `[`;  
            
            var isFirst = true;
            //console.log(templateSharedFiles);
            for(var i = 0; i < templateSharedFiles.length; i++)
            { 
                var fileName = path.parse(templateSharedFiles[i].name).name;
               
                if(readFile.includes(fileName))
                {        
                    if(isFirst === true) {
                        sharedFiles += `"${templateSharedFiles[i].name}"`;    
                    }                            
                    else {
                        sharedFiles += `, "${templateSharedFiles[i].name}"`;   
                    }
                    isFirst = false;   
                    
                    //gulp copy
                    gulp.src("./templates-shared/" + templateSharedFiles[i].name)
                    .pipe(gulp.dest(file.dirname + "/src"));

                }
            }

            sharedFiles += `]`;

            // general style css
            var isStylesCssContent = readFile.includes('import "../styles.css";');
            if(isStylesCssContent === true) {
                gulp.src("./src/samples/styles.css")
                .pipe(gulp.dest(file.dirname))
            }            
        
            // move and delete sample
            gulp.src(sampleFile)            

            .pipe(gulp.dest(sampleDest))
            .on('end', function() {
                del(sampleFile);            
            });
        }
        
        

        // Add Common Dependency
        var packageNames = getPackageNames(dependencies, sampleName);
        var dependencyNames = getDependencyNames(dependencies, sampleName);
        var packageString = `"igniteui-react-core":` + packageVersion + `,
        `;
  
        var allPackges;
        //console.log(packageNames);
        // Add Additional Dependencies
        dependencies = dependencies.replace("@@AdditionalDependencies", "");
        for (var i = 0; i< packageNames.length; i++) {
            //console.log(dependencies);
            packageString += `${packageNames[i]}` + dependencies + `:` + packageVersion +`,
            `;
            allPackges = `[` + `${dependencyNames[i]}`  + dependencies + `]`;
           
        }       
        //console.log(dependencies);
        // Parse template files. Update build flags
        for (var i = 0; i < templateFiles.length; i++) {
            
            var currTemplate = templateFiles[i];
            var newContent = currTemplate.content.replace(/@@SampleName/gm, sampleName);
            newContent = newContent.replace(/@@Dependencies/gm, packageString);
            var ind = currTemplate.name.lastIndexOf("\\");
            var pathPath = currTemplate.name.substr(0, ind);
            fs.mkdirSync(file.dirname + "/" + pathPath, {recursive: true});
            fs.writeFileSync(file.dirname + "/" + currTemplate.name, newContent);
        }

        var sharedCSSNames = getSharedCSS(sharedCSS, sampleName)
        var cssString = ``;
        
        // // Add Shared Css
        for (var i = 0; i < sharedCSSNames.length; i++) {
            cssString += `${sharedCSSNames[i]}`;
        }
 

        // Update manifest
        var currTemplate = m;         
        
        var updateManifest = currTemplate.replace("\"@@AdditionalDependencies\"", allPackges)
                                         .replace("\"@@SharedFiles\"", sharedFiles);         
        fs.writeFileSync(file.dirname + "/" + "manifest.json", updateManifest);
        //console.log(updateManifest);
        cb();
    }));
    cb();
}

function scriptSharedFiles(cb) {}

function scriptSharedData(cb){}

function scriptSharedComponent(cb){}

exports.scripts = gulp.series(getTemplates, scripts);
exports.default = gulp.series(pack, scripts);
exports.all = gulp.series(pack,
     getTemplates,   
     getSharedFiles,  
     scripts);