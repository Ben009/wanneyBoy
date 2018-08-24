<template>
  <div>
      <div id="ssBar" :style="{height:height,width:width,float:float}"></div>
      <div id="tsBar" :style="{height:height,width:width,float:float}"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import echarts from 'echarts'
  Vue.prototype.$echarts = echarts
  export default {
    name:"outputChart",//业务产值图表
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
        tsList:[],//套数list
      }
    },
    methods:{
      initData(){
        if(this.sum=="1"){//title
          this.title="客户";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].companyName);
            this.ssList.push({value:this.list[i].totalActual,name:this.list[i].companyName});//实收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].companyName});//套数list
          }
        }else if(this.sum=="2"){
          this.title="行政区划";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].PROVINCE);
            this.ssList.push({value:this.list[i].totalActual,name:this.list[i].PROVINCE});//实收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].PROVINCE});//套数list
          }
        }else if(this.sum=="3"){
          this.title="业务组";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].ywz);
            this.ssList.push({value:this.list[i].totalActual,name:this.list[i].ywz});//实收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].ywz});//套数list
          }
        }else if(this.sum=="4"){
          this.title="业务员";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].ywy);
            this.ssList.push({value:this.list[i].ss,name:this.list[i].ywy});//实收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].ywy});//套数list
          }
        }

      },
      drawSsBar(){//实收
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('ssBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'实收',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['实收']
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
              name:'实收',
              type:'bar',
              data:this.ssList,
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
      drawTsBar(){//套数
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('tsBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'套数',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['套数']
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
              name:'套数',
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
      this.drawSsBar();
      this.drawTsBar();
    },
  }
</script>

<style scoped>

</style>
