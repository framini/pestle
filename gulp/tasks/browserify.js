var derequire      = require('gulp-derequire');
var browserify     = require('browserify');
var watchify       = require('watchify');
var bundleLogger   = require('../util/bundleLogger');
var gulp           = require('gulp');
var handleErrors   = require('../util/handleErrors');
var source         = require('vinyl-source-stream');
var generalConfig  = require('../config/general');
var config         = require('../config/browserify');
var coffeelint     = require('gulp-coffeelint');

gulp.task('browserify', ['testing'], function(callback) {

  var bundleQueue = config.bundleConfigs.length;

  var browserifyThis = function(bundleConfig) {

    var bundler = browserify({
      // Required watchify args
      cache: {}, packageCache: {}, fullPaths: true,
      // Specify the entry point of the app
      entries: bundleConfig.entries,
      // Add file extentions to make optional in require calls
      extensions: config.extensions,
      // Enable/disable source maps
      debug: config.debug,

      standalone: config.moduleName
    });

    var bundle = function() {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName);

      return bundler
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specifiy the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))
        // replace require calls
        .pipe(derequire())
        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished);
    };

    if(global.isWatching) {
      // Wrap with watchify and rebundle on changes
      bundler = watchify(bundler);
      // Rebundle on update
      bundler.on('update', bundle);

      bundler.on('update', function() {
          gulp.src(generalConfig.paths.src + '/*.coffee')
              .pipe(coffeelint(generalConfig.files.coffeelint))
              .pipe(coffeelint.reporter())
      });
    }

    var reportFinished = function() {
      // Log when bundling completes
      bundleLogger.end(bundleConfig.outputName)

      if(bundleQueue) {
        bundleQueue--;
        if(bundleQueue === 0) {
          // If queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          callback();
        }
      }
    };

    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  config.bundleConfigs.forEach(browserifyThis);
});
