var gulp   = require('gulp');
var karma  = require('karma').server;

gulp.task('testing', ['lint'], function (done) {
  var settings = {
    configFile: __dirname + '/../config/karma.js'
  }

  if (global.isDev) {
    settings['autoWatch'] = true;
    settings['singleRun'] = false;
  }

  karma.start(settings, done);
});