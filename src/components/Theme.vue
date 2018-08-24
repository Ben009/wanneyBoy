<!--写在main.js中了，推荐使用vuex，其实不用也行-->
<!--

TODO 案例 elementUi 配置ui样式模板原始文件目录
    1、修改主体配置文件 /element-variable.scss 
    2、然后执行 et --out ./theme/[颜色]
       生成后的原始文件会有一个已经合并了的样式文件index.css
    3、接着执行 命令
       old：gulp css-wrap 规定作用域，同时执行压缩存放于指定文件中具体配置见gulpfile.js, 
       new: gulp 即可 
       然后在main.js中import，最好还是不要在这边引入，
       不过可以借助这种方式生成精简去重的css文件，然后自己拆分一下, 
       如果对网络延迟无所谓的话也可以不拆分，就是css大一点

-->
<!-- https://elementui.github.io/theme-preview/#/zh-CN 主题样式自动生成 
     样例参考文档 https://blog.csdn.net/young_Emily/article/details/78591261
     https://www.npmjs.com/package/element-theme
 -->
<template>

</template>

<script>
    export default {
        name: "theme"
    }
</script>

<style scoped>

</style>
