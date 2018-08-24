<template>
  <mind-dialog
    :title="'安排器具'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="mid"
    @close="handleCancel">
    <el-row>
      <arrangeDetail
        :quotationNo="quotationNo"
        :planData="planData"
        :planId="planId"
        :callback="handelCallback">
      </arrangeDetail>
    </el-row>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';

  import {ajaxRequest} from '../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import arrangeDetail from './arrangeDetail.vue';

  const defaults = {};
  export default {
    name: "arrange-dialog",
    props: {
      quotationNo: {
        type: String
      },
      planData: {
        required: true
      },
      planId: {
        type: Number,
        required: true
      },
      callback: {
        type: Function,
        required: true
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    components: {arrangeDetail},
    directives: {rightclick},
    mixins: [rightClick],
    methods: {
      handelCallback(planId, checkedData, data) {
        ajaxRequest(
          "post",
          "back/arrange/planApplianceArrange",
          {
            planAppliance: JSON.stringify(checkedData),
            isSelfarrange: data.isSelfarrange,
            planTime: Array.from(new Set(data.allPlanTime)).toString(),
            leader: data.leader,
            vehicle: data.vehicle,
            driver: data.driver,
            planId: planId,
          },
          res => {
            if (res.code == 200) {
              let str = res.map.scene
                ? "<div>现场委托单编号:" + res.map.scene + "</div>"
                : "";
              str += res.map.bringBack
                ? "<div>带回委托单编号为:" + res.map.bringBack + "</div>"
                : "";
              str +=
                '<button style="color:#fff;background-color:#409eff;padding:5px 5px;border-radius:3px;">打印委托单<button>';
              this.$alert(str, "成功", {
                confirmButtonText: "关闭",
                dangerouslyUseHTMLString: true,
                callback: action => {
                  this.$message.success("操作成功");
                  this.callback();
                }
              });
            }
          }
        );
      },
      handleCancel() {
        this.callback();
      }
    },
  }
</script>

<style>
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

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
