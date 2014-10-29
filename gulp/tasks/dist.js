var gulp = require('gulp');

gulp.task('dist', ['setDist', 'copy', 'uglify']);