var gulp = require('gulp');
var del = require('del');
var flatten = require('gulp-flatten');

var fileRoot = "c:/work/NetAdvantage/DEV/XPlatform/2019.2/"

gulp.task('clean', function() {
    return del.sync([
        "src/ig/**/*.*"
    ]);
});

gulp.task('copy', ['clean'], function(done) {
    gulp.src([
        fileRoot + 'Source/TSCore/*.ts',
        fileRoot + 'Source/WCCore/*.ts',
        fileRoot + 'Source/WCCore/*.tsx'
    ])
    .pipe(flatten())
    .pipe(gulp.dest("src/ig/igniteui-core", { mode: "0777" }))
    .on("end", function () {
        var stream = gulp.src([
            fileRoot + 'Source/Translator/bin/build/TS/**/*.ts',
            fileRoot + 'Source/Translator/bin/build/WebComponents/**/*.ts',
            fileRoot + 'Source/Translator/bin/build/WebComponents/**/*.tsx',
            fileRoot + 'Source/*.JS/**/bin/**/TS/**/*.ts',
            fileRoot + 'Source/*.JS/**/bin/**/WebComponents/**/*.ts',
            fileRoot + 'Source/*.JS/**/bin/**/WebComponents/**/*.tsx',
            "!" + fileRoot + 'Source/Excel.JS/**/*.ts',
            "!" + fileRoot + 'Source/Undo.JS/**/bin/**/WebComponents/**/*.ts',
            "!" + fileRoot + 'Source/Spreadsheet.JS/**/bin/**/WebComponents/**/*.ts',
            "!" + fileRoot + 'Source/Spreadsheet.JS/**/bin/**/TS/**/*.ts',
            "!" + fileRoot + 'Source/Spreadsheet.ChartAdapter.JS/**/bin/**/WebComponents/**/*.ts',
            "!" + fileRoot + 'Source/Spreadsheet.ChartAdapter.JS/**/bin/**/TS/**/*.ts',
            "!" + fileRoot + 'Source/Documents.Core.JS/**/*.ts'
        ])
        .pipe(flatten({ includeParents: -1 }))
        .pipe(gulp.dest("src/ig"));

        stream.on('end', function() {
            //run some code here
            done();
        });
        stream.on('error', function(err) {
            done(err);
        });
    })
    .on("error", function (err) {
        done(err);
    });
});

gulp.task('default', ['copy'], function() {
    
});
