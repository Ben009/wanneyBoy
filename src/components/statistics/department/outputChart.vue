<template>
  <div>
    <div id="ssPie" :style="{height:height,width:width,float:float}" v-if="list!=''"></div>
    <div id="ysPie" :style="{height:height,width:width,float:float}" v-if="list!=''"></div>
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
    name:"outputChart",//产值统计图表
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
        ssList:[],//实收list
        ysList:[],//应收list
        tsList:[],//套数list
      }
    },
    methods:{
      initData(){
        if(this.sum=="2"){//title
          this.title="部门";
          for(let i=0;i<this.list.length;i++){
            this.nameList.push(this.list[i].departName);//部门名
            this.ssList.push({value:this.list[i].ss,name:this.list[i].departName});//部门实收list
            this.ysList.push({value:this.list[i].ys,name:this.list[i].departName});//部门应收list
            this.tsList.push({value:this.list[i].zts,name:this.list[i].departName});//部门套数list
          }
        }else{
          this.title="岗位";
          for(let i=0;i<this.list.length;i++){
            this.nameList.push(this.list[i].postName);//岗位名
            this.ssList.push({value:this.list[i].ss,name:this.list[i].postName});//岗位实收list
            this.ysList.push({value:this.list[i].ys,name:this.list[i].postName});//岗位应收list
            this.tsList.push({value:this.list[i].zts,name:this.list[i].postName});//岗位套数list
          }
        }

      },
      drawSsPie(){//实收
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('ssPie'))
        // 绘制图表
        myChart.setOption({
          title : {
            text:this.title+'实收',
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
              name:'实收',
              type:'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:this.ssList,
            }
          ]
        });
      },
      drawYsPie(){//应收
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('ysPie'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'应收',
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
              name:'应收',
              type:'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:this.ysList,
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
      this.drawSsPie();
      this.drawYsPie();
      this.drawTsPie();
    },
  }
</script>

<style scoped>

</style>
