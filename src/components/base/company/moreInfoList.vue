<template>
  <div>

  <el-row v-if="!isWatch">
    <el-button type="primary" @click="addNew">新增单位信息</el-button>
  </el-row>
    <div style="margin-top:10px;">
      <el-table  :data="tableData"
        :max-height="QJTableMaxHeight"
        border
        style="width: 100%">

        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="contacter"
          label="联系人"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="certificateCompanyName"
          label="证书单位名称">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="fax"
          label="传真">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="visitTestAddress"
          label="上门检测地址">
        </el-table-column>

        <el-table-column
          label="操作"
          width="80" v-if="!isWatch">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-edit-outline" title="编辑"></i></el-button>
              <el-button v-mindPopover="{'message':'是否删除','success':handleDelete.bind(this,scope.row)}" style="padding:0;font-size:18px;border:none;"><i
                class="el-icon-delete" title="删除"></i></el-button>
            </template>

          <!-- </template> -->
        </el-table-column>

      </el-table>
    </div>
    <template v-if="isEditing">
      <more-info-form :data='form' :callBack='handleSubmit'></more-info-form>
    </template>
  </div>  
</template>

<script>
import Vue from "vue";
import { ajaxRequest, ajaxSyncRequest } from "../../util/base";
import $ from "jquery";
import moreInfoForm from "./moreInfoForm";
export default {
  name: "more-info-list",
  components: {
    moreInfoForm
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
    isWatch:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    let lenthCheck = function(rule, value, cb) {
      if (!!!value) {
        cb();
      } else if (value.length > 100) {
        cb(new Error("最多输入100个字符"));
      } else {
        cb();
      }
    };
    let lenthRequiredCheck = function(rule, value, cb) {
      let infoName =
        rule.fullField == "contacter"
          ? "联系人"
          : rule.fullField == "telephone" ? "电话" : "地址";
      if (!!!value) {
        cb(new Error(`${infoName}不能为空!`));
      } else if (value.length > 100) {
        cb(new Error("最多输入100个字符"));
      } else {
        cb();
      }
    };
    return {
      rules: {
        contacter: [
          { required: true, validator: lenthRequiredCheck, trigger: "blur" }
        ],
        address: [
          { required: true, validator: lenthRequiredCheck, trigger: "blur" }
        ],
        telephone: [
          { required: true, validator: lenthRequiredCheck, trigger: "blur" }
        ],
        remark: [{ validator: lenthCheck, trigger: "blur" }],
        certificateCompanyName: [{ validator: lenthCheck, trigger: "blur" }],
        fax: [
          {
            type: "string",
            max: 100,
            trigger: "blur",
            message: "最多输入100个字符!"
          }
        ]
      },
      form: {

      },
      total: 0,

      tableData: [],
      tableArr: [
        "contacter",
        "certificateCompanyName",
        "telephone",
        "fax",
        "address",
        "remark"
      ] /*表格中需编辑的字段*/,
      isEditing: false,
      editingData: {}
    };
  },
  computed: {},

  methods: {

    addNew() {
      this.isEditing = true;
    },
    handleSubmit(info) {
      // this.form.companyId = this.data.id;
      if (info) {
        if (!info.companyId) {
          // 保存
          info.companyId = this.data.id;
          ajaxRequest("post", "back/companyContact/", info, res => {
            if (res.code == 200) {
              this.$message.success("保存成功！");
              this.tableData.unshift(res.daoResult);
              this.isEditing = false;
              this.getTableList();
            }
          });
        } else {
          // 更新
          info.updateWay = 0;
          ajaxRequest("put", `back/companyContact/`, info, res => {
            if (res.code === 200) {
              this.$message.success("编辑成功！");
              this.isEditing = false;
              this.form = {}
              this.getTableList();
            }
          });
        }
      } else {
        // 关闭弹出框
        this.isEditing = false;
        this.form = {}
      }

    },

    getTableList() {
      ajaxRequest(
        "get",
        "back/companyContact/retrieve",
        {
          companyId: this.data.id,
          // page: this.page,
          // rows: this.rows,
          isDelete:0,
          total: this.total
        },
        res => {
          if (res.code == 200) {
            this.total = res.total;
            this.tableData = res.rows;

          }
        }
      );
    },
    setOriginal(v, arr) {
      /*拿到数据后 用original对象存旧值*/
      this.$set(v, "original", {});
      arr.forEach(item => this.$set(v.original, item, v[item]));
    },
    handleEdit(row) {
      this.isEditing = true;
      this.form = row;
    },
    handleDelete(row) {
      //此处row是数组，因为对应组件对应传的是数组
      ajaxRequest("put", "back/companyContact/", {id:row.id,isDelete:1}, res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        }
        this.getTableList();
      });
    }

  },
  mounted() {
    if(this.data.id){
      this.getTableList();
    }
  }
};
</script>

<style scoped>
.custom-1d74b7 .el-col-1 {
  width: 50%;
}
</style>
