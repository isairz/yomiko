'use strict';

var gulp        = require('gulp');
var concat      = require('gulp-concat');
var cssmin      = require('gulp-cssmin');
var gulfif      = require('gulp-if');
var imagemin    = require('gulp-imagemin');
var streamify   = require('gulp-streamify');
var uglify      = require('gulp-uglify');

var browserify  = require('browserify');
var del         = require('del');
var reactify    = require('reactify');
var source      = require('vinyl-source-stream');

var paths = {
  scripts: ['src/js/**/*.js'],
  styles: ['src/css/**/*.css'],
  images: ['src/img/**/*']
};

var browserifyConfig = {
  entries: ['./src/js/index.js'],
  transform: [reactify]
};

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('scripts', function() {
  return browserify(browserifyConfig).bundle()
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('build/js'));
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(concat('main.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('build/css'));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

gulp.task('build', ['scripts', 'styles', 'images']);

// Rerun the task when a file changes
gulp.task('watch', ['build'], function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.images, ['images']);
});


gulp.task('default', ['build']);