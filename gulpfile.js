const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');
const merge = require('merge-stream');
const changed = require('gulp-changed');
const browserSync = require('browser-sync').create();

const devPath = './src';
const distPath = './dist';

gulp.task('browser-sync', () => {

    // .init 启动服务器
    browserSync.init({
        server: {
            baseDir: distPath
        },
        port: 8091,
        notify: false, //刷新是否提示
        open: false //是否自动打开页面
    });
})
//buildPack
gulp.task('buildPack', () => {
    let buildHtml = gulp.src([`${devPath}/html/*.html`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/html`));

    let buildStyles = gulp.src([`${devPath}/sass/*.scss`])
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(`${distPath}/css/`));

    let buildPagesJs = gulp.src([`${devPath}/js/**/*.js`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/js/`));

    let buildVendorJs = gulp.src([`${devPath}/js/vendor/**/*`])
        .pipe(plumber())
        .pipe(gulp.dest(`${distPath}/js/vendor/`));
    return merge(buildHtml, buildStyles, buildPagesJs, buildVendorJs);
})

//packWatch
gulp.task('packWatch', () => {
    let watchHtml = watch(`${devPath}/html/*.html`, () => {
        gulp.src(`${devPath}/html/*.html`)
            .pipe(plumber())
            .pipe(changed(`${distPath}/html`, {
                hasChanged: changed.compareContents
            }))
            .pipe(gulp.dest(`${distPath}/html/`));
    })
    let watchStyle = watch(`${devPath}/sass/**/*.scss`, () => {
        gulp.src(`${devPath}/sass/*.scss`)
            .pipe(plumber())
            .pipe(sass())
            .pipe(changed(`${distPath}/css`))
            .pipe(gulp.dest(`${distPath}/css/`));
    })
    let watchJs = watch(`${devPath}/js/pages/**/*.js`, () => {
        gulp.src(`${devPath}/js/pages/**/*.js`)
            .pipe(plumber())
            // .pipe(changed(`${distPath}/js/pages/`))
            .pipe(changed(`${distPath}/js`, {
                hasChanged: changed.compareContents
            }))
            .pipe(gulp.dest(`${distPath}/js/pages/`));
    })
    return merge(watchHtml, watchStyle, watchJs);
})

gulp.task('default', ['buildPack', 'packWatch', 'browser-sync'], () => {
    gulp.watch([
            `${distPath}/**/*.+(css|js|png|jpg|ttf|html)`
        ])
        .on('change', browserSync.reload);
})