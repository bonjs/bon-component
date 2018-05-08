
var gulp = require('gulp')
var concat = require('gulp-concat'); //����
var livereload = require('gulp-livereload');

var jsFiles = [
	'src/extend.js',
	'src/observable.js',
	'src/component.js',
	'src/index.js',
];
gulp.task('js', function () {
    gulp.src(jsFiles) 
		.pipe(concat('index.js'))
        .pipe(gulp.dest('dest/'));
});

//�������д��֮����ļ��䶯���Զ�ˢ��ҳ��
gulp.task('watch', function () {
  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['src/**']).on('change', livereload.changed);
});

gulp.task('default', ['js', 'watch']);