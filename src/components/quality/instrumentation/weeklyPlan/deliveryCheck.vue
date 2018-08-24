<template>
  <!-- 外送计划 -->
  <div>
    <div class="tootip">
      <global-tootips>
        <p>1、本页面用于创建外送计划，创建后，各专业部门可通过设备明细页面将需外送的器具关联至该计划；</p>
        <p>2、可通过查询页面控制该计划的状态，关闭后专业部门将无法关联至该计划；</p>
      </global-tootips>
    </div>
    <div>
      <div class="title-item mb20"><span>外送计划</span></div>
      <el-form :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="8" :offset="4">
            <el-form-item label="外送机构" prop="outOrg">
              <el-input type="text" @blur="planChange" v-model="form.outOrg"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="截止日期" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                @change="planChange"
                class="allWidth"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="4">
            <el-form-item label="预计送出日期">
              <el-date-picker
                v-model="form.sendDate"
                type="date"
                class="allWidth"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计返回日期">
              <el-date-picker
                v-model="form.returnDate"
                type="date"
                class="allWidth"
                :disabled="!form.sendDate"
                :picker-options="{disabledDate:limitDate}"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form-item label="计划名称">
              <el-input v-model="form.planItem"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form-item label="备注" prop="planRequire">
              <el-input v-model="form.planRequire"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form-item>
              <el-checkbox v-model="form.isPush">是否自动推送消息
                  <el-tooltip content="若选中，系统将针对所有的专业部门人员推送该消息计划">
                      <i class="el-icon-info fs12"></i>
                  </el-tooltip>
              </el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

        </el-row>
      </el-form>
      <div class="bottom_button">
        <el-button type="primary" @click="saveData">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>

    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Vue from "vue";
  import {ajaxRequest} from "../../../util/base.js";

  const defaultInfo = {}
  export default {
    name: 'deliveryCheck',
    props: {},
    data() {
      return {
        form: $.extend({}, defaultInfo),
        rules: {
          outOrg: [{required: true, message: '外送机构不能为空', trigger: 'change'}],
          endDate: [{required: true, message: '截止日期不能为空', trigger: 'change'}],
          planRequire:[{type:'string',max:200,message:'最多输入200个字符',trigger:'blur'}],

        },
      }
    },
    methods: {
      cancel() {
        this.$emit('back')
      },
      limitDate(time) {
        return new Date(this.form.sendTime).getTime()>new Date(time).getTime();
        // 对返回时间做限定
      },
      //保存外检计划
      saveData() {
        this.form.isFinish = 0;
        this.form.planClass = 1;
        this.form.planType = 2;
        this.form.isDelete = 0;
        this.form.closeState = 1;
        this.form.traceWay = 2;
        this.form.addUser = localStorage.getItem('userId');
        ajaxRequest("post", "back/instraumentationTra/", this.form, res => {
            if (res.code === 200) {
              this.$message.success("创建外检计划成功！");
            }
          }
        );
      },
      // 实现计划名称填入
      planChange(){
        if(this.form.outOrg || this.form.endDate){
          Vue.set(this.form,'planItem',`外送计划-${this.form.outOrg ? this.form.outOrg : ''}-${this.form.endDate?this.form.endDate:''}`)
        }else{
          Vue.set(this.form,'planItem',undefined);
        }
      }
    }
  }
</script>
<style scoped>
  .bottom_button {
    text-align: center;
  }

  .tootip {
    float: right;
  }

  .allWidth {
    width: 100%;
  }

  .test {
    width: 100%;
  }
  .fs12{
    font-size: 12px;
  }
</style>

