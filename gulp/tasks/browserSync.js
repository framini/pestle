var browserSync = require('browser-sync');
var gulp        = require('gulp');
var config      = require('../config/browsersync');

gulp.task('browserSync', ['build'], function() {
  return browserSync(config);
});
