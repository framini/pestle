var gulp = require('gulp');
var coffeelint = require('gulp-coffeelint');
var config = require('../config/general');

gulp.task('lint', function () {
    return gulp.src(config.paths.src + '/*.coffee')
        .pipe(coffeelint(config.files.coffeelint))
        .pipe(coffeelint.reporter())
});