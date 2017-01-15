'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');

const paths = {
  src: './src',
  build: './public'
}

gulp.task('bundle', ['js', 'scss', 'images', 'html'], () => {
  browserSync.init({
    server: {
      baseDir: paths.build
    },
    open: false,
    port: 3000,
  });

  gulp.watch(paths.src + '/scss/**/*.scss', ['scss']);
  gulp.watch(paths.src + '/images/*.*', ['images']);
  gulp.watch(paths.src + '/html/*.html', ['html']);
  gulp.watch(paths.src + '/**/*.js', ['js']);
  gulp.watch(paths.build + '/js/**/*').on('change', browserSync.reload);
});

gulp.task('js', () => {
  return browserify({
      entries: paths.src + '/js/app.js',
      debug: true
    })
    .transform("babelify", {
      plugins: ['react-html-attrs', 'transform-class-properties', 'transform-object-rest-spread', 'transform-decorators-legacy'],
      presets: ['es2015', 'react'],
      sourceMapsAbsolute: true
    })
    .bundle()
    .on('error', function (err) {
      console.error(err.stack);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(rename('app.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('jsmin', () => {
  return browserify({
      entries: paths.src + '/js/app.js',
      debug: false
    })
    .transform("babelify", {
      plugins: ['react-html-attrs', 'transform-class-properties', 'transform-object-rest-spread', 'transform-decorators-legacy'],
      presets: ['es2015', 'react'],
      sourceMapsAbsolute: false
    })
    .bundle()
    .on('error', function (err) {
      console.error(err.stack);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename('app.js'))
    .pipe(sourcemaps.init({ loadMaps: false }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('scss', () => {
  return gulp.src(paths.src + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(concat('bundle.css'))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest(paths.build + '/css'))
    .pipe(browserSync.stream());
});

gulp.task('css', () => {
  return gulp.src(paths.src + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename('styles.css'))
    .pipe(gulp.dest(paths.build + '/css'));
});

gulp.task('images', () => {
  return gulp.src(paths.src + '/images/*')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.build + '/images'));
});

gulp.task('html', () => {
  return gulp.src(paths.src + '/html/index.html')
    .pipe(plumber())
    .pipe(gulp.dest(paths.build));
});

gulp.task('clean', function () {
    return gulp.src('public', { read: false })
      .pipe(plumber())
      .pipe(clean());
});

gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('default', ['bundle']);  // development
gulp.task('deploy', ['apply-prod-environment', 'html', 'css', 'jsmin', 'images']);  // production
