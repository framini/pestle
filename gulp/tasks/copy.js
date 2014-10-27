var gulp = require('gulp');

gulp.task('copy', function() {
    return gulp.src('./build/pestle.js')
               .pipe(gulp.dest('dist'))
});