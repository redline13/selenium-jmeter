var gulp = require('gulp');
var zip = require('gulp-zip');

var meta = {
  watch: ['./chrome.manifest','install.rdf','./content/**/*.*','defaults/**/*.*','locale/**/*.*'],
	xpiName: 'jmeter.xpi'
};

var files = ['manifest.json', 'background.js'];

gulp.task('default', ['build','package']);

gulp.task('build', function () {
	gulp.src('./content/**/*.*')
		.pipe(gulp.dest('./build/chrome/content/'));
	gulp.src('./locale/**/*.*')
		.pipe(gulp.dest('./build/chrome/locale/'));
	gulp.src('./defaults/**/*.*')
		.pipe(gulp.dest('./build/defaults/'));
	gulp.src(['./chrome.manifest','install.rdf'])
		.pipe(gulp.dest('./build/'));
});

gulp.task('package', function () {
  gulp.src('./build/**')
    .pipe(zip(meta.xpiName))
    .pipe(gulp.dest('.'));
});

gulp.task('distribute', function(){
  // TODO build deployable FF extension
});

gulp.task('watch', function() {
  gulp.watch(meta.watch, ['build']);
});
