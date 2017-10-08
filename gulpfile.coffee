gulp = require 'gulp'
minify = require 'gulp-clean-css'

### CSS ###
cssIn = ['node_modules/bootswatch/cosmo/bootstrap.min.css', 'assets/css/src/**/*.sass']
cssOut = ['assets/css', 'combined.min.css']

gulp.task 'css', () ->
	gulp.src cssIn
		.pipe(sass {
		errLogToConsole: true
		outputStyle: 'compressed'
	})
		.pipe(concat cssOut[1])
		.pipe(do minify)
		.pipe(gulp.dest cssOut[0])