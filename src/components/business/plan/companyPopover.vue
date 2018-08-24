<template>
  <div>
    <el-popover trigger="hover" placement="bottom" v-if="isShowCompanyPopver">
      <div>
        <el-row v-if="!!rowInfo.specialRequirement">
          <span><span style="font-weight: bold">整单备注：</span>{{rowInfo.specialRequirement}}</span>
        </el-row>
        <el-row v-if="!!rowInfo.attachment">
        <span><span style="font-weight: bold">附件：</span>
          <mind-upload ref="upFiles"
                       :disabled="disabled"
                       :attachIds="rowInfo.attachment"
          ></mind-upload>
        </span>
        </el-row>
        <el-row v-if="!!rowInfo.quoRemark">
          <span> <span style="font-weight: bold">报价单备注：</span>{{rowInfo.quoRemark}}</span>
        </el-row>
        <el-row v-if="!!rowInfo.quoAttachment">
        <span><span style="font-weight: bold">报价单附件：</span>
            <mind-upload ref="uploadFile"
                         :disabled="disabled"
                         :attachIds="rowInfo.quoAttachment"
            ></mind-upload>
        </span>
        </el-row>
        <el-row v-if="!!rowInfo.otherSpecialRequirement">
          <span><span style="font-weight: bold">单位特殊要求：</span>{{rowInfo.otherSpecialRequirement}}</span>
        </el-row>
      </div>
      <div slot="reference" class="name-wrapper">
      <span ref="refer" @click="doSomethingElse(rowInfo)">
        <span class="font-red">(<span v-show="rowInfo.companyType">{{rowInfo.companyType}}</span>**)</span>
        <span v-if="rowInfo.isSettleAccount == 0" style="color:red">{{rowInfo[showContent]}}</span>
        <span v-else>{{rowInfo[showContent]}}</span>
      </span>
      </div>
    </el-popover>
    <span v-else ref="refer" @click="doSomethingElse(rowInfo)">
    <span v-show="rowInfo.companyType" class="font-red">({{rowInfo.companyType}})</span>
    <span v-if="rowInfo.isSettleAccount == 0" style="color:red">{{rowInfo[showContent]}}</span>
        <span v-else>{{rowInfo[showContent]}}</span>
    </span>
  </div>
</template>
<script>
  import {ajaxRequest} from '../../util/base'

  export default {
    name: 'company-popover',
    props: {
      rowInfo: {required: true, type: Object},  //当前行数据
      showContent: {required: true},
    },
    data() {
      return {
        disabled: true,//true上传控件失效 只能查看
        isShowCompanyPopver: false,
      }
    },
    methods: {
      isShow() {
        if (this.rowInfo.specialRequirement != null || this.rowInfo.attachment != null || this.rowInfo.quoRemark != null ||
          this.rowInfo.quoAttachment != null || this.rowInfo.otherSpecialRequirement != null) {
          this.isShowCompanyPopver = true;
        }
      }
    },
    mounted() {
      //判断整单备注、附件、报价单备注、报价单附件、单位特殊要求是否存在有值的，有值显示tooltips查看
      this.isShow();
    }
  }
</script>
<style scoped>
  .font-red {
    color: red;
    cursor: pointer;
  }
</style>

