const { src, dest, parallel, series, watch } = require('gulp');


const browserSync     = require('browser-sync').create();
const concat          = require('gulp-concat');
const autoprefixer    = require('gulp-autoprefixer');
const scss            = require('gulp-sass')(require('sass'));
const uglify          = require('gulp-uglify-es').default;
const imagemin        = require('gulp-imagemin');
const newer           = require('gulp-newer');
const del             = require('del');


// const cleancss = require('gulp-clean-css'); 55:00


function browsersync() {
    browserSync.init({
        server: {baseDir: 'app/'},
        online: true,
        notify: false
    })
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'app/js/main.js',
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream())    
}

function styles() {
    return src('app/scss/style.scss')
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions'], grid: true}))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream())
}


function images() {
	return src('app/images/src/**/*')
    .pipe(newer('app/images/dest/'))
    .pipe(imagemin())
    .pipe(dest('app/images/dest/'))
}

function cleanimg() {
    return del('app/images/dest/**/*', { force:true })
}

function cleandist() {
    return del('dist/**/*', { force:true })
}

function build() {
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/images/dest/**/*',
        'app/**/*.html',
    ], { base: 'app' })
    .pipe(dest('dist'));
}


function startwatch() {
    watch ('app/scss/**/*.scss', styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch('app/**/*.html').on('change', browserSync.reload);
    watch('app/images/src/**/*', images);
}


exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.build       = series(cleandist, styles, scripts, images, build);


exports.default      = parallel(styles, scripts, browsersync, startwatch);