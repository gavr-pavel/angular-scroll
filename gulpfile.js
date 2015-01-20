var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var jshint = require('gulp-jshint');


gulp.task('lint', function() {
    return gulp.src('./angular-scroll.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('uglify', function () {
    return gulp.src('./angular-scroll.js')
        .pipe(uglify('angular-scroll.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('./'));
});


gulp.task('default', ['lint', 'uglify']);
