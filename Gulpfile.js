var gulp = require('gulp')
var del = require('del')
var webpack = require('webpack-stream')
var named = require('vinyl-named')
var replace = require('gulp-replace')
var zip = require('gulp-zip')

const pkg = require('./package.json')
const name = pkg.name
const version = pkg.version

const exportRoot = 'dist'
const exportDir = exportRoot + '/' + name

function clean(cb) {
    del([exportRoot + '/**/*']).then(() => cb())
}

function html() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest(exportDir))
}

function img() {
    return gulp.src('app/img/**/*')
        .pipe(gulp.dest(exportDir + '/img'))
}

function js() {
    return gulp.src(['app/js/bg.js', 'app/js/options.js', 'app/js/page.js'])
        .pipe(named())
        .pipe(webpack({
            mode: 'production'
        }))
        .pipe(gulp.dest(exportDir + '/js'))
}

function css() {
    return gulp.src('app/css/**/*')
        .pipe(gulp.dest(exportDir + '/css'))
}

function doc() {
    return gulp.src(['README.md', 'Changelog.md'])
        .pipe(gulp.dest(exportDir))
}

function asset() {
    return gulp.src(['app/favicon.ico'])
        .pipe(gulp.dest(exportDir))
}

function manifest() {
    return gulp.src('app/manifest.json')
        .pipe(replace('{version}', version))
        .pipe(gulp.dest(exportDir))
}

function pack() {
    var filename = name + '-' + version + '.zip'
    return gulp.src(exportDir + '/**/*', {
            base: exportRoot
        })
        .pipe(zip(filename))
        .pipe(gulp.dest(exportRoot))
}

var files = gulp.parallel(js, css, img, html, doc, asset, manifest)
var build = gulp.series(files, pack)

exports.asset = asset
exports.css = css
exports.doc = doc
exports.html = html
exports.img = img
exports.js = js
exports.manifest = manifest
exports.files = files
exports.pack = pack
exports.build = build

exports.clean = clean
exports.default = files