'use strict';

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  sourcemaps = require("gulp-sourcemaps"),
  browserSync = require("browser-sync").create();

sass.compiler = require('node-sass');

const files = {
  scss: 'app/scss/**',
  css: 'app/css/',
  js: 'app/js/**',
}

function style() {
  return gulp
    .src(files.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('./', {
      includeContent: false,
      sourceRoot: '/app/scss'
    }))
    .pipe(gulp.dest(files.css))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}

function reload() {
  browserSync.reload();
}

function watch() {
  browserSync.init({
    open: false,
    server: {
      baseDir: "app",
      serveStaticOptions: {
        extensions: ["html"]
      }
    },

    open: false
  });

  gulp.watch(files.scss).on('change', style);
  gulp.watch("app/*").on('change', reload);
}

exports.watch = watch
exports.style = style;

var build = gulp.parallel(style, watch);

gulp.task('build', build);
gulp.task('default', build);

