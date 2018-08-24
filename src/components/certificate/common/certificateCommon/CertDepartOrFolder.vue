<template>
    <mind-dialog
    title="新增"
    :visible="true"
    width="300"
    height="400"
    center
    v-dialogDrag
    @close="handleCancel">

        <el-row>
          <!--<el-col v-show="isShow" :sm="24">-->
            <!--<label class="cur-pointer" @click="checkCommonFolder">公共文件夹</label>-->
          <!--</el-col>-->
            <el-col class="cur-pointer" :class="{active:val.id == departId }" :sm="24" v-for="val in departData" >

                <div @click="checkDepart(val.id,val.departName)" style="cursor:pointer">{{val.departName}}</div>
            </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateDepartMlName">更新部门目录名称</el-button>

      </span>
  </mind-dialog>
</template>
<script>
import Vue from "vue";
import { ajaxRequest } from "../../../util/base";
import $ from "jquery";



export default {
  props: {
    data: {
      type: Object
    },
    callback: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      departData: [],
      departId: null,
      departName: null,
      disabled: true,
//      isShow: true
    };
  },
  methods: {
    checkDepart(departId, departName) {
      this.departId = departId;
      this.departName = departName;
      this.handleSubmit();
    },
    checkCommonFolder() {
      this.departId = 0;
      this.departName = "公共文件夹";
      this.handleSubmit();
    },
//    commonFloderIsShow() {
//      let mlId = 0;
//      ajaxRequest("get", "back/certificateTemp/" + mlId, null, res => {
//        if (res.code === 200) {
//          res.rows.forEach(element => {
//            if (element.mlName=='公共文件夹') {
//              this.isShow = false;
//              return;
//            }
//          });
//        }
//      });
//    },
    handleSubmit() {
      ajaxRequest(
        "post",
        "back/certificateTemp/addCertificateTempMl",
        {
          mlIdParent: 0,
          mlName: this.departName,
          departId: this.departId,
          actionType: "目录添加"
        },
        res => {
          if (res.code==100) {
            this.$message.error(res.msg)
          }
          if (res.code === 200) {
            res.daoResult.isParent = '1'
            console.log(res.daoResult,'res.daoResult')
            this.callback(res.daoResult, "W", "add");
          }
        }
      );
    },
    handleCancel() {
      this.callback();
    },
    getDepartNotInML() {
      ajaxRequest("get", "back/certificateTemp/getDepartNotInML", {}, res => {
        if (res.code === 200) {
          this.departData = res.rows;
        }
      });
    },
    updateDepartMlName() {
      ajaxRequest("get", "back/certificateTemp/updateDepMLName", {}, res => {
        if (res.code === 200) {
          this.$emit("refreshTree",'W0', res.rows);
          this.$message.success('操作成功')
          this.callback();
        }
      });
    }
  },
  created() {
//    this.commonFloderIsShow();
  },
  mounted() {
    this.getDepartNotInML();
  },
  watch: {
    departId(val) {
      this.disabled = val ? false : true;
    }
  }
};
</script>
<style scoped>
.cur-pointer {
  cursor: pointer;
}
.active {
  background: #edf4f9;
}
.m-t-5 {
  margin-top: 5px;
}
</style>
