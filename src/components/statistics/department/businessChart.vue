<template>
  <div>
    <div id="wtsPie" :style="{height:height,width:width,float:float}" v-if="list!=''"></div>
    <div id="djhsPie" :style="{height:height,width:width,float:float}" v-if="list!=''"></div>
    <div id="tsPie" :style="{height:height,width:width,float:float}" v-if="list!=''"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import echarts from 'echarts'
  Vue.prototype.$echarts = echarts
  export default {
    name:"overdueChart",//超期统计图表
    props:{
      list:{
        type:Array,
        required: true
      },
      sum:{
        type:String,
        required: true,
      },
      height:{
        type:String,
        required: true
      },
      width:{
        type:String,
        required: true
      }
    },
    data() {
      return {
        title:"",
        float:"left",
        nameList:[],
        wtsList:[],//委托数list
        djhsList:[],//登记号数list
        tsList:[],//套数list
      }
    },
    methods:{
      initData(){
        if(this.sum=="1"){//title
          this.title="部门";
          for(let i=0;i<this.list.length;i++){
            this.nameList.push(this.list[i].departName);//部门名
            this.wtsList.push({value:this.list[i].wts,name:this.list[i].departName});//委托数list
            this.djhsList.push({value:this.list[i].djhs,name:this.list[i].departName});//登记号数list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].departName});//套数list
          }
        }else{
          this.title="岗位";
          for(let i=0;i<this.list.length;i++){
            this.nameList.push(this.list[i].postName);//岗位名
            this.wtsList.push({value:this.list[i].wts,name:this.list[i].postName});//委托数list
            this.djhsList.push({value:this.list[i].djhs,name:this.list[i].postName});//登记号数list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].postName});//套数list
          }
        }

      },
      drawWtsPie(){//委托数
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('wtsPie'))
        // 绘制图表
        myChart.setOption({
          title : {
            text:this.title+'委托数',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient : 'vertical',
            x : 'left',
            data:this.nameList,
          },
          calculable : true,
          series : [
            {
              name:'委托数',
              type:'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:this.wtsList,
            }
          ]
        });
      },
      drawDjhsPie(){//登记号数
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('djhsPie'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'登记号数',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient : 'vertical',
            x : 'left',
            data:this.nameList,
          },
          calculable : true,
          series : [
            {
              name:'登记号数',
              type:'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:this.djhsList,
            }
          ]
        });
      },
      drawTsPie(){//套数
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('tsPie'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'套数',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient : 'vertical',
            x : 'left',
            data:this.nameList,
          },
          calculable : true,
          series : [
            {
              name:'套数',
              type:'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:this.tsList,
            }
          ]
        });
      },
    },
    mounted(){
      this.initData();
      this.drawWtsPie();
      this.drawDjhsPie();
      this.drawTsPie();
    },
  }
</script>

<style scoped>

</style>
