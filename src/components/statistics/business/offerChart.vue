<template>
  <div>
    <div id="tsBar" :style="{height:height,width:width,float:float}"></div>
    <div id="ysBar" :style="{height:height,width:width,float:float}"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import echarts from 'echarts'
  Vue.prototype.$echarts = echarts
  export default {
    name:"offerChart",//报价统计图表
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
        ysList:[],//应收list
        tsList:[],//套数list
      }
    },
    methods:{
      initData(){
        if(this.sum=="1"){//title
          this.title="业务组";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].businessGroup);
            this.ysList.push({value:this.list[i].ys,name:this.list[i].businessGroup});//应收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].businessGroup});//套数list
          }
        }else if(this.sum=="2"){
          this.title="业务员";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].userName);
            this.ysList.push({value:this.list[i].ys,name:this.list[i].userName});//应收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].userName});//套数list
          }
        }else if(this.sum=="3"){
          this.title="客户";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].companyName);
            this.ysList.push({value:this.list[i].ys,name:this.list[i].companyName});//应收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].companyName});//套数list
          }
        }
      },
      drawYsBar(){//报价应收
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('ysBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'报价应收',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['报价应收']
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              data : this.nameList,
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'报价应收',
              type:'bar',
              data:this.ysList,
              markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              }
            }
          ]
        });
      },
      drawTsBar(){//报价套数
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('tsBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'报价套数',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['报价套数']
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              data : this.nameList,
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'报价套数',
              type:'bar',
              data:this.tsList,
              markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              }
            }
          ]
        });
      },
    },
    mounted(){
      this.initData();
      this.drawYsBar();
      this.drawTsBar();
    },
  }
</script>

<style scoped>

</style>
