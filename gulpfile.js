
var gulp = require('gulp')
var concat = require('gulp-concat'); //引用
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

//监听所有打包之后的文件变动，自动刷新页面
gulp.task('watch', function () {
  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['src/**']).on('change', livereload.changed);
});

gulp.task('default', ['js', 'watch']);