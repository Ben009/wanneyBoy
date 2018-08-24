<template>
    <div style="width:100%;text-align: center">
      <div>
        <img src="">
      </div>
      <div>
        <el-button type="primary" @click="print">打印</el-button>
        <el-button type="primary" @click="printReview">打印预览</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </div>
</template>

<style>

</style>

<script>
    export default {
      name:"roomPrintDetail",
        data() {
            return {
              room: this.$route.query.room,
              code:this.$route.query.code,
            }
        },
      methods:{
        getImg(){//生成房间条码图片
          if(this.code==1){//生成条形码

          }else{//生成二维码

          }
        },
        print(){//打印

        },
        printReview(){//打印预览

        },
        close(){//关闭

        }
      },
      mounted(){
        this.getImg();
      }
    }
</script>
