import gulp from "gulp";
import del from "del";
import babel from "gulp-babel";
import pug from "gulp-pug";
import gulpsass from "gulp-sass";
import scss from "sass";
import nodemon from "gulp-nodemon";
import autoprefixer from "gulp-autoprefixer";
import minifyCss from "gulp-csso";
import bro from "gulp-bro";
import bbel from "babelify";

const sass = gulpsass(scss);

const routes = {
  babel1: {
    src: "models/*.js",
    dest: "src/static/models",
  },
  babel2: {
    src: "src/*.js",
    dest: "src/static",
  },
  babel3: {
    src: "src/routers/*.js",
    dest: "src/static/routers",
  },
  babel4: { src: "src/controllers/*.js", dest: "src/static/controllers" },
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
    dest: "src/static/views",
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
  /* return gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          bbel.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));
    */
} //js파일 dest로 babel(최신화)
function views() {
  return gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));
} //pug파일 dest로 변환 */
function styles() {
  return gulp
    .src(routes.style.src)
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(minifyCss())
    .pipe(gulp.dest(routes.style.dest));
} //sass 파일 변환하기

//실시간 반영
function change() {
  gulp.watch(routes.js.watch, scripts);
  gulp.watch(routes.pug.watch, views);
  gulp.watch(routes.style.watch, styles);
}
/*
function modify() {
  return nodemon({ script: process.cwd() + "/src/static/init.js" });
} //ignore 옵션 넣어주기
*/

export const build = gulp.series(
  clean,
  gulp.parallel(scripts, views, styles),
  change
);
