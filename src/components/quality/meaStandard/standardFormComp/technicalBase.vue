<template>
    <div :class="{'disableEdit': !!formDetailInfo.isAuditing && !isAdd}">
        <div v-for="(item,index) in nameData" :key="item.code">
            <div class="title-item mb20" style="margin-bottom:20px;"><span>{{item.remark}}</span></div>
            <div v-for="(v,i) in each[item.code] " :key="v.stId + ' ' + i">
                <mind-upload  :buttonClick="record.bind(this,item.code , i)" :attachIds="v.fileId" :successed="successed" :deleted="deleted" :callBack="callBack" :limitNumb="1" style="width:50%;display:inline-block"></mind-upload>
                <br>
                <div style="margin-bottom:30px;">
                    <span style="color:#606266;">备注</span>
                    <el-input style="width:600px;" v-model="each[item.code][i].remark"></el-input>
                    <span>
                        <el-button type="primary" @click="addNew(item.code,i,item,v)">增加</el-button>
                        <el-button type="warning" @click="delOne(item.code,i,item,v)">删除</el-button>
                    </span>

                </div>
            </div>
        </div>
        <div style="text-align:center;" v-if="!formDetailInfo.isAuditing ||  isAdd">
            <el-button type="primary" v-btnHas="{message:'M22002',scope:this}" @click="submit">保存</el-button>
        </div>
    </div>
</template>
<script>
import { ajaxRequest, ajaxProxyRequest } from "../../../util/base";
export default {
  name: "technicalBase",
  props: {
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 当前仪器标准的id
    currentStandardId() {
      return this.$store.state.Mstandard.currentStandardId;
    },
    formDetailInfo(){
      return this.$store.state.Mstandard.baseList
    },
  },
  watch: {
    currentStandardId(n, o) {
      if (n) {
        this.getInfo();
      }
    }
  },
  directives: {
    btnHas: {
      bind: function(el, binding) {
        let buttonpermsStr = window.localStorage.getItem("btnPower");
        if (buttonpermsStr == null || buttonpermsStr == undefined) {
          //没有权限，所有涉及权限的按钮都不展示
          el.parentNode.removeChild(el);
        } else if (
          buttonpermsStr.indexOf("@" + binding.value.message + "@") == -1 &&
          binding.value.scope.currentStandardId
        ) {
          //没有该按钮权限，隐藏按钮
          el.parentNode.removeChild(el);
        }
      }
    }
  },
  data() {
    return {
      tableData: [],
      nameData: [],
      each: {},
      fileList: [],
      // 当上传文件时，选中的位置
      inner: null,
      outer: null
    };
  },
  mounted() {
    this.getInitData();
  },
  methods: {
    //   获取数据字典里的数据
    getInitData() {
      ajaxProxyRequest(
        "get",
        "/njmind/findParam/technicalInformation",
        {},
        res => {
          this.nameData = res.list;
          this.nameData.forEach((v, i) => {
            this.$set(this.each, v.code, [
              {
                type: v.code,
                remark: "",
                fileId: "",
                stId: this.currentStandardId
              }
            ]);
          });
        }
      );
    },
    //   根据当前标准id进行查找上传文件
    getInfo() {
      ajaxRequest(
        "get",
        "back/mStandard/getTechnicalById",
        { stId: this.currentStandardId },
        res => {
          this.tableData = res;
          console.log(res)
          this.tableData.forEach((v,i)=>{
              this.each[v.type].push(v)
          })
        }
      );
    },
    //   上传文件之后的回调函数
    successed(file) {
      this.each[this.outer][this.inner].fileId = file.id;
      console.log(this.each)
    },
    deleted(file) {
      this.each[this.outer][this.inner].fileId = "";
      //   this.fileList.forEach((v,i,a)=>{
      //       if(v.uid && file.uid){
      //           if(v.uid == file.uid){
      //             a.splice(i,1);
      //           }
      //       }
      //   })
    },
    callBack(file, filelist) {
      //   console.log(file)
    },
    //   新增一行上传文件 one : nameData中的位置  two ： each中的位置 下同
    addNew(one, two, oneItem, twoItem) {
      this.each[one].push({
        type: oneItem.code,
        remark: "",
        fileId: "",
        stId: this.currentStandardId
      });
    },
    //   删除一行上传文件
    delOne(one, two, oneItem, twoItem) {
      if (this.each[one].length == 1) {
        this.$message.error("不能为空！");
        return;
      }
      this.each[one].splice(two, 1);
    },
    //   提交已上传的文件保存到数据库中
    submit() {
      let arrayPost = [];
      for (let item in this.each) {
        this.each[item].forEach((v, i, a) => {
          if (v.fileId) {
            arrayPost.push({fileId:v.fileId,remark:v.remark,stId:v.stId,type:v.type});
          }
        });
      }
      let message = JSON.stringify(arrayPost)
      ajaxRequest('post','back/mStandard/addMStandardTechnical',{stId:this.currentStandardId,fileArray:message},res=>{
          if(res.code === 200){
              this.$message.success('保存成功！')
          }else{
              this.$message.error('保存失败！')
          }
      })
      console.log(message);
    },
    // 记录每次点击的上传按钮的位置，用于修改页面信息
    record(one, two) {
      this.outer = one;
      this.inner = two;
    }
  }
};
</script>
<style scoped>
.el-form-item .el-form-item__label {
  width: 200px !important;
}
.disableEdit{
    pointer-events:none;
    opacity:0.8;
}
</style>

