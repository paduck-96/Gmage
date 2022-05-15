import gulp from "gulp";
import del from "del";
import babel from "gulp-babel";
import pug from "gulp-pug";
import gulpsass from "gulp-sass";
import scss from "sass";
import nodemon from "gulp-nodemon";
import autoprefixer from "gulp-autoprefixer";
import minifyCss from "gulp-csso";

const sass = gulpsass(scss);

const routes = {
  js: {
    src: "assets/js/main.js",
    dest: "src/static/js",
    watch: "assets/js/**/*.js",
  },
  style: {
    src: "assets/scss/styles.scss",
    dest: "src/static/styles",
    watch: "assets/scss/**/*.scss",
  },
  pug: {
    src: "src/views/**/*.pug",
    dest: "build/views",
    watch: "src/views/**/*.pug",
  },
};

/*
 * task 작성
 */

// 시작 작업
function clean() {
  return del(["src/static"]);
} //삭제

//file 정리
function scripts() {
  return gulp.src(routes.js.src).pipe(babel()).pipe(gulp.dest(routes.js.dest));
} //js파일 dest로 babel(최신화)
/* function views() {
  return gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));
} //pug파일 dest로 변환 */
function styles() {
  return gulp
    .src(routes.style.src)
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(minifyCss())
    .pipe(gulp.dest(routes.style.dest));
} //sass 파일 변환하기

//실시간 반영
function change() {
  gulp.watch(routes.js.watch, scripts);
  /* gulp.watch(routes.pug.watch, views); */
  gulp.watch(routes.style.watch, styles);
}
function modify() {
  return nodemon({ script: process.cwd() + "/src/init.js" });
}

export const build = gulp.series(
  clean,
  gulp.series(scripts, /* views, */ styles),
  modify,
  change
);
