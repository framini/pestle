var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('uglify', function() {
  return gulp.src('./build/pestle.js')
    .pipe(uglify())
    .pipe(rename('pestle.min.js'))
    .pipe(gulp.dest('dist'))
});