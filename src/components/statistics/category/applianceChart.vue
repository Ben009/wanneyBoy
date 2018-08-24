<template>
  <div>
    <div id="ssBar" :style="{height:height,width:width,float:float}"></div>
    <div id="ysBar" :style="{height:height,width:width,float:float}"></div>
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
    name:"applianceChart",//计量器具统计图表
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
        if(this.sum=="1"){//title
          this.title="器具名称";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].applianceName);
            this.ssList.push({value:this.list[i].ss,name:this.list[i].applianceName});//实收list
            this.ysList.push({value:this.list[i].ys,name:this.list[i].applianceName});//应收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].applianceName});//套数list
          }
        }else if(this.sum=="2"){
          this.title="器具类别";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].categoryName);
            this.ssList.push({value:this.list[i].ss,name:this.list[i].categoryName});//实收list
            this.ysList.push({value:this.list[i].ys,name:this.list[i].categoryName});//应收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].categoryName});//套数list
          }
        }else if(this.sum=="3"){
          this.title="器具实际名称";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].realName);
            this.ssList.push({value:this.list[i].ss,name:this.list[i].realName});//实收list
            this.ysList.push({value:this.list[i].ys,name:this.list[i].realName});//应收list
            this.tsList.push({value:this.list[i].ts,name:this.list[i].realName});//套数list
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
      drawYsBar(){//应收
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('ysBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'应收',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['应收']
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
              name:'应收',
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
      this.drawYsBar();
      this.drawTsBar();
    },
  }
</script>

<style scoped>

</style>
