var gulp = require('gulp'),

	server = require('browser-sync'),
	del = require('del'),
	sequence = require('run-sequence'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	filter = require('gulp-filter'),
	run = require('gulp-run'),

	htmlmin = require('gulp-minify-html'),

	less = require('gulp-less'),
	cssmin = require('gulp-minify-css'),
	prefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),

	useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),

	imagemin = require('gulp-imagemin'),
	spritesheet = require('gulp-svg-sprite');


/* ____________________________________________________________________________________ SERVER */

gulp.task('server', function() {
	server.init(null, {
		server: {
			baseDir: 'www'
		},
		host: "0.0.0.0",
		port: "8000",
		notify: false
	});
});

var reload = server.reload;

var onError = function(err) {
	notify.onError({
		title: 'Gulp',
		subtitle: 'Failure!',
		message: 'Error: <%= error.message %>',
		sound: 'Tink'
	})(err);
	
	this.emit('end');
};


/* ____________________________________________________________________________________ CLEAN */

gulp.task('clean', function (callback) {
	del(['www/**/*'], callback);
});


/* ____________________________________________________________________________________ WATCH */

gulp.task('html', function() {
	return gulp.src(['dev/**/*.html'])
		.pipe(plumber({errorHandler: onError}))
		.pipe(gulp.dest('www'))
		.pipe(reload({stream:true}));
});

gulp.task('less', function(){
	return gulp.src(['dev/less/*.less'])
		.pipe(plumber({errorHandler: onError}))
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(prefixer('last 5 versions', 'ie 9'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('www/css'))
		.pipe(reload({stream:true}));
});

gulp.task('js', function(){
	return gulp.src(['dev/js/**/*.js'])
		.pipe(plumber({errorHandler: onError}))
		.pipe(gulp.dest('www/js'))
		.pipe(reload({stream:true}));
});

gulp.task('medias', function(){
	return gulp.src(['dev/medias/**/*'])
		.pipe(gulp.dest('www/medias'));
});

gulp.task('fonts', function(){
	return gulp.src(['dev/fonts/**/*'])
		.pipe(gulp.dest('www/fonts'));
});

gulp.task('images', function(){
	return gulp.src(['dev/img/**/*', '!dev/img/sprite/**/*', '!dev/img/sprite'])
		.pipe(gulp.dest('www/img'));
});

gulp.task('spritesheet', function() {
	return gulp.src('dev/img/sprite/**/*.svg', {cwd: '.'})
		.pipe(plumber())
		.pipe(spritesheet({
			"svg": {
				"xmlDeclaration": false,
				"doctypeDeclaration": false,
				"namespaceIDs": false,
				"dimensionAttributes": false
			},
			"shape": {
				"id": {
					"whitespace": '_'
				}
			},
			"mode": {
				"css": {
					"dest": "www/css",
					"prefix": ".icon-%s",
					"dimensions": true,
					"sprite": "../img/sprite.svg",
					"bust": false,
					"render": {
						"less": {
							"dest": "../../dev/less/imports/sprite"
						}
					}
				}
			}
		})).on('error', function(error){ console.log(error); })
		.pipe(gulp.dest('.'));
});

gulp.task('css', function(callback) {
	sequence(
		'spritesheet',
		'less',
	callback);
});

gulp.task('make', function(callback) {
	sequence(
		'clean',
		['css', 'images', 'fonts', 'medias', 'html', 'js'],
		'server',
	callback);
});

gulp.task('default', ['make'], function() {
	gulp.watch('dev/**/*.html', ['html']);
	gulp.watch('dev/less/**/*.less', ['less']);
	gulp.watch('dev/js/**/*.js', ['js']);
});


/* ____________________________________________________________________________________ DIST */

gulp.task('less-dist', function(){
	return gulp.src(['dev/less/*.less'])
		.pipe(less())
		.pipe(prefixer('last 5 versions', 'ie 9'))
		.pipe(cssmin({compatibility: 'ie9'}))
		.pipe(gulp.dest('www/css'));
});

gulp.task('html-dist', function() {
	return gulp.src(['dev/**/*.html'])
		.pipe(gulp.dest('www'));
});

gulp.task('js-dist', ['html-dist'], function() {
	var assets = useref.assets({searchPath: '.'});
	var htmlFilter = filter('**/*.html');
	var jsFilter = filter('**/*.js');

	return gulp.src(['dev/**/*.html'])
		.pipe(assets)
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(htmlFilter)
		.pipe(htmlmin())
		.pipe(htmlFilter.restore())
		.pipe(jsFilter)
		.pipe(uglify())
		.pipe(jsFilter.restore())
		.pipe(gulp.dest('www'));
});

gulp.task('images-dist', function(){
	return gulp.src(['dev/img/**/*', '!dev/img/sprite/**/*', '!dev/img/sprite'])
		.pipe(imagemin({
			multipass: true,
			interlaced: true,
			optimizationLevel: 7,
			svgoPlugins: [
				{ removeViewBox: true },
				{ removeUselessStrokeAndFill: true },
				{ removeEmptyAttrs: true }
			]
		}))
		.pipe(gulp.dest('www/img'))
		.pipe(run('imageOptim -j -a -q -d www/img/'));
		// IMAGE OPTIMIZER DESACTIVATED
});

gulp.task('css-dist', function(callback) {
	sequence(
		'spritesheet',
		['less-dist', 'images-dist'],
	callback);
});

gulp.task('dist', function(callback) {
	sequence(
		'clean',
		['css-dist', 'js-dist', 'fonts', 'medias'],
	callback);
});