<template>
    <!-- 稳定性记录  type = stability  重复性记录  type = repeatability   -->
    <div :class="{eventPause:info == 'traceabilityConfirm'}">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <div class=" special">
                <global-tootips class="top_tootip">
                    <p>点击计算将自动计算下次考核日期</p>
                </global-tootips>
            </div>
            <el-row>
                <el-col :span="8" :offset="4">
                    <el-form-item label="是否考核" prop="isCheck">
                        <el-radio-group v-model="form.isCheck">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="4">
                    <el-form-item label="考核时间" prop="checkDate">
                        <el-date-picker
                            class="allWidth"
                            v-model="form.checkDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="结论" prop="conclusion">
                      <el-input type="text" v-model="form.conclusion"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="4">
                    <el-form-item label="考核周期(月)">
                        <el-input class="allWidth" v-model="form.checkCycle">
                            <template slot="append">
                                <i class="el-icon-date calcCursor" @click="computeDate" title="计算"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预计下次考核日期" prop="estimatedTime">
                        <el-date-picker class="allWidth"
                                        v-model="form.estimatedTime"
                                        :disabled="true"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="4">
                    <el-form-item label="考核部门" prop="checkDepart">
                      <el-select class="allWidth" @change="selectDepart" v-model="form.checkDepart">
                        <el-option v-for="item in depart"
                                   :key="item.id"
                                   :label="item.departName"
                                   :value="item.id+''"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="考核人" prop="checkUser">
                        <el-select v-model="form.checkUser" class="allWidth">
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
                <el-col :offset="4" :span="16">
                    <el-form-item label="备注" prop="remark">
                        <el-input class="allWidth" v-model="form.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="4" :span="16">
                    <el-form-item label="附件">
                        <mind-upload :callBack="callback" :multiple="false" ref="upFiles" :before-upload='handleFileUploading'></mind-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="title-item mb20"><span>测量值</span></div>
        <el-row>
            <el-col :span="6" :offset="3" class="textStyle">
                <span class="color">测量值1</span>
            </el-col>
            <el-col :span="6" class="textStyle">
                <span class="color">测量值2</span>
            </el-col>
            <el-col :span="6" class="textStyle">
                <span class="color">测量值3</span>
            </el-col>
        </el-row>
        <el-row v-for="(item,index) in measuredValue" class="marginTop">
            <el-col :span="6" :offset="3">
                <el-input v-model="item.clz1"></el-input>
            </el-col>
            <el-col :span="6">
                <el-input v-model="item.clz2"></el-input>
            </el-col>
            <el-col :span="6">
                <el-input v-model="item.clz3"></el-input>
            </el-col>
            <el-button @click="deleteOne(item,index)" style="margin-left:5px" type="warning" >删除</el-button>
            <el-button type="primary" @click="addNew(item,index)"  v-if="index == 0">添加</el-button>
        </el-row>
        <div class="title-item mb20"><span>计算值</span></div>
        <el-form label-width="130px">
            <el-row class="marginTop">
                <!-- el-col-offset2 的样式值 -->
                <el-col :span="3" style="text-align:right;" >
                    <span class="color">平均值&#x3000;</span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="form.avg1"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="form.avg2"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="form.avg3"></el-input>
                </el-col>
            </el-row>
            <template v-if="type == 'stability'">
                <el-row class="marginTop">
                    <el-col :span="3" style="text-align:right;">
                        <span class="color">差值&#x3000;</span>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="form.dValue1"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="form.dValue2"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="form.dValue3"></el-input>
                    </el-col>
                </el-row>
                <el-row class="marginTop">
                    <el-col :span="3" style="text-align:right;">
                        <span class="color">最大允许误差&#x3000;</span>

                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="form.maximumError1"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="form.maximumError2"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="form.maximumError3"></el-input>
                    </el-col>
                </el-row>
            </template>
            <template v-else>
                <el-row class="marginTop">
                    <el-col :span="3" style="text-align:right;">
                        <span class="color">标准差&#x3000;</span>
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="form.dValue1"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="form.dValue2"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="form.dValue3"></el-input>
                    </el-col>
                </el-row>
                <el-row class="marginTop">
                    <el-col :span="3" style="text-align:right;">
                        <span class="color">不确定度&#x3000;</span>

                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="form.uncertaint1"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="form.uncertaint2"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="form.uncertaint3"></el-input>
                    </el-col>
                </el-row>
            </template>

        </el-form>
        <div class="bottom_button">
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button type="warning" @click="clear">清空</el-button>
            <el-button  type="danger" class="back" @click="back" v-if="info != 'traceabilityConfirm'">返回</el-button>
        </div>
        <div class="title-item mb20" v-if="type == 'stability'"><span>稳定性记录</span></div>
        <el-table :data="tableData" :max-height="QJTableMaxHeight">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="是否考核" prop="isCheck" :formatter="isCheckFormatter"></el-table-column>
            <el-table-column label="仪器名称" prop="instrumentationName"></el-table-column>
            <el-table-column label="制造厂商" prop="manufacturer"></el-table-column>
            <el-table-column label="型号规格" prop="model"></el-table-column>
            <el-table-column label="设备编号" prop="deviceNumber"></el-table-column>
            <el-table-column label="结论" prop="conclusion"></el-table-column>
            <el-table-column label="考核人" prop="userName"></el-table-column>
            <el-table-column label="考核日期" prop="checkDate" :formatter="dateFormate"></el-table-column>
            <el-table-column label="考核周期(月)" prop="checkCycle"></el-table-column>
            <el-table-column label="预计下次考核日期" prop="estimatedTime" :formatter="dateFormate"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="附件" width="60px">
                <template slot-scope="file">
                    <el-button type="text" @click="watch(file.row)" v-if="file.row.attachment"><i title="查看" class="el-icon-view fs16"></i> </el-button>
                    <el-button type="text" v-if="!file.row.attachment">无</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                    <el-button title="编辑" type="text" @click="watchInfo(scope.row)"><i class="el-icon-edit fs16"></i></el-button>
                    <el-button title="删除" type="text" v-mindPopover="{message:'确认删除？',success:handleDelete.bind(this,scope.row)}"><i class="el-icon-delete fs16"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
        <record-dialog v-if="recordType" :type="recordType" :cb="recordCallBack" :data="recordInfo"></record-dialog>
        <attachment-dialog v-if="attachmentIds" :attachment-ids="attachmentIds" :call-back="handleCancel"></attachment-dialog>
    </div>
</template>
<script>
import $ from "jquery";
import Vue from "vue";
import { ajaxRequest,ajaxSyncRequest,formatDate } from "../../../util/base";
import recordDialog from './instrumentationTabDialog/recordDialog.vue'
import attachmentDialog from './instrumentationTabDialog/attachmentDialog.vue'
const defaultInfo = {
  isCheck: "1"
};
export default {
  name: "record",
  props: {
    type: {
      type: String,
      required: true
    } ,
    standardId: {
      type: Number
    },
    info:{
      type:String,
    }
  },
  components:{recordDialog,attachmentDialog},
  data() {
    return {
      form: $.extend({}, defaultInfo),
      rules: {
          checkDate: [{ required: true,message:'考核时间不能为空', trigger: "change" }],
          estimatedTime: [{ required: true,message:'下次日期不能为空' ,trigger: "change" }],
          checkDepart: [{ required: true,message:'考核部门不能为空', trigger: "change" }],
          checkUser: [{ required: true,message:'考核人不能为空' ,trigger: "change" }],
          conclusion:[{max:200,message:'最多输入200个字符',trigger:'blur'}],
          remark:[{max:200,message:'最多输入200个字符',trigger:'blur'}],
      },
      maintainway: [],
      measuredValue: [
        { value1: undefined, value2: undefined, value3: undefined }
      ], //测量值
      tableData: [], //显示的表格数据
      fileList: [], //上传文件的数组
      depart:[],//部门列表
      departMembers:[],//部门下的人员
      recordType:undefined,//弹窗的类型
      recordInfo:null,//编辑信息

      attachmentIds:undefined,//附件id
    };
  },
  methods: {
    //点击查看详细
    watchInfo(info){
      if(this.type == 'stability'){
        this.recordType = 'stability'
      }else{
        this.recordType = 'repeatability'
      }
      this.recordInfo = info
    },
    recordCallBack(info){
      console.log(info)
      if(info){
        let url = "";
        if(this.recordType=='stability'){
          url = "back/instrumentationStability";
        }else if(this.recordType=='repeatability'){
          url = "back/instrumentationRepeat";
        }
        ajaxRequest("PUT",url, {info}, res => {
            if (res.code === 200) {
              this.getTableList();
              this.$message.success("修改成功");
            }
          }
        );

        this.recordType = undefined ;
        this.getTableList()
      }else{
        this.recordType = undefined ;
      }
    },
    isCheckFormatter:function(row, column, cellValue){
      if(cellValue==1){
        return '是'
      }else if(cellValue==0){
        return '否'
      }else{
        return '';
      }
    },
    handleDelete(row){
      let url = "";
      if(this.type=="stability"){
        url ="back/instrumentationStability/delete"
      }else if(this.type=="repeatability"){
        url ="back/instrumentationRepeat/delete"
      }
      ajaxRequest("delete",url+"/"+row.id, {}, res => {
          if (res.code === 200) {
            this.getTableList();
            this.$message.success("删除成功");
          }
        }
      );
    },
    //获取历史数据
    getTableList() {
      if(this.standardId){
        //稳定性
        let url =""
        if(this.type=='stability'){
          url = "back/instrumentationStability/retrieve";
        }else{
          url = "back/instrumentationRepeat/retrieve";
        }
        ajaxRequest("get", url, {instId:this.standardId,orderProperty:'i.id',orderType:'desc'}, res => {
            if (res.code === 200) {
              this.tableData = res.rows;
            }
          }
        );
      }
    },
    // 计算日期
    computeDate() {
      if (!this.form.checkCycle == "") {
        if(this.form.checkCycle.length<=2&&this.form.checkCycle.match(/[0-9]/g)){
          //计算证书有效日期
          let now = new Date(this.form.checkDate); // 获取需要计算的时间
          let monthNow = new Date(
            now.setMonth(now.getMonth() + Number(this.form.checkCycle))
          ); // 计算增加(检校周期)月的时间
          let effectiveDate = new Date(monthNow.setDate(monthNow.getDate() - 1)); // 计算增加(检校周期)月减去一天的时间
          Vue.set(this.form, "estimatedTime", new Date(effectiveDate).Format("yyyy-MM-dd"));
        }
      } else {
        this.$message.error("请先填写考核周期");
      }
    },
    // 增加一行测量值
    addNew(item, index) {
      this.measuredValue.push({
        clz1: undefined,
        clz2: undefined,
        clz3: undefined
      });
    },
    // 删除一行测量值
    deleteOne(item, index) {
      if (this.measuredValue.length == 1) {
        this.$message.error("测量值不能为空！");
        return;
      }
      this.measuredValue.splice(index, 1);
    },
    // 上传文件的回调函数
    callback(file, fileList) {
      this.fileList = fileList;
    },
    // 日期格式化
    dateFormate(row, column, cellValue) {
      if (!cellValue) {
        return "";
      } else {
        return new Date(cellValue).format("YYYY-MM-DD");
      }
    },
    // 保存功能
    submit() {
      let url = "";
      if(this.type=='stability'){
        //稳定性
        url = "back/instrumentationStability/";
      }else if(this.type=='repeatability'){
        //重复性
        url = "back/instrumentationRepeat/";
      }
      this.$refs.form.validate(valid => {
        if(valid){
          this.form.clz = JSON.stringify(this.measuredValue);
          this.form.instId = this.standardId;
          let file = "";
          this.fileList.forEach(v=>{
            file += v.id+',';
          })
          if(file){
            file = file.substring(0, file.length - 1);
          }
          this.form.attachment = file;
          this.$confirm('确认保存?','提示',{
            center:true,
            type:'warning',
          }).then(()=>{
            ajaxRequest("post",url,this.form,(res) => {
              if (res.code === 200) {
                this.$message.success("保存成功");
                this.getTableList();
              }
            })
          })
        }
      })
    },
    // 清空
    clear() {
      this.form = $.extend({},defaultInfo)
      this.$refs["form"].resetFields();
      this.$refs["upFiles"].$refs["upFiles"].clearFiles();
    },
    // 返回
    back() {
      this.$emit('back')
    },
    // 文件上传去重
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
    //初始加载数据
    initData() {
      // 获取部门列表
      ajaxRequest("get", "back/depart/list/", { isDelete: 0}, res => {
        if (res.code === 200) {
          this.depart = res.rows;
        }
       }
      );
    },
    // 选择人员
    selectDepart(id) {
      this.getDepartMember(id);
      Vue.set(this.form,'checkUser',undefined)
    },
    // 获取部门下的人员
    getDepartMember(id) {
      ajaxRequest("get", "back/user/listUserByDeptId/" + id, { isDelete: 0 }, res => {
          this.departMembers = res.rows;
        }
      );
    },
    // 查看附件
    watch(info) {
        this.attachmentIds = info.attachment;
    },
    // 文件关闭窗口
    handleCancel(){
      this.attachmentIds = undefined ;
    }
  },
  mounted() {
    this.initData();
    this.getTableList();
  }
};
</script>
<style scoped>
.bottom_button {
  text-align: center;
  margin-top: 10px;
}
.allWidth {
  width: 100%;
}
.textStyle {
  text-align: center;
}
.color {
  color: #606266;
}
.calcCursor{
    cursor: pointer;
    font-size: 20px;
}
.top_tootip{
  float:right;
}
.eventPause{
  pointer-events: none;
}
.special{
  pointer-events: all;
  height: 20px;
}
.fs16{
  font-size: 16px;
}
.marginTop{
  margin-top: 10px;
}
</style>


