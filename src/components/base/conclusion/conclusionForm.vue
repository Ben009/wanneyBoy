<template>
<mind-dialog :title="!!data.id?'编辑结论用语':'新增结论用语'" :visible="true"  dialogSize="mini" center v-dialogDrag  @close="handleCancel">
    <el-row style="text-align:right">
      <global-tootips>
          <p style="text-align:left;">默认账号用于委托单、现场委托单等单据打印时银行账号的显示信息；</p>
      </global-tootips>
    </el-row>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-Row>
              <el-col :span="24">
                <el-form-item label="适用部门" prop="orgId">
                          <el-select  v-model="form.orgId"  @change="changeDepartEvt" :disabled="isDisabled" class="big-width">
                              <el-option
                                      v-for="item in orgIds"
                                      :key="item.id"
                                      :label="item.departName"
                                      :value="item.id">
                              </el-option>
                          </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="适用岗位" prop="postId">
                          <!-- <el-select v-model="form.postId"  multiple @change="handleChange" class="big-width">
                              <el-option
                                      v-for="item in postIds"
                                      :key="item.id"
                                      :label="item.postName"
                                      :value="item.id">
                              </el-option>
                          </el-select> -->
                        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="postId" @change="handleCheckedPostChange">
                            <el-checkbox v-for="post in postIds" :key="post.id" :label="post.id">{{post.postName}}</el-checkbox>
                        </el-checkbox-group>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item  prop="conclusion">
                    <template slot = "label">
                        <span>结论用语</span>
                        <el-tooltip class="item" effect="dark" content="选中文本内容右击可添加修饰符">
                            <i class="el-icon-info ft12"></i>
                        </el-tooltip>
                    </template>
                    <el-input @input="valueChange('conclusion')" v-if="!form.conclusion" v-model="form.conclusion"
                              v-rightclick="handleRightClick.bind(this,form,'conclusion')"></el-input>
                    <el-popover
                        v-if="form.conclusion"
                        popper-class="conclusionForm"
                        :visible-arrow="false"
                        trigger="hover">
                        <div v-html="form.conclusion"></div>
                        <el-input ref="conclusion" slot="reference" v-model="form.conclusion" v-rightclick="handleRightClick.bind(this,form,'conclusion')"></el-input>
                    </el-popover>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item prop="conclusionEn">
                    <template slot = "label">
                        <span>结论用语(英文)</span>
                        <el-tooltip class="item" effect="dark" content="适用于中英文内容对照证书或纯英文证书，若无此类需求可不维护；选中文本内容右击可添加修饰符；">
                            <i class="el-icon-info ft12"></i>
                        </el-tooltip>
                    </template>
                    <el-input  @input="valueChange('conclusionEn')" v-model="form.conclusionEn"v-if="!form.conclusionEn" v-rightclick="handleRightClick.bind(this,form,'conclusionEn')"></el-input>
                    <el-popover
                        v-if="form.conclusionEn"
                        popper-class="conclusionForm"
                        :visible-arrow="false"
                        trigger="hover">
                        <div v-html="form.conclusionEn"></div>
                        <el-input ref="conclusionEn" slot="reference" v-model="form.conclusionEn" v-rightclick="handleRightClick.bind(this,form,'conclusionEn')" ></el-input>
                    </el-popover>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                  <el-form-item prop="certificateType">
                    <template slot = "label">
                      <span>适用证书类型</span>
                      <el-tooltip class="item" effect="dark" content="系统依据适用相应的证书/记录类型，调用不同的结论用语；">
                        <i class="el-icon-info ft12"></i>
                      </el-tooltip>
                    </template>
                      <!-- <el-select v-model="form.certificateType" multiple @change="selectChange" size="mini" class="big-width">
                          <el-option
                                  v-for="item in certificateTypes"
                                  :key="item.code"
                                  :label="item.remark"
                                  :value="item.code">
                          </el-option>
                      </el-select> -->
                      <el-checkbox-group v-model="form.certificateType" >
                            <el-checkbox v-for="item in certificateTypes" :key="item.code" :label="item.code">{{item.remark}}</el-checkbox>
                        </el-checkbox-group>
                  </el-form-item>

              </el-col>
          </el-Row>
      </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
</mind-dialog>
</template>

<script>
let btnPower = window.localStorage.getItem("btnPower"); //获取用户所有权限
import Vue from "vue";

import { ajaxRequest, ajaxProxyRequest } from "../../util/base";
import $ from "jquery";
import rightclick from "../../../directives/rightcilck";
import rightClick from "../../../mixins/FormRightClick";

/*import {
    Button,
    Checkbox,
    CheckboxGroup,
    Col,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
    Row,
Tooltip
  } from 'element--ui';*/
/*Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox);
  Vue.use(Tooltip)*/

const defaults = {
  hoho: "",
};
export default {
  name: "layout",
  props: {
    data: {
      type: Object
    },
    callback: {
      type: Function
    }
  },
  data() {
    let conclusionEnEcheck = (rule, value, cb) => {
      let reg = /^([a-zA-Z]|\s|[,.?\\·！!@#￥%……&*"<>\/]|[0-9])*$/;
      if (!!value) {
        if (reg.test(value)) {
          if (value.length > 400) {
            cb(new Error("最多输入400个字符"));
          } else {
            cb();
          }
        } else {
          cb(new Error("请输入正确格式的结论用语！"));
        }
      } else {
        cb();
      }
    };
    let lenthCheck = function(rule, value, cb) {
      if (!!value) {
        if (value.length > 200) {
          cb(new Error("最多输入200个字符"));
        } else {
          cb();
        }
      } else {
        cb(new Error("结论用语不能为空!"));
      }
    };

    return {
      form: $.extend({}, defaults, this.data || {}),
      rules: {
        conclusion: [
          {
            type: "string",
            required: true,
            validator: lenthCheck,
            trigger: "blur"
          }
        ],
        orgId: [
          {
            type: "integer",
            required: true,
            message: "请选择适用部门",
            trigger: "blur"
          }
        ],
        certificateType: [
          {
            type: "array",
            required: true,
            message: "请选择证书类型",
            trigger: "change"
          }
        ],
        conclusionEn: [
          { type: "string", validator: conclusionEnEcheck, trigger: "blur" }
        ]
      },
      loading: false,
      remoteOptions: [],
      certificateTypes: [], //服务类型
      orgIds: [],
    //   岗位的人选
      postIds: [],
      postId: [],
      postIdsArr:[],
      isDisabled: false,
    //   用于部门的全选
      checkAll:false,
    };
  },
  mounted() {
    this.getCertificateType();
    this.getDepartListInit();
    if (this.form && this.form.id) {
      this.form.certificateType = this.form.certificateType.split(",");
    }
    if(this.form.postId){
        let arr = this.form.postId.split(',')
        arr =arr.slice(1,arr.length-1)
        arr = arr.map((v,i)=>{
          return parseInt(v)
        })
        this.postId = arr
    }
    if(!this.form.certificateType){
      Vue.set(this.form,'certificateType',[])
    }
  },
  directives: { rightclick },
  mixins: [rightClick],
  methods: {
    // 为证书类型做进一步处理准备
    selectChange(value) {},
    valueChange(slug) {
      this.$nextTick(() => {
        this.$refs[slug].focus();
      });
    },
    getDepartListInit() {
      //初始化获取部门数据
      ajaxRequest("get", "back/depart/list/", { isDelete: 0 }, res => {
        this.orgIds = res.rows;
        if (btnPower == null || btnPower == undefined) {
          //没有权限，所有涉及权限的按钮都不展示
          btnPower = "@@";
        }
        if (btnPower.indexOf("@M14210@") == -1) {
          //无查询所有部门权限，只能操作本部门
          this.isDisabled = true;
          this.form.orgId = parseInt(localStorage.getItem("departId"));
        } else {
          this.isDisabled = false;
          if (!this.form.orgId) {
            this.form.orgId = parseInt(localStorage.getItem("departId"));
          }
        }
        if (this.form.orgId) {
          //初始化有部门值时，根据部门获取岗位(编辑页)
          this.changeDepartEvtInit(this.form.orgId);
        }
      });
    },
    // handleChange(v){
    //     //岗位手动赋值
    //     Vue.set(this.form, 'postId', v)
    // },
    changeDepartEvt(orgId) {
      //部门下拉事件,根据部门ID获取岗位
      if (orgId) {
        ajaxRequest("get", "back/post/listByDeptId/" + orgId, {}, res => {
          this.postIds = res.rows;
          //每次选择一级，自动清空二级
          Vue.set(this.form, "postId", "");
          this.postIdsArr = this.postIds.map((v,i)=>{
              return v.id
          })
        });
      }
    },
    changeDepartEvtInit(orgId) {
      //初始化时,根据部门ID获取岗位,不清空使用岗位值
      if (orgId) {
        ajaxRequest("get", "back/post/listByDeptId/" + orgId, {}, res => {
          this.postIds = res.rows;
          this.postIdsArr = this.postIds.map((v,i)=>{
              return v.id
          })
        });
      }
    },
    //获取服务类型
    getCertificateType() {
      ajaxProxyRequest("get", "/njmind/findParam/certificateType", {}, res => {
        this.certificateTypes = res.list;
      });
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
            this.form.postId = ','+this.postId.join(',')+','
          this.callback(this.form);
        } else {
          return false;
        }
      });
    },
    selectPost(postId) {
      this.form.postId = postId;
    },
    remoteMethod(keyWords) {
      //console.log(keyWords);
      //this.loading = true;
      // $.ajax();
    },
    handleCancel() {
      //关闭窗口
      this.callback();
    },
    //岗位人员全选
    handleCheckAllChange(flag){
        if(flag){
            this.postId = this.postIdsArr
        }else{
            this.postId = []
        }
    },
    // 岗位人员单独选择
    handleCheckedPostChange(val){
        if(this.postId.length == this.postIds.length){
            this.checkAll = true;
        }else{
            this.checkAll = false;
        }
    }
  }
};
</script>

<style scoped>
.right-click-menu {
  position: fixed;
  border: 1px solid #ccc;
  padding: 2px 0;
  background: #fff;
  width: 100px;
  z-index: 9999;
}
.right-click-menu li {
  padding: 3px 10px;
  cursor: default;
  font-size: 14px;
  color: #606266;
}
.right-click-menu li:hover {
  color: #409eff;
}
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
.conclusionForm {
  border: 1px solid #14a7fb !important;
}
.ft12 {
  font-size: 12px;
}
.big-width {
  width: 100%;
}
</style>
