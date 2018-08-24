// gulpfile.js
/**
   TODO 案例 elementUi 批量为css文件扩展命名空间 gulp 配置文件
 *     old：执行命令  gulp css-wrap  通过以下的路径配制自动压缩样式文件
 *     new: 执行命令  gulp 即可
 * gulp-css-wrap工具的使用——[批量为css文件扩展命名空间]
 * 参考文档 https://blog.csdn.net/young_emily/article/details/78596219
 * 
 * https://www.cnblogs.com/liangdaye/p/4956284.html
 * 压缩JS，CSS文件需要引用如下组件：
    gulp-minify-css: 压缩css
    gulp-jshint: 检查js
    gulp-uglify: 压缩js
    gulp-concat: 合并文件
    gulp-rename: 重命名文件
    gulp-clean: 清空文件夹
    gulp-notify:提示
 * 
 */
var path = require('path')
var gulp = require('gulp')
var gulp=require('gulp'),  //gulp基础库
    minifycss=require('gulp-minify-css'),   //css压缩
    concat=require('gulp-concat'),   //合并文件
    uglify=require('gulp-uglify'),   //js压缩
    rename=require('gulp-rename'),   //文件重命名
    //jshint=require('gulp-jshint'),   //js检查
    notify=require('gulp-notify');   //提示
var cleanCSS = require('gulp-clean-css')
var cssWrap = require('gulp-css-wrap')

//主题包路径
let ui_source_path='1D74B7';//样式原文件路径
let ui_mini_path='1d74b7';//项目中压缩后文件路径
let nameSpace='.custom-'+ui_mini_path;  //命名空间 


//证书主题包
//let ui_source_path='CERT';//样式原文件路径
//let ui_mini_path='ceriticateStyle';//项目中压缩后文件路径
//let nameSpace=".cerCommonStyle";//命名空间 

//gulp 默认执行配置
gulp.task('default',function(){
    gulp.start('minifycss');
});

//css处理
gulp.task('minifycss',function(){
   return gulp.src(path.resolve('./theme/'+ui_source_path+'/*.css'))      //设置css 访问路径
       .pipe(concat('index.css'))             //合并css文件到"index.css"
       .pipe(gulp.dest('theme/'+ui_source_path))       //设置输出路径
       .pipe(cssWrap({
        selector: nameSpace /* 添加的命名空间 */
       }))
       //.pipe(rename({suffix:'.min'}))       //修改文件名
       .pipe(minifycss())                     //压缩文件
       .pipe(gulp.dest('static/css/theme/'+ui_mini_path))        //输出文件目录
       .pipe(cleanCSS())
       .pipe(notify({message:'css task ok'}));//提示成功
});

/**  
gulp.task('css-wrap', function () {
  return gulp.src(path.resolve('./theme/1D74B7/index.css'))
    //找需要添加命名空间的css文件，支持正则表达式
    .pipe(cssWrap({
      selector: '.custom-1d74b7' //添加的命名空间
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('src/assets/css/theme/1d74b7')) //存放的目录
})
*/

/*
//JS处理 压缩 不在这里使用
gulp.task('minifyjs',function(){
   return gulp.src(['/static/js/juicer-min.js','/static/js/bootstrap.min.js','/static/js/bootstrap-datetimepicker.min.js','/static/js/order_query.js'])  //选择合并的JS
       .pipe(concat('order_query.js'))   //合并js
       .pipe(gulp.dest('dist/js'))         //输出
       .pipe(rename({suffix:'.min'}))     //重命名
       .pipe(uglify())                    //压缩
       .pipe(gulp.dest('dist/js'))            //输出 
       .pipe(notify({message:"js task ok"}));    //提示
});
*/

