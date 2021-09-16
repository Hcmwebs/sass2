// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// File path Variables
const files = {
  htmlPath: 'src/**/*.html',
  scssPath: 'src/scss/**/*.scss',
  jsPath: 'src/js/**/*.js',
  imgPath: 'src/images/**/*',
};

// Sass task
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'));
}

// Js task
function jsTask() {
  return src(files.jsPath)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'));
}

// Cachebusting  task
const cbString = new Date().getTime();
function cacheBustTask() {
  return src([files.htmlPath])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('dist'));
}

// Watch task

function watchTask() {
  watch(
    [files.scssPath, files.jsPath],
    parallel(scssTask, jsTask, cacheBustTask)
  );
}

// Default task

exports.default = series(parallel(scssTask, jsTask, cacheBustTask), watchTask);
