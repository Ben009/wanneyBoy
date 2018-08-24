<template>
            <!--<el-input v-model="form.attachment" v-show="show"></el-input>-->
  <div class="price-item">
    <el-row>
     <div class="el-icon-info  shuoming">
      <el-row class="el-sm">
        <div>
          １、若该客户存在有效的合同时，业务受理将自动带入该合同号，费用录入时针对可打折器具自动折扣；<br>
          ２、历史合同记录为该单位合同每次的修改内容；
        </div>
      </el-row>
    </div>
    </el-row>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-Row>
        <el-col :span="6">
          <el-form-item label="合同号" prop="contractNo" label-width="150px" >
            <el-input v-model="form.contractNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同折扣" prop="contractDiscount">
            <template slot="label">
                <span>合同折扣</span>
                <el-tooltip content="合同约定的折扣，仅针对可打折的器具生效，如7折请输入0.7">
                  <i class="el-icon-info" style="font-size:12px;"></i>
                </el-tooltip>
            </template>
            <el-input v-model.trim="form.contractDiscount"></el-input>
          </el-form-item>
        </el-col>

           <el-col :span="6">
          <el-form-item label="合同签署人部门" prop="contractSignatoryId ">
            <el-select placeholder="请选择"  @change="changeDepartEvt" v-model="form.contractSignatoryId ">
                <el-option
                        v-for="item in orgIds"
                        :key="item.id"
                        :label="item.departName"
                        :value="item.id+''">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" >
          <el-form-item label="合同签署人" prop="contractSignatory">
            <el-select
                    placeholder="请选择"

                    v-model="form.contractSignatory"
                    >
                <el-option
                        v-for="item in departMembers"
                        :key="item.id"
                        :label="item.userName"
                        :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-Row>
        <el-col :span="6">
          <el-form-item label="合同签署日期" prop="contractSignDate" label-width="150px">
            <el-date-picker class="tab-width"
              v-model="form.contractSignDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同有效期开始时间" prop="contractValidateBegin" label-width="150px">
            <el-date-picker class="tab-width"
              v-model="form.contractValidateBegin"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同有效期结束时间" prop="contractValidateEnd" label-width="150px">
            <el-date-picker class="tab-width"
              v-model="form.contractValidateEnd"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="附件" prop="attachment">
            <mind-upload  :limitNumb="limitNumb" ref="upFiles" :callBack="callBack"  :before-upload='handleFileUploading'></mind-upload>
          </el-form-item>
        </el-col>

      </el-Row>
      <el-row >
        <el-form-item label="合同备注" prop="contractRemark">
          <el-input v-model="form.contractRemark"></el-input>
        </el-form-item>
      </el-row>
      <div style="display: block; text-align: center;" v-if="!isWatch">
        <el-button type="primary" @click="handleSubmit(1)">保 存</el-button>
        <el-button type="warning" @click="handleClear">清 空</el-button>
        <template v-if="!data.isAdd">
          <el-button @click="handleCancel" v-if="isPut && !audit">返 回</el-button>
        </template>
      </div>

    </el-form>
    <div class="title-item history">
      <span>历史合同记录</span>
    </div>
    <div style="margin-top:10px;">
      <el-table  :data="tableData"
        :max-height="QJTableMaxHeight"
        border
        style="width: 100%;min-height:39vh;"
       >

        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="contractNo"
          label="合同号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="contractDiscount"
          label="合同折扣">
        </el-table-column>
        <el-table-column
          prop="contractValidateBegin"
          label="合同有效期"
          :formatter="function(row, column, cellValue, index){return  new Date(cellValue).format('YYYY-MM-DD')}"
        >
        </el-table-column>
        <el-table-column
          prop="contractSignatoryName"
          label="签署人">
        </el-table-column>
        <el-table-column
          prop="contractSignDate"
          label="签署日期"
          :formatter="function(row, column, cellValue, index){return  new Date(cellValue).format('YYYY-MM-DD')}"
        >
        </el-table-column>
        <el-table-column
          prop="contractRemark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="修改时间"
          :formatter="function(row, column, cellValue, index){return  new Date(cellValue).format('YYYY-MM-DD hh:mm:ss')}">
        </el-table-column>
        <el-table-column
          prop="addUserName"
          label="修改人"
         >
        </el-table-column>

        <el-table-column
          label="附件"
          width="60px"
          >
          <template slot-scope="scope">
            <el-button  v-if="scope.row.attachment" type="text" style="padding:0;font-size:18px" title="查看" @click="attachmentInfo = scope.row.attachment"><i class="el-icon-view"></i></el-button>
            <el-button v-if="!scope.row.attachment" type="text">无</el-button>
            <!-- <el-button  v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,[scope.row])}" type="text" style="padding:0;font-size:18px;"> -->
              <!-- <i class="el-icon-delete" title="删除"></i></el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <history-list-dialog v-if="attachmentInfo" :callBack="closeInfo" :fileId="attachmentInfo"></history-list-dialog>
    <div style="margin-top:10px;text-align:center;float:right;">
      <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">

      </mind-pagination>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { ajaxRequest, ajaxSyncRequest } from "../../util/base";
import $ from "jquery";
import historyListDialog from "./historyListDialog";
export default {
  name: "history-list",
  components: {
    historyListDialog
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    isPut: {
      type: Boolean,
      required: true
    },
    isWatch: {
      type: Boolean,
      default: false
    },
    audit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let discountCheck = (rule, value, cb) => {
      if (!!value) {
        if (typeof value != String) {
          value = value + "";
        }
        if (value.length > 10) {
          cb(new Error("最多输入10个字符"));
        } else {
          let regx = /^[0-9.]*$/g;
          let arr = value.split(".");
          if (arr.length > 2) {
            cb(new Error("请输入正确格式数字"));
          }
          if (regx.test(value)) {
            let num1 = parseInt(arr[0]);
            let num2;
            if (arr.length > 1) {
              num2 = parseInt(!arr[1] ? 9 : arr[1]);
            }
            if (
              (num1 == 0 && !!num2) ||
              (num1 == 1 && (num2 == 0 || num2 == undefined))
            ) {
              cb();
            } else {
              cb(new Error("折扣只能在0-1之间,且不能为0"));
            }
          } else {
            cb(new Error("请输入数字"));
          }
        }
      } else {
        cb(new Error("折扣不能为空"));
      }
    };
    let contractNoCheck = (rule, value, cb) => {
      if (!!value) {
        if (value.length > 30) {
          cb(new Error("最多输入30字符"));
        } else {
          ajaxRequest(
            "get",
            "back/companyContactHis/judgeCompanyContactHis",
            {
              contractNo: value,
              companyId: this.data.id,
              isDelete: 0
            },
            res => {
              if (res.code === 200) {
                this.msg = res.msg;
              } else {
                this.$message.error("无法判断合同号信息!");
              }
            }
          );
          cb();
        }
      } else {
        cb(new Error("合同号不能为空"));
      }
    };
    let dateCheck = (rule, value, cb) => {
      if (value) {
        if (this.form.contractValidateBegin) {
          let string = value + " ";
          let endTime = string.split("-");
          endTime = endTime.join("");
          endTime = endTime.slice(0, 8);
          let str = this.form.contractValidateBegin + " ";
          let startTime = str.split("-");
          startTime = startTime.join("");
          startTime = startTime.slice(0, 8);
          if (endTime - startTime >= 0) {
            cb();
          } else {
            cb(new Error("请填入合适的时间"));
          }
        } else {
          cb(new Error("请先输入合同开始时间"));
        }
      } else {
        cb(new Error("合同结束时间不能为空"));
      }
    };
    let contractSignDateCheck = (rule, value, cb) => {
      if (value) {
        let string = value + " ";
        let startTime = string.split("-");
        startTime = startTime.join("");
        startTime = startTime.slice(0, 8);
        let str = this.form.contractValidateEnd + " ";
        let endTime = str.split("-");
        endTime = endTime.join("");
        endTime = endTime.slice(0, 8);
        if (startTime - endTime > 0) {
          cb(new Error("请选择合适的签署日期"));
        } else {
          cb();
        }
      } else {
        cb(new Error("签署日期不能为空"));
      }
    };
    let contractSignatoryCheck = (rule, value, cb) => {
      if (
        this.form.contractSignatory == undefined ||
        this.form.contractSignatory == ""
      ) {
        cb(new Error("签署人不能为空"));
      } else {
        cb();
      }
    };
    return {
      page: 1,
      rows: 10,
      total: 0,
      tableData: [],
      editing: false,
      authority: false,
      // 合同签署人信息
      orgIds: [],
      departMembers: "",
      // 查看的合同信息
      attachmentInfo: null,
      msg: "1", //合同号重复时的信息
      editData: {},
      rules: {
        contractNo: [
          { required: true, validator: contractNoCheck, trigger: "blur" }
        ],
        contractDiscount: [
          { required: true, validator: discountCheck, trigger: "blur" }
        ],
        contractSignatory: [
          { required: true, validator: contractSignatoryCheck, trigger: "blur" }
        ],
        contractSignDate: [
          { required: true, trigger: "blur", validator: contractSignDateCheck }
        ],
        contractValidateBegin: [
          { required: true, message: "合同有效期开始时间不能为空!" }
        ],
        contractValidateEnd: [
          { required: true, validator: dateCheck, trigger: "blur" }
        ],
        contractRemark: [
          {
            type: "string",
            max: 100,
            message: "最多输入100个字符",
            trigger: "blur"
          }
        ]
      },

      attachment: "",
      fileList: [], //
      limitNumb: 4, //附件上传个数限制
      up_url: "", //自定义上传路径 [非必填]  默认不用修改
      fdata: {
        //附件上传额外参数
        caseId: "", //登记号       [非必填]  业务相关的登记号
        serverId: "", //服务id     [非必填]  分布式附件服务可以用默认不用配制
        flowId: "", //流程id      [非必填]  流程相关
        execType: "" //操作类型   [非必填]  业务相关
      },
      form: $.extend({}, this.data)
    };
  },
  computed: {},

  methods: {
    // 页面上有调用此方法
    handleCancel() {
      this.$emit("willBack");
    },
    handleClear() {
      this.form = {};
      this.$refs["form"].resetFields();
      this.$refs["upFiles"].$refs["upFiles"].clearFiles();
    },

    //callBack1上传组件数据发生变化回调
    callBack(file, list) {
      this.fileList = list;
    },
    saveData() {
      let info = $.extend({}, this.form);
      info.contractDiscount = parseFloat(info.contractDiscount);
      ajaxRequest("put", "back/company/updateCompanyContactHis", info, res => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.getTableList();
        } else {
          this.$message.error("保存失败！");
        }
      });
    },
    handleSubmit(info) {
      let _this = this;
      let attachment = "";
      for (let i = 0; i < this.fileList.length; i++) {
        attachment += this.fileList[i].id + ",";
      }
      _this.form.contractAttachment = attachment;
      this.form.id = this.data.id;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.msg === "1") {
            this.saveData();
          } else {
            this.$confirm(
              this.msg + "(建议不要填写一样的合同时间),是否继续使用"
            )
              .then(() => {
                this.saveData();
              })
              .catch(() => {
                return false;
              });
          }
        } else {
          return false;
        }
      });
    },

    handlePageSizeChange(size) {
      this.page = 1;
      this.rows = size;
      this.getTableList();
    },
    handleCurrentPageChange(currentPage) {
      this.page = currentPage;
      this.getTableList();
    },
    getTableList() {
      ajaxRequest(
        "get",
        "back/companyContactHis/retrieve",
        {
          companyId: this.data.id,
          orderProperty: "C.add_Time",
          orderType: "desc",
          page: this.page,
          rows: this.rows,
          total: 0,
          isDelete: 0
        },
        res => {
          if (res.code == 200) {
            this.tableData = res.rows;
            this.total = res.total;
          }
        }
      );
    },
    getTableListOnly() {
      ajaxRequest(
        "get",
        "back/companyContactHis/retrieve",
        {
          companyId: this.data.id,
          isDelete: 0
        },
        res => {
          if (res.code == 200) {
            if (res.rows.length != 0) {
              res.rows[0].contractDiscount = res.rows[0].contractDiscount + " ";
              this.form = res.rows[0];

              this.form.contractSignDate = new Date(
                this.form.contractSignDate
              ).format("YYYY-MM-DD");
              this.form.contractValidateBegin = new Date(
                this.form.contractValidateBegin
              ).format("YYYY-MM-DD");
              this.form.contractValidateEnd = new Date(
                this.form.contractValidateEnd
              ).format("YYYY-MM-DD");
              if (!!this.form.attachment) {
                let fileId = this.form.attachment.slice(
                  0,
                  this.form.attachment.length - 1
                );
                setTimeout(() => {
                  this.$refs.upFiles.loadAttacheIds(fileId);
                }, 200);
              }
            }
          }
        }
      );
    },
    getDepartListInit() {
      //获取部门数据
      ajaxRequest("get", "back/depart/list/", {isDelete:0}, res => {
        this.orgIds = res.rows;
        if (this.form.contractSignatoryId) {
          this.changeDepartEvtInit(this.form.contractSignatoryId);
        }
      });
    },
    changeDepartEvtInit(id) {
      ajaxRequest("get", "back/user/listUserByDeptId/" + id, {isDelete:0}, res => {
        this.departMembers = res.rows;
      });
    },
    changeDepartEvt(departId) {
      //根据部门ID获取人员
      if (departId) {
        ajaxRequest(
          "get",
          "back/user/listUserByDeptId/" + departId,
          {isDelete:0},
          res => {
            this.departMembers = res.rows;
            Vue.set(this.form, "contractSignatory", "");
          }
        );
      }
    },
    closeInfo() {
      this.attachmentInfo = null;
    },
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
    }
  },
  mounted() {
    if (this.form.contractAttachment) {
      let fileId = this.form.contractAttachment.slice(
        0,
        this.form.contractAttachment.length - 1
      );
      this.$refs.upFiles.loadAttacheIds(fileId);
    }
    this.getDepartListInit();
    if (this.data.id) {
      this.getTableList();
    }
    // this.getTableListOnly();
    let buttonpermsStr = window.localStorage.getItem("btnPower");
    if (buttonpermsStr == null || buttonpermsStr == undefined) {
      this.authority = true;
    } else {
      this.authority = true;
    }

    //else if (buttonpermsStr.indexOf("@" + binding.value + "@") == -1) {
    //   //没有该按钮权限，隐藏按钮
    //   el.parentNode.removeChild(el);
    // }
  }
};
</script>

<style scoped>
.tab-width {
  width: 100% !important;
}
.history {
  margin: 20px 0 !important;
}
/********说明样式*********/
.el-sm {
  background: #ffffff;
  position: absolute;
  z-index: 999;
  -webkit-box-shadow: 1px 7px 33px -9px #969696;
  box-shadow: 1px 7px 33px -9px #969696;
  border: 1px solid #56bc4e8c;
  border-radius: 5px;
  color: dimgrey;
  margin-left: -361px;
  word-break: break-all;
  margin-top: 18px;
  padding: 4px 5px;
  font-size: 14px;
  opacity: 50;
  float: right;
  -webkit-transition: all 0.8s;
  transition: all 0.8s;
}
.shuoming {
  border: none !important;
  color: #56bc4e !important;
  font-size: 16px !important;
  position: absolute;
  right: 10px;
  top: -12px;
}
.shuoming::after {
  content: "";
  width: 35px;
  height: 40px;
  /*background: #fff;*/
  position: absolute;
  z-index: 999;
  /* top: 0; */
  /* left: -65px; */
  margin-left: -16px;
}
.shuoming .el-sm {
  display: none;
  -webkit-transition: all 0.8s;
  transition: all 0.8s;
}
@media screen and (max-width:1500px){
  .custom-1d74b7 .el-col-6{width: 50%!important;}
}
</style>
