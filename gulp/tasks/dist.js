var gulp = require('gulp');

gulp.task('dist', ['setDist', 'build', 'continuous', 'copy', 'uglify']);