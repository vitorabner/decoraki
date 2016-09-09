'use strict';

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var svgmin = require('gulp-svgmin');
var rename = require('gulp-rename');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var order = require('gulp-order');
var es = require('event-stream');
var compress = require('compression');
var path = require('path');
var htmlReplace = require('gulp-html-replace');

//- Libraries
var lib = {
    min: ['lib/three.js/build/three.min.js', 'lib/handlebars/handlebars.runtime.min.js', 'lib/isMobile/isMobile.min.js'],
    src: ['lib/colladaLoader/index.js', 'lib/detector/index.js']
};

//- HTML
var htmlIdx = ['src/index.html'];
var html = ['src/**/*.html'];

//- SASS
var scssIdx = ['src/scss/index.scss'];
var scss = ['src/scss/**/*.scss'];

//- Images
var img = ['src/images/**/*', '!src/images/**/*.svg'];

//- SVG
var svg = ['src/images/**/*.svg'];

//- Handlebars
var hbs = {
    templates: ['src/handlebars/templates/**/*.hbs'],
    partials: ['src/handlebars/partials/**/*.hbs']
};

//- Javascript
var js = [
    'src/javascript/helpers/**/*.js',
    'src/handlebars/**/*.js',
    'src/javascript/control/**/*.js',
    'src/javascript/models/**/*.js',
    'src/javascript/scene/**/*.js',
    'src/javascript/simulator/**/*.js',
    'src/javascript/settings/**/*.js',
    'src/javascript/app.js',
];


//- Images tasks
gulp.task('img', function() {
    return gulp.src(img)
                .pipe(imagemin())
                .pipe(gulp.dest('dist/img'));
});

gulp.task('svg', function () {
    return gulp.src(svg)
                .pipe(svgmin())
                .pipe(gulp.dest('dist/img'));
});

//- Handlebars tasks
gulp.task('hbs', function () {
    var partials = gulp.src(hbs.partials)
            .pipe(handlebars())
            .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
                imports: {
                    processPartialName: function(fileName) {
                        return JSON.stringify(path.basename(fileName, '.js').substr(1));
                    }
                }
            }));

    var templates = gulp.src(hbs.templates)
            .pipe(handlebars())
            .pipe(wrap('Handlebars.template(<%= contents %>)'))
            .pipe(declare({
                namespace: 'decoraki.templates',
                noRedeclare: true
            }));

    return es.merge([partials, templates])
                .pipe(concat('all.hbs.js'))
                .pipe(gulp.dest('dist/temporary-cache/hbs/'));
});

//- Javascript tasks
gulp.task('lib', function() {
    var min = gulp.src(lib.min)
                .pipe(concat('min.js'));

    var src = gulp.src(lib.src)
                .pipe(concat('src.js'))
                .pipe(uglify());

    return es.merge([min, src])
                .pipe(order(['min.js', 'src.js']))
                .pipe(concat('index.min.js'))
                .pipe(gulp.dest('dist/lib/'));
});

gulp.task('js', ['lib', 'hbs'], function() {
    js.unshift('dist/temporary-cache/hbs/**/*.js');

    return gulp.src(js)
                .pipe(concat('index.min.js'))
                .pipe(sourcemaps.init())
                .pipe(uglify())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('dist/js/'))
                .on('end', function() {
                    del.sync(['./dist/temporary-cache']);
                });
});


gulp.task('prod-js', ['lib', 'hbs'], function() {
    js.unshift('dist/temporary-cache/hbs/**/*.js');
    js.unshift('dist/lib/**/*.js');

    return gulp.src(js)
                .pipe(concat('index.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('dist/js/'))
                .on('end', function() {
                    del.sync(['./dist/temporary-cache']);
                    del.sync(['./dist/lib']);
                });
});

//- SASS tasks
gulp.task('sass', function() {
    return gulp.src(scssIdx)
                .pipe(sourcemaps.init())
                .pipe(sass({outputStyle: 'compressed'}))
                .pipe(rename({basename: 'index.min'}))
                .pipe(autoprefixer({browsers: ['last 2 versions']}))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('dist/css/'));
});

gulp.task('prod-sass', function() {
    return gulp.src(scssIdx)
                .pipe(sass({outputStyle: 'compressed'}))
                .pipe(rename({basename: 'index.min'}))
                .pipe(autoprefixer({browsers: ['last 2 versions']}))
                .pipe(gulp.dest('dist/css/'));
});

//- HTML tasks
gulp.task('html', function() {
    return gulp.src(htmlIdx)
                .pipe(htmlReplace({
                    'js': ['lib/index.min.js', 'js/index.min.js'],
                    'css': 'css/index.min.css'
                }))
                .pipe(gulp.dest('dist/'));
});

gulp.task('prod-html', function() {
    return gulp.src(htmlIdx)
                .pipe(htmlReplace({
                    'js': ['js/index.min.js'],
                    'css': 'css/index.min.css'
                }))
                .pipe(gulp.dest('dist/'));
});

//- Sync tasks
gulp.task('bsync', function() {
    browserSync.init('dist/**/*',{
        server: {
            baseDir: './dist/',
            middleware: [compress()]
        },
        startPath: "/"
    });
});

gulp.task('watch', ['bsync'], function() {
    var hbspt = hbs.partials.concat(hbs.templates);

    gulp.watch(js, ['js']);
    gulp.watch(hbspt, ['js']);
    gulp.watch(img, ['img']);
    gulp.watch(svg, ['svg']);
    gulp.watch(scss, ['sass']);
    gulp.watch(html, ['html']);
});

gulp.task('clean', function() {
    del.sync(['./dist']);
});

gulp.task('dev', ['clean'], function() {
    gulp.start('html', 'img', 'svg', 'sass', 'js');
});

gulp.task('prod', ['clean'], function() {
    gulp.start('prod-html', 'prod-sass', 'prod-js', 'img', 'svg');
});
