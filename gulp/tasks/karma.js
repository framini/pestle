var gulp   = require('gulp');
var karma  = require('karma').server;

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/../config/karma.js',
    autoWatch: true,
    singleRun: false
  }, done);
});

gulp.task('continuous', function (done) {
  karma.start({
    configFile: __dirname + '/../config/karma.js'
  }, done);
});