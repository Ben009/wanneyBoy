<template>
    <mind-dialog  dialogSize="mid" title="编辑保养信息" :visible="true" center v-dialogDrag @close="closeDialog">
        <el-form :model="form" ref="form" label-width="140px" :rules="rules">
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="是否保养" prop="isMaintain">
                        <el-radio-group v-model="form.isMaintain">
                            <el-radio :label='1'>是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="保养日期" prop="maintainDate">
                        <el-date-picker
                            class="allWidth"
                            v-model="form.maintainDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                   <el-form-item label="保养周期(月)">
                        <el-input class="allWidth" v-model="form.maintainCycle">
                        <template slot="append">
                            <i class="el-icon-date cursor" @click="computeDate" title="计算"></i>
                        </template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预计下次保养日期" prop="estimatedTime">
                        <el-date-picker type="date" class="allWidth"v-model="form.estimatedTime"
                        value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                     <el-form-item label="维护方式">
                      <el-select v-model="form.maintainWay" placeholder="请选择" class="allWidth">
                        <el-option :value="1" label="厂家维护保养"></el-option>
                        <el-option :value="2" label="自行维护保养"></el-option>
                        <el-option :value="3" label="厂家进行维修"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="验证方式">
                      <el-select v-model="form.validateWay" placeholder="请选择" class="allWidth">
                        <el-option :value="1" label="校准/检定"></el-option>
                        <el-option :value="2" label="自校准/验证"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                   <el-form-item label="部门" prop="departId">
                        <el-select class="allWidth" @change="selectDepart" v-model="form.departId">
                            <el-option v-for="item in depart"
                            :key="item.id"
                            :label="item.departName"
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="经手人" prop="userId">
                        <el-select class="allWidth" v-model="form.userId">
                            <el-option v-for="item in departMembers"
                            :key="item.id"
                            :label="item.userName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col  :span="24">
                     <el-form-item label="详细情况">
                        <el-input class="allWidth" v-model="form.detail"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col  :span="24">
                   <el-form-item label="备注" props="remark">
                        <el-input class="allWidth" v-model="form.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="附件">
                        <mind-upload ref="upFiles" :multiple="false" :callBack="callback" :attachIds="form.attachment" :before-upload='handleFileUploading'></mind-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer">
            <el-button  type="primary" @click="save">保存</el-button>
            <el-button @click="closeDialog">取消</el-button>
        </div>
    </mind-dialog>
</template>
<script>
import Vue from 'vue'
import $ from "jquery";
import { ajaxRequest ,formatDate } from "../../../../util/base";
export default {
  name: "maintainInfoDialog",
  props: {
    callBack: {
      type: Function,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: $.extend({}, this.data),
      rules: {
        estimatedTime: [
          { required: true, message: "下次保养日期不能为空", trigger: "change" }
        ],
        departId: [
          { required: true, message: "部门不能为空", trigger: "change" }
        ],
        userId: [
          { required: true, message: "经手人不能为空", trigger: "change" }
        ]
      },
      fileList: [],
      depart: [],
      departMembers: []
    };
  },
  mounted() {
    console.log(this.data,'data')
    this.initData();
  },
  methods: {
    initData() {
      // 获取部门列表
      ajaxRequest("get", "back/depart/list/", { isDelete: 0 }, res => {
        if (res.code === 200) {
          this.depart = res.rows;
          if (this.form.userId) {
            ajaxRequest(
              "get",
              "back/user/listUserByDeptId/" + this.form.departId,
              { isDelete: 0 },
              res => {
                this.departMembers = res.rows;
              }
            );
          }
        }
      });
    },
    closeDialog() {
      this.callBack();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //   this.form.instId = this.standardId;
          if (this.form.estimatedTime) {
            this.form.estimatedTime = formatDate(
              this.form.estimatedTime,
              "YYYY-MM-DD"
            );
          }
          if (this.form.maintainDate) {
            this.form.maintainDate = formatDate(
              this.form.maintainDate,
              "YYYY-MM-DD"
            );
          }
          let attachment = "";
          this.fileList.forEach(v => {
            attachment += v.id + ",";
          });
          if (!attachment) {
            attachment = attachment.substring(0, attachment.length - 1);
          }
          this.form.attachment = attachment;
          ajaxRequest("post","back/instrumentation/updateMainTain/",this.form,(res) => {
            if (res.code === 200) {
              this.$message.success("保存成功");
              this.callBack();
            }
          })
        }
      });
    },
    callback(file, filelist) {
      this.fileList = filelist;
    },
    // 上传文件去重
    handleFileUploading(file) {
      if (!!file.name) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (file.uid != this.fileList[i].uid) {
            if (file.name == this.fileList[i].name) {
              return new Promise((resolve, reject) => {
                this.$confirm("文件名已存在，是否覆盖？")
                  .then(() => {
                    this.$refs.upFiles.setDeleteIds(this.fileList[i].id);
                    resolve(true);
                  })
                  .catch(() => {
                    reject(false);
                  });
              });
            }
          }
        }
      } else {
        return true;
      }
    },
    computeDate() {
      if (!this.form.maintainCycle == "") {
        if (
          this.form.maintainCycle.length <= 2 &&
          this.form.maintainCycle.match(/[0-9]/g)
        ) {
          let now = new Date(this.form.maintainDate); // 获取需要计算的日期
          let monthNow = new Date(
            now.setMonth(now.getMonth() + Number(this.form.maintainCycle))
          ); // 计算增加(检校周期)月的日期
          let effectiveDate = new Date(
            monthNow.setDate(monthNow.getDate() - 1)
          ); // 计算增加(检校周期)月减去一天的日期
          Vue.set(
            this.form,
            "estimatedTime",
            new Date(effectiveDate).Format("yyyy-MM-dd")
          );
        }
      } else {
        this.$message.error("请先填写检校周期");
      }
    },
    // 选择部门
    selectDepart(id) {
      this.getDepartMember(id);
      // 设置人员选项为空值，进行下一步的操作
      this.$set(this.form, "userId", "");
    },
    getDepartMember(id) {
      ajaxRequest(
        "get",
        "back/user/listUserByDeptId/" + id,
        { isDelete: 0 },
        res => {
          this.departMembers = res.rows;
        }
      );
    }
  }
};
</script>
<style scoped>
.cursor{
  cursor: pointer;
  font-size: 20px;
}
</style>

