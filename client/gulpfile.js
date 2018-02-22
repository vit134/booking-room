/*eslint no-console: 0*/
'use strict'

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    babel = require('gulp-babel'),
    browserify = require('gulp-browserify'),
    preset = require('babel-preset-es2015');


var path = {
    build: {
        styles: 'public/build/styles/',
        scripts: 'public/build/scripts/'
    },
    dev: {
        js: 'public/scripts/*/*.js',
        less: 'src/*.less',
        blocksLess: 'src/components/**/*.less'
    }
}

gulp.task('styles', function() {
    return gulp.src([
        path.dev.less,
        path.dev.blocksLess
    ])
    .pipe(concat('__main.less'))
    .pipe(less())
    .on('error', console.log)
    .pipe(gulp.dest(path.build.styles))
    .pipe(rename('_main.css'))
    .pipe(gulp.dest(path.build.styles))
});

gulp.task('scripts', function() {

    return gulp.src([
        path.dev.js
    ])
    //.pipe(concat('__main.js'))
    //.pipe(babel({presets: [preset]}))
    .pipe(gulp.dest(path.build.scripts))
    // .pipe(uglify().on('error', function(e) {
    //     console.log(e);
    // }))
    //.pipe(rename('_main.js'))
    .pipe(babel({presets: [preset]}))
    .pipe(browserify())
    .pipe(gulp.dest(path.build.scripts))
});

gulp.task('build', ['styles']);

gulp.task('watch',function(){
    gulp.watch([path.dev.less, path.dev.blocksLess], ['styles']);
});

gulp.task('default', ['build', 'watch']);