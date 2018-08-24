<template>
    <!-- 保养信息 -->
    <div :class="{eventPause:type == 'traceabilityConfirm'}">
        <div class="top_tootip special">
            <global-tootips>
                <p>输入保养周期和保养日期，点击计算将计算预计下次保养日期</p>
            </global-tootips>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-row>
                <el-col :span="8" :offset="4">
                    <el-form-item label="是否保养" prop="isMaintain">
                        <el-radio-group v-model="form.isMaintain">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8" >
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
                <!-- 做一个规则验证，周期的值需要做限定，其余的报错 -->
                <el-col :span="8" :offset="4">
                    <el-form-item label="保养周期(月)" prop="maintainCycle">
                        <el-input class="allWidth" v-model="form.maintainCycle">
                        <template slot="append">
                            <i class="el-icon-date calcCursor" @click="computeDate" title="计算"></i>
                        </template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预计下次保养日期" prop="estimatedTime">
                        <el-date-picker type="date" class="allWidth"v-model="form.estimatedTime"
                        value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="4">
                    <el-form-item label="维护方式">
                      <el-select v-model="form.maintainWay" placeholder="请选择" class="allWidth">
                        <el-option value="1" label="厂家维护保养"></el-option>
                        <el-option value="2" label="自行维护保养"></el-option>
                        <el-option value="3" label="厂家进行维修"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="验证方式">
                      <el-select v-model="form.validateWay" placeholder="请选择" class="allWidth">
                        <el-option value="1" label="校准/检定"></el-option>
                        <el-option value="2" label="自校准/验证"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="4">
                    <el-form-item label="部门" prop="departId">
                        <el-select class="allWidth" @change="selectDepart" v-model="form.departId">
                            <el-option v-for="item in depart"
                            :key="item.id"
                            :label="item.departName"
                            :value="item.id+''"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
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
                <el-col :offset="4" :span="16" prop="detail">
                    <el-form-item label="详细情况">
                        <el-input class="allWidth" v-model="form.detail"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="4" :span="16">
                    <el-form-item label="备注" props="remark">
                        <el-input class="allWidth" v-model="form.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="4" :span="16">
                    <el-form-item label="附件">
                        <mind-upload ref="upFiles" :multiple="false" :callBack="callback"  :before-upload='handleFileUploading'></mind-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="bottom_button">
            <el-button type="primary" @click="saveData">保存</el-button>
            <el-button type="warning" @click="clearData">清空</el-button>
            <el-button  v-if="type && type != 'weeklyCheckTask'&& type !='traceabilityConfirm' " type="danger" class="back" @click="$emit('back')">返回</el-button>
        </div>
        <div class="title-item mb20"><span>保养信息记录</span></div>
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column prop="isMaintain" label="是否保养">
              <template slot-scope="scope">
                <span v-if="scope.row.isMaintain==0">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column prop="instrumentationName" label="仪器名称"></el-table-column>
            <el-table-column prop="manufacturer" label="制造厂商"></el-table-column>
            <el-table-column prop="model" label="型号规格"></el-table-column>
            <el-table-column prop="deviceNumber" label="设备编号"></el-table-column>
            <el-table-column prop="maintainWay" label="维护方式" :formatter="maintainWayFormatter"></el-table-column>
            <el-table-column prop="validateWay" label="验证方式" :formatter="validateWayFormatter"></el-table-column>
            <el-table-column prop="userName" label="经手人"></el-table-column>
            <el-table-column prop="maintainDate" label="保养日期"></el-table-column>
            <el-table-column prop="maintainCycle" label="保养周期(月)"></el-table-column>
            <el-table-column prop="estimatedTime" label="预计下次保养日期"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="attachment" label="附件" width="60px">
                <template slot-scope="file">
                    <el-button type="text" @click="watch(file.row)" v-if="file.row.attachment"><i title="查看" class="el-icon-view fs16"></i> </el-button>
                    <el-button type="text" v-if="!file.row.attachment">无</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="80px;">
                <template slot-scope="scope">
                    <el-button type="text" title="编辑" @click="edit(scope.row)"> <i class="el-icon-edit fs16"></i></el-button>
                    <el-button type="text" title="删除"  v-mindPopover="{message:'确认删除？',success:handleDelete.bind(this,scope.row)}"> <i class="el-icon-delete fs16"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
        <maintainInfo-dialog v-if="detailInfo" :data="detailInfo" :call-back="handleCancel.bind(this,false)"></maintainInfo-dialog>
        <attachment-dialog v-if="attachmentIds" :attachment-ids="attachmentIds" :call-back="handleCancel.bind(this,true)"></attachment-dialog>
    </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import { ajaxRequest,ajaxSyncRequest,formatDate } from "../../../util/base";
import maintainInfoDialog from './instrumentationTabDialog/maintainInfoDialog.vue'
import attachmentDialog from './instrumentationTabDialog/attachmentDialog.vue'
const defaultInfo = {
  isMaintain:"1"
};
export default {
  name: "maintainInfo",
  props: {
    standardId:{
      default:Number
    },
    type:{
        type:String,
        required:false,
        default:'',
    }
  },
  components:{maintainInfoDialog,attachmentDialog},
  data() {
    return {
      form: $.extend({}, defaultInfo),
      rules: {
        estimatedTime: [{ required: true,message:'下次保养日期不能为空', trigger: "change" }],
        departId: [{ required: true,message:'部门不能为空', trigger: "change" }],
        userId: [{ required: true, message:'经手人不能为空',trigger: "change" }],
        maintainCycle:[{max:3,message:'最多输入三位数',trigger:'blur'}],
        detail:[{max:200,message:'最多输入200个字符',trigger:'blur'}],
        remark:[{max:200,message:'最多输入200个字符',trigger:'blur'}],
      },
      maintainway: [],
      tableData: [],
      fileList:[],//附件
      depart: [],//部门成员
      departMembers:[],
      testDepart:'',//测试部门
      testMember:'',//测试人员

      detailInfo:undefined,//待修改维护信息
      attachmentIds:undefined,//查看附件的历史信息
    };
  },
  methods: {
    initData() {
      // 获取部门列表
      ajaxRequest("get","back/depart/list/", {isDelete: 0 },res => {
          if (res.code === 200) {
            this.depart = res.rows;
          }
        }
      );
    },
    maintainWayFormatter:function (row, column, cellValue) {
      //厂家维护保养   自行维护保养  厂家进行维修
      if(cellValue==1){
        return '厂家维护保养'
      }else if(cellValue==2){
        return '自行维护保养'
      }else if(cellValue==3){
        return '厂家进行维修'
      }
    },

    validateWayFormatter:function (row, column, cellValue) {
      if(cellValue==1){
        return '校准/检定'
      }else if(cellValue==2){
        return '自校准/验证'
      }
    },
    //  计算下次保养日期
    computeDate() {
      if (!this.form.maintainCycle == "") {
          if(this.form.maintainCycle.length<=2&&this.form.maintainCycle.match(/[0-9]/g)){
          //计算证书有效日期
          let now = new Date(this.form.maintainDate); // 获取需要计算的日期
          let monthNow = new Date(
            now.setMonth(now.getMonth() + Number(this.form.maintainCycle))
          ); // 计算增加(检校周期)月的日期
          let effectiveDate = new Date(monthNow.setDate(monthNow.getDate() - 1)); // 计算增加(检校周期)月减去一天的日期
          Vue.set(this.form, "estimatedTime", new Date(effectiveDate).Format("yyyy-MM-dd"));
        }
      } else {
        this.$message.error("请先填写保养日期！");
      }

    },
    // 编辑保养信息
    edit(info) {
        this.detailInfo = info;
    },
    // 查看添加的文件
    watch(info) {
        this.attachmentIds = info.attachment;
    },
    // 删除信息行
    handleDelete(info) {
      ajaxRequest("post","back/instrumentation/deleteMainTain/", {_method: 'delete',id: info.id}, res => {
          if (res.code === 200) {
            this.getTableList();
            this.$message.success("删除成功");
          }
        }
      );
    },
    //初始加载数据
    initData() {
      // 获取部门列表
      ajaxRequest(
        "get",
        "back/depart/list/",
        {
          isDelete: 0
        },
        res => {
          if (res.code === 200) {
            this.depart = res.rows;
            // 如果有选择的部门，则查询部门下的人员
            // if(this.form.){
            //     this.getDepartMember(this.form.)
            // }
          }
        }
      );
    // 维护方式
    // 验证方式
    },

    getTableList(){
      if(this.standardId){
        ajaxRequest( "get","back/instrumentation/getMainTain/", {id: this.standardId}, res => {
            if (res.code === 200) {
              this.tableData = res.rows;
            }
          }
        );
      }
    },

    //保存数据
    saveData(){
      this.$refs.form.validate(valid => {
        if(valid){
          this.form.instId = this.standardId;
          if (this.form.estimatedTime) {
            this.form.estimatedTime = formatDate(this.form.estimatedTime, 'YYYY-MM-DD')
          }
          if (this.form.maintainDate) {
            this.form.maintainDate = formatDate(this.form.maintainDate, 'YYYY-MM-DD')
          }
          let attachment = "";
          this.fileList.forEach(v=>{
            attachment += v.id + ",";
          })
          if(!attachment){
            attachment = attachment.substring(0, attachment.length - 1);
          }
          this.form.attachment = attachment;
          this.$confirm('确认保存?','提示',{
            center:true,
            type:'warning',
          }).then(()=>{
            ajaxRequest("put","back/instrumentation/addInstMainTain/",this.form,(res) => {
              if (res.code === 200) {
                this.$message.success("保存成功");
                this.clearData();
                this.getTableList();
              }
            })
          })
        }
      })
    },
    // 选择部门
    selectDepart(id){
        this.getDepartMember(id);
        // 设置人员选项为空值，进行下一步的操作
        this.$set(this.form,'userId','')
    },
    // 获取部门下的人员
    getDepartMember(id) {
      ajaxRequest(
        "get",
        "back/user/listUserByDeptId/" + id,
        { isDelete: 0 },
        res => {
          this.departMembers = res.rows;
        }
      );
    },
    // 文件上传的回调
    callback(file,filelist){
        this.fileList = filelist;
    },
    // 上传文件去重
    handleFileUploading(file) {
      if(!!file.name){
        for(let i = 0 ; i < this.fileList.length ; i ++){
          if(file.uid!=this.fileList[i].uid){
            if(file.name == this.fileList[i].name){
              return new Promise((resolve,reject)=>{
                this.$confirm('文件名已存在，是否覆盖？').then(()=>{
                  this.$refs.upFiles.setDeleteIds(this.fileList[i].id);
                  resolve(true);
                }).catch(()=>{
                  reject(false)
                })
              })
            }
          }
        }
      }else{
        return true;
      }
    },
    /**
     * @param {Boolean} flag true时关闭文件列表,false关闭修改信息
     */
    // 关闭弹窗
    handleCancel(flag){
        if(flag){
            this.attachmentIds = undefined;
        }else{
            this.detailInfo = undefined;
            this.getTableList();
        }
    },
    clearData(){
        this.$refs["upFiles"].$refs["upFiles"].clearFiles();
        this.form = $.extend({},defaultInfo);
        this.$refs.form.resetFields();
    }
  },
  mounted() {
    this.initData();
    this.getTableList();
  }
};
</script>
<style scoped>
.top_tootip {
  display: flex;
  justify-content: flex-end;
}
.bottom_button {
  text-align: center;
}
.back {
  border: 1px solid #8da3d6;
  color: #602666;
}
.allWidth {
  width: 100%;
}
.calcCursor{
    cursor: pointer;
    font-size: 20px;
}
.fs16{
    font-size: 16px;
}
.eventPause{
  pointer-events: none;
}
.special{
  pointer-events: all;
}
</style>


