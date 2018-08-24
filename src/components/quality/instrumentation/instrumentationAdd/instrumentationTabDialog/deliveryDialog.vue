<template>
    <div>
      <mind-dialog
        v-dialogDrag
        title="外送"
        :visible="true"
        dialogSize="mid"
        @close="cancel"
        center>
        <div style="float:right;">
            <global-tootips>
                <p>1、加入外送计划需选择未关闭的计划，若不存在外送计划将无法计划，可从周检计划中创建新的外送计划；</p>
                <p>2、若因该设备送检涉及项目暂停，需关联计量器具库相应记录（仅需首次关联，下周检送检系统自动关联）。</p>
                <p>3、项目暂停的日期、原因系统填入默认值，可修改；</p>
                <p>4、已经加入外送且未更新的记录禁止再次关联；</p>
            </global-tootips>
        </div>
        <el-form :model="form" ref="form" :rules="rules" label-width="100px;">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="外送计划">
                        <el-select v-model="traId" placeholder="请选择" @change="getPlanTime">
                        <el-option
                            v-for="item in outGoingOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="截止日期" prop="endDate">
                        <el-date-picker
                        type="date"
                        v-model="form.endDate"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预计送出日期" prop="sendDate">
                        <el-date-picker
                        type="date"
                        v-model="form.sendDate"
                        @change="sendDateChange"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预计返回日期" prop="returnDate">
                        <el-date-picker
                        type="date"
                        v-model="form.returnDate"
                        :disabled="!form.sendDate"
                        value-format="yyyy-MM-dd"
                        :picker-options="{disabledDate:dateLimit}"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="计划备注" prop="remark">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="是否项目暂停">
                        <el-radio-group  @change="pauseChange" v-model="form.status">
                            <el-radio label="0">是</el-radio>
                            <el-radio label="1">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-table :data="tableData">
                <el-table-column label="计量器具名称">
                    <template slot-scope="appliance">
                        <el-autocomplete
                            v-model="appliance.row.applianceName"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            value="applianceName"
                            @focus="handleFocus(appliance.$index)"
                            value-key="applianceName"

                            @select="handleSelect"
                            style="width:100%;"
                            :debounce="500"
                        >
                        </el-autocomplete>
                    </template>
                </el-table-column>
                <el-table-column label="暂停开始日期" prop="">
                    <template slot-scope="start">
                        <el-date-picker
                        type="date"
                        v-model="start.row.startTime"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="暂停结束日期" prop="">
                    <template slot-scope="end">
                         <el-date-picker
                        type="date"
                        v-model="end.row.finishDate"
                        :disabled="!end.row.startTime"
                        value-format="yyyy-MM-dd"
                        :picker-options="{disabledDate:tableDateLimit.bind(this,end.$index)}"
                        placeholder="选择日期">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="暂停原因" prop="">
                    <template slot-scope="reason">
                        <el-input v-model="reason.row.reason"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="增加、删除" prop="">
                    <template slot-scope="operate">
                        <el-button type="primary" @click="addNew(operate.row,operate.$index)">增加</el-button>
                        <el-button type="warning" @click="deleteOne(operate.row,operate.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="outGoingConfirm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </span>
      </mind-dialog>
    </div>
</template>
<script>
import $ from "jquery";
import Vue from 'vue';
import { ajaxRequest } from "../../../../util/base.js";
var defaultTableData = {
  applianceName: undefined,
  startTime: undefined,
  finishDate: undefined,
  reason: undefined,
  applianceId: undefined
};
const mockData= {
  endDate:undefined,//截止日期
  sendDate:undefined,//送出日期
  returnDate:undefined,//返回日期
  remark:undefined,//备注
  status:'0',//是否项目暂停

}
export default {
  name: "deliveryDialog",
  props: {
    standardId: {
      required: true
    }
  },
  data() {
    return {
      traId: undefined,
      outGoingOptions: [],
      form: $.extend({},mockData),
      rules: {
        endDate:[{required:true,message:'截止日期不能为空',trigger:'change'}],
        remark:[{required:false,max:100,message:'备注最多不能超过100字符',trigger:'blur'}],
      },
      tableData: [$.extend({},defaultTableData)],
      applianceIndex:undefined,
    };
  },
  mounted() {
    this.getOutGoingOptions();
  },
  methods: {
    //获取到计划的时间
    getPlanTime(id){
      if(id){
        ajaxRequest("get", "back/instraumentationTra/"+id, {}, res => {
          let result = res.daoResult;
          Vue.set(this.form, 'endDate', result.endDate);
          Vue.set(this.form, 'sendDate', result.sendDate);
          Vue.set(this.form, 'returnDate', result.returnDate);
        });
      }else{
        // this.form.endDate = null;
        // this.form.sendDate = null;
        // this.form.returnDate = null;
      }
    },

    //选择计划
    getOutGoingOptions() {
      ajaxRequest("get", "back/instrmentationAud/getPlanList", {}, res => {
        this.outGoingOptions = res;
        this.outGoingOptions.unshift({ id: "", name: "自行外送" });
      });
    },
    //确认外送
    outGoingConfirm() {
      this.$refs.form.validate((valid)=>{
        let source = "";
        if (!this.traId) {
          source = 5;//自动外送
        } else {
          source = 2;//实施计划-外送
        }
        ajaxRequest(
          "post", "back/instrmentationAud/insertInstrumentationTraDetail",
          {instId:this.standardId,traId: this.traId, source: source,ztxmList:JSON.stringify(this.tableData)}, res => {
            if (res.code === 200) {
              this.$message.success("外送成功");
              this.cancel();
            }
          }
        );
      })
    },
    cancel() {
      this.$emit("cancel");
    },
    // 表格时间限定
    tableDateLimit(index, time) {
      if (this.tableData[index].startTime) {
        return new Date(this.tableData[index].startTime).getTime() > time.getTime();
      } else {
        return false;
      }
    },
    // form表单时间限定
    dateLimit(time) {
      if (this.form.sendDate) {
        return new Date(this.form.sendDate).getTime() > time.getTime();
      } else {
        return false;
      }
    },
    // 项目暂停处理
    pauseChange() {
      // 0为是 暂停 显示table，1为否 不暂停 不显示table
      if(this.form.status === '0'){
          this.tableData = [$.extend({},defaultTableData)]
      }else{
        // 清空table数据
          this.tableData = []
      }
    },
    // 仪器设备远程搜索
    querySearchAsync(queryString, cb) {
      if (!queryString || queryString == undefined || queryString == "") {
        cb([]);
      } else {
        ajaxRequest( "get", "back/companyAppliance/queryAppliance",{ applianceName: queryString }, res => {
            cb(res);
          }
        );
      }
    },
    // 选择仪器设备
    handleSelect(item) {
      let flag = 0, index = undefined;
      this.tableData.forEach((v, i) => {
        if (v.applianceName == item.applianceName) {
          flag++;
          index = i;
        }
      });

      if (flag > 1) {
        this.$message.error("器具名称不能够重复！");
        return;
      }
      this.tableData[this.applianceIndex].jlQjId = item.applianceId;
      this.tableData[this.applianceIndex].startTime = this.form.sendDate;
      this.tableData[this.applianceIndex].finishDate = this.form.returnDate;
    },
    handleFocus(index){
      this.applianceIndex=index;
    },
    // 新增一行
    addNew(item,index){
        let obj = $.extend({},defaultTableData);
        this.tableData.push(obj);
    },
    // 删除一行
    deleteOne(item,index){
      if(this.tableData.length === 1){
        this.$message.warning('不能为空！')
        return ;
      }
        this.tableData.splice(index,1)
    },
    // 对送出日期进行事件绑定，防止时间不一致
    sendDateChange(){
      if(!this.form.sendDate){
        this.form.returnDate = undefined;
      }
    }
  }
};
</script>

