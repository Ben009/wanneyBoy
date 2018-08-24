<template>
    <div name="kindeditor" style="width:99.9%;height: 500px;"></div>
</template>


<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import vueBus from 'vue-bus';
    import '../../util/Base.css'


    export default {
        name: "polregKindeEitor",
        components: {
            /** 模块对象 import 进来 后的别名  */
        },
        props: {

        },
        data() {
            //rentun中的变量仅针对当前组件有效
            return {
                /** sidtran:"兄弟组件间交互缓存变量",*/
            }
        },
        watch: {},
        mounted() {
            //加载KindEditor，再调用查询的方法
            this.loadJS(this.setKindEditorData)
        },
        methods: {
            loadJS(callBackFunction) {
                this.kindEditor = window.KindEditor.create('div[name="kindeditor"]');
                if (typeof callBackFunction == 'function') {
                    callBackFunction();
                }
            },

            getKindEditorData() {
                return this.kindEditor.html();
            },

            setKindEditorData(data) {
                this.kindEditor.html(data);
                this.kindEditor.focus();
            }
        },
        created() {
//            console.group('%c%s', 'color:blue', 'created 创建完毕状态》')
        }
    }
</script>

<style>

</style>
