<template>
  <div>
  </div>
</template>

<script>
  //存放iframe对象用于外部调用的一个
  let iframeObj=null;
  import Vue from 'vue';
  import $ from 'jquery';
  import vueBus from 'vue-bus';
  var urls=null;
  Vue.use(vueBus);
    export default {
        name: "Iframe",
        props:['src'],
        data() {
            return {
                /** 配置一个默认加载等待页面 */
                url:null ,//'http://192.168.1.110:8081/back/druid/weburi.html',
            }
        },
        watch: {
          "$route": function (to, from) {            
            let ps=to.meta['url'];
            this.url = ps;
        　　},
          targetUrl(){
            this.addIframe()
          },
          iframeHeight(){
            $(`.tbs_info .iframeClass`).each((index,val) => {
              $(val).css('height',this.iframeHeight); 
            })
          },
        },
        methods:{
          addIframe(){
            let currentComp = null,
                currentCompId = $(`.tbs_info .iframeClass.${this.$route.meta.id}`);
            if(!(currentCompId.length)){
              currentComp = Vue.extend({
                template: `<iframe id="${this.$route.meta.id}" name="${this.$route.meta.id}" class="iframeClass ${this.$route.meta.id}" :style="{height:${this.iframeHeight}+'px'}" src="${this.targetUrl}"></iframe>`
              })
              if(this.targetUrl) {
                let instance = new currentComp().$mount();
                $($(".tbs_info")[0]).append(instance.$el); 
              }
            }
            $(`.tbs_info .iframeClass`).each((index,val) => {
              $(val).css('display','none'); 
            })
            $($(`.tbs_info .iframeClass.${this.$route.meta.id}`)[0]).css('display','block')
            setTimeout(val => {
              try{
                if($('#'+this.$route.meta.id)[0].contentWindow.globalEvents){
                  let tempEvents = $('#'+this.$route.meta.id)[0].contentWindow.globalEvents;
                  tempEvents['_activated'](tempEvents['_this'])
                }
              }catch(e){
              }
            },0)
          }
        },
        computed:{
            iframeHeight(){
                return this.$store.state.admin.window_innerHeight-110;
            },
            targetUrl(){
                try{
                    if(this.url && this.url.indexOf("http://certificate.html")!=-1){
                      return this.url.replace("http://","");
                    }else if(this.url && this.url.indexOf("http://njmind")!=-1){
                      return this.url.replace("http://","/");
                    }else{
                      return this.url;
                    }
                }catch(e){
                    console.log("Iframe-src",this.url);
                    return "";
                }
            },
            cachedViews(){
              return this.$store.state.tagViews.cachedViews
            },
        },
        mounted () {
          this.url = '';
          let ps=this.$route.meta['url'];
          this.url = ps;
        },
        destroyed () {
          $(`.tbs_info .iframeClass`).each((index,val) => {
            $(val).css('display','none'); 
          })
        },
        beforeRouteEnter(to,from,next){
          next(vm => {
            if(vm.cachedViews.includes(from.meta.compName)){
              setTimeout(val => {
                try{
                  if($('#'+vm.$route.meta.id)[0].contentWindow.globalEvents){
                    let tempEvents = $('#'+vm.$route.meta.id)[0].contentWindow.globalEvents;
                    tempEvents['_activated'](tempEvents['_this'])
                  }
                }catch(e){
                }
              },0)
            }
          })
        },
        beforeRouteLeave(to,from,next){
          setTimeout(val => {
            if(this.cachedViews.includes(from.meta.compName)){
              try{
                if($('#'+from.meta.id)[0].contentWindow.globalEvents){
                  let tempEvents = $('#'+from.meta.id)[0].contentWindow.globalEvents;
                  tempEvents['_deactivated'](tempEvents['_this'])
                }
              }catch(e){
              }
            }
            next()
          },0)
        }
    }




</script>

<style scoped>

</style>
