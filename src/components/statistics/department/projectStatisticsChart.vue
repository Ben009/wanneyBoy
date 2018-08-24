<template>
  <div>
    <div id="czyxrsBar" :style="{height:height,width:width,float:float}" v-if="list!=''&&sum=='1'"></div>
    <div id="czzrsBar" :style="{height:height,width:width,float:float}" v-if="list!=''&&sum=='1'"></div>
    <div id="jjgqrsBar" :style="{height:height,width:width,float:float}" v-if="list!=''&&sum=='1'"></div>
    <div id="czyxxmBar" :style="{height:height,width:width,float:float}" v-if="list!=''&&sum=='2'"></div>
    <div id="zczxmBar" :style="{height:height,width:width,float:float}" v-if="list!=''&&sum=='2'"></div>
    <div id="jjgqxmsBar" :style="{height:height,width:width,float:float}" v-if="list!=''&&sum=='2'"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import echarts from 'echarts'
  Vue.prototype.$echarts = echarts
  export default {
    name:"projectStatisticsChart",//项目统计图表
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
        czyxrsList:[],//持证有效人数list
        czzrsList:[],//持证总人数list
        jjgqrsList:[],//即将过期人数list
        czyxxmList:[],//持证有效项目list
        zczxmList:[],//总持证项目list
        jjgqxmsList:[],//即将过期项目数list
      }
    },
    methods:{
      initData(){
        if(this.sum=="1"){//title
          this.title="项目";
          let len="";
          if (this.list.length<20){
            len=this.list.length;
          }else{
            len=20;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].projectName);//项目名
            this.czyxrsList.push(this.list[i].czyxrs);//持证有效人数list
            this.czzrsList.push(this.list[i].czzrs);//持证总人数list
            this.jjgqrsList.push(this.list[i].jjgqrs);//即将过期人数list
            this.drawCzyxrsBar();
            this.drawCzzrsBar();
            this.drawJjgqrsBar();
          }
        }else{
          this.title="人员";
          let len="";
          if (this.list.length<10){
            len=this.list.length;
          }else{
            len=10;
          }
          for(let i=0;i<len;i++){
            this.nameList.push(this.list[i].userName);//人员名
            this.czyxxmList.push(this.list[i].czyxxm);//持证有效项目list
            this.zczxmList.push(this.list[i].zczxm);//总持证项目list
            this.jjgqxmsList.push(this.list[i].jjgqxms);//即将过期项目数list
            this.drawCzyxxmBar();
            this.drawZczxmBar();
            this.drawJjgqxmsBar();
          }
        }

      },
      drawCzyxrsBar(){//持证有效人数
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('czyxrsBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'持证有效人数',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['持证有效人数']
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
              name:'持证有效人数',
              type:'bar',
              data:this.czyxrsList,
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
      drawCzzrsBar(){//持证总人数
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('czzrsBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'持证总人数',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['持证总人数']
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
              name:'持证总人数',
              type:'bar',
              data:this.czzrsList,
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
    drawJjgqrsBar(){//即将过期人数
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('jjgqrsBar'))
      // 绘制图表
      myChart.setOption({
        title : {
          text: this.title+'即将过期人数',
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          data:['即将过期人数']
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
            name:'即将过期人数',
            type:'bar',
            data:this.jjgqrsList,
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
      drawCzyxxmBar(){//持证有效项目
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('czyxxmBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'持证有效项目',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['持证有效项目']
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
              name:'持证有效项目',
              type:'bar',
              data:this.czyxxmList,
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
      drawZczxmBar(){//总持证项目
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('zczxmBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'总持证项目',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['总持证项目']
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
              name:'总持证项目',
              type:'bar',
              data:this.zczxmList,
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
      drawJjgqxmsBar(){//即将过期项目数
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('jjgqxmsBar'))
        // 绘制图表
        myChart.setOption({
          title : {
            text: this.title+'即将过期项目数',
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['即将过期项目数']
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
              name:'即将过期项目数',
              type:'bar',
              data:this.jjgqxmsList,
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
    },
  }
</script>

<style scoped>

</style>
