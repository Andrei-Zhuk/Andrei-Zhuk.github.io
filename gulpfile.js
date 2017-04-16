var gulp = require("gulp");
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var webpack = require('webpack');

gulp.task('watch', function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: "./"
        }
    })

    watch('./index.html', function () {
        browserSync.reload();
    });
    watch('./css/**/*.css', function () {
        gulp.start('cssInject')
    })
    watch('./js/**/*.js', function () {
        gulp.start('scriptsRefresh')
    })
})

gulp.task('cssInject', function () {
    return gulp.src('./css/style.css')
        .pipe(browserSync.stream())
})

gulp.task('scriptsRefresh', ['scripts'], function () {
    browserSync.reload()
})

gulp.task('scripts', function (callback) {
    webpack(require('./webpack.config.js'), function (err, stats) {
        if (err) {
            console.log(err.toString());
        }
        console.log((stats.toString()));
        callback();
    })
})
