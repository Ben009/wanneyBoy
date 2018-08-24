import {printHtml} from '@/components/util/printHtml.js';
/**
 * TODO 案例 涉及到窗口大小变化 触发事件请使用  监听 watch实现
 * 
  watch:{
       innerHeight(v){//高度变化触发
           //写入触发的事件方法
       },
       innerWidth(v){//宽度变化触发
           //写入触发的事件方法
       },
  },
 */
export default { 
    methods:{
        getWindowParam(isCer){ 
            this.$store.commit("SET_window_innerHeight",window.innerHeight);
            this.$store.commit("SET_window_innerWidth",window.innerWidth);
            this.$store.commit('SET_DIALOG_SIZE',{ width:window.innerWidth , height:window.innerHeight});//计算弹出框的大小
            this.$store.commit('SET_TAG_HEIGHT',window.innerWidth);//计算右侧tab页高度
           if(isCer=="true"){
                this.$store.commit("SET_isCertificatIframe",true);
           } 
        },
        /**
         * 打印工具类
         * @param {*} templet_name  模板名称
         * @param {*} data 数据 
         * @param {*} rq 是否容器打印  0容器打印，1预览，2页面打印
         */
        printHtml(templet_name,data,rq){
            printHtml(templet_name,data,rq);
        }
    },
    computed:{
        QJTableMaxHeight(){
            let p=this.$store.state.admin.window_innerHeight;
            let isCertificatIframe=this.$store.state.admin.isCertificatIframe;
            if(isCertificatIframe){
                return   p;
            }else{
                return   p-200;
            } 
        },
        innerHeight(){
            return this.$store.state.admin.window_innerHeight;
        },
        innerWidth(){
            return this.$store.state.admin.window_innerWidth;
        }
    },
    mounted(){
/*         if(this.$store && this.$store.commit){
            this.$store.commit("SET_window_innerHeight",window.innerHeight);
            this.$store.commit("SET_window_innerWidth",window.innerWidth);
        }  */
    }
}
