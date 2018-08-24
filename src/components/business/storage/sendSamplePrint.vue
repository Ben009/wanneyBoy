<template>
  <div>
    <div style="width:100%;text-align: center;">
      <el-button type="primary" @click="print">打印</el-button>
      <el-button type="primary" @click="printpreview">打印预览</el-button>
      <el-button @click="close">关闭</el-button>
    </div>
    <div style="width:100%;margin-top:10px;">
      <table style="width:500px;margin:0 auto;border:1px solid #000;">
        <tbody>
          <tr style="border-bottom:1px solid #000;">快递单（单号）：{{courierNum}}</tr>
          <tr style="border-bottom:1px solid #000;">地址：{{address}}</tr>
          <tr style="border-bottom:1px solid #000;">收件人：{{person}}</tr>
          <tr>登记号：<span style="font-weight: 600;">{{djhs}}</span></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>

<script>
    export default {
      name:"comprehensiveOutPrint",//综合出库快递单打印
        data() {
            return {
              paramObj: this.$route.query,
              courierNum:"",//快递单号
              address:"",//地址
              person:"",//收件人
              djhs:"",//登记号
            }
        },
      methods:{
        print(){//打印

        },
        printReview(){//打印预览

        },
        close(){//关闭

        }
      },
    }
</script>
