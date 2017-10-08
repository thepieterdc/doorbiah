gulp = require 'gulp'
babel = require 'gulp-babel'
concat = require 'gulp-concat'
copy = require 'gulp-copy'
merge = require 'merge2'
minify = require 'gulp-clean-css'
sass = require 'gulp-sass'
uglify = require 'gulp-uglify'

### CSS ###
cssIn = ['node_modules/bootswatch/cosmo/bootstrap.min.css', 'assets/css/src/**/*.sass']
cssOut = ['assets/css', 'combined.min.css']

### JS ###
jsIn = 'assets/js/src/**/*.js'
jsOut = ['assets/js', 'combined.min.js']
vendorIn = ['node_modules/jquery/dist/jquery.min.js']
vendorOut = ['assets/js', 'vendor.min.js']

gulp.task 'css', () ->
	gulp.src cssIn
		.pipe(sass {
		errLogToConsole: true
		outputStyle: 'compressed'
	})
		.pipe(concat cssOut[1])
		.pipe(do minify)
		.pipe(gulp.dest cssOut[0])

gulp.task 'js', () ->
	gulp.src(jsIn)
		.pipe(do babel)
		.pipe(concat jsOut[1])
#		.pipe(do uglify)
		.pipe(gulp.dest jsOut[0])
	
	gulp.src(vendorIn)
		.pipe(concat vendorOut[1])
		.pipe(gulp.dest vendorOut[0])

gulp.task 'watch', () ->
	gulp.watch cssIn, ['css']
	gulp.watch jsIn, ['js']
	gulp.watch vendorIn, ['js']

gulp.task 'default', ['css', 'js'], ->