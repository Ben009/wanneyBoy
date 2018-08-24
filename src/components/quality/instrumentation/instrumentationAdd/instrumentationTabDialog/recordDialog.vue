<template>
<div>
    <!-- 目前页面还需要的处理是文件的初始化加载与数据格式的转换，其余正常 -->
    <mind-dialog :title="type == 'stability'?'编辑稳定性记录':'编辑重复性记录'" center v-dialogDrag :visible="true" @close="cancel" dialogSize="mid">
        <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="是否考核" prop="isCheck">
                        <el-radio-group v-model="form.isCheck">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
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
                <el-col :span="12">
                    <el-form-item label="结论" prop="conclusion">
                      <el-input type="text" v-model="form.conclusion"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="考核周期(月)">
                        <el-input class="allWidth" v-model="form.checkCycle">
                            <template slot="append">
                                <i class="el-icon-date calcCursor" @click="computeDate" title="计算"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
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
                <el-col :span="12">
                    <el-form-item label="考核部门" prop="checkDepart">
                      <el-select class="allWidth" @change="selectDepart" v-model="form.checkDepart">
                        <el-option v-for="item in depart"
                                   :key="item.id"
                                   :label="item.departName"
                                   :value="item.id+''"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
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
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input class="allWidth" v-model="form.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col  :span="24">
                    <el-form-item label="附件">
                        <mind-upload :callBack="callback" :multiple="false" :attachIds="form.attachment"  :before-upload='handleFileUploading'></mind-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="title-item mb20"><span>测量值</span></div>
        <el-row>
            <el-col :span="6" class="textStyle">
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
            <el-col :span="6" >
                <el-input v-model="item.clz1"></el-input>
            </el-col>
            <el-col :span="6">
                <el-input v-model="item.clz2"></el-input>
            </el-col>
            <el-col :span="6">
                <el-input v-model="item.clz3"></el-input>
            </el-col>
            <el-button @click="deleteOne(item,index)" style="margin-left:5px" type="warning">删除</el-button>
            <el-button type="primary" @click="addNew(item,index)" v-if="index==0">添加</el-button>
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
        </div>
        <div class="bottom_button" slot="footer">
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button  type="danger" class="back" @click="cancel">返回</el-button>
        </div>
    </mind-dialog>
</div>
</template>
<script>
import Vue from 'vue'
import $ from 'jquery'
import { ajaxRequest } from '../../../../util/base';

export default {
    name:'recordDialog',
    props:{
        type:{
            type:String,
            // required:true,
        },
        cb:{
            type:Function,
            // required:true,
        },
        data:{
            type:Object,
            // required:true
        }
    },
    data(){
        return {
            form:$.extend({},this.data),
            rules: {
                checkDate: [{ required: true,message:'考核时间不能为空', trigger: "change" }],
                estimatedTime: [{ required: true,message:'下次日期不能为空' ,trigger: "change" }],
                checkDepart: [{ required: true,message:'考核部门不能为空', trigger: "change" }],
                checkUser: [{ required: true,message:'考核人不能为空' ,trigger: "change" }],
                conclusion:[{max:200,message:'最多输入200个字符',trigger:'blur'}],
                remark:[{max:200,message:'最多输入200个字符',trigger:'blur'}],
            },
            maintainway: [],
            fileList: [], //上传文件的数组
            depart:[],//部门列表
            departMembers:[],//部门下的人员
            measuredValue: [
                { value1: undefined, value2: undefined, value3: undefined }
            ], //测量值
        }
    },
    methods:{
        cancel(){
            this.cb();
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
                if(this.form.checkUser){
                    this.getDepartMember(this.form.checkDepart)
                }
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
                this.$message.error("请先填写考核时间！");
            }
        },
        submit(){
            this.$refs.form.validate(valid => {
                if(valid){
                    let temFile = []
                    this.fileList.forEach((v,i)=>{
                        temFile.push(v.id)
                    })
                    this.form.attachment = temFile.join(',')
                    this.form.clz = JSON.stringify(this.measuredValue);
                    console.log(this.form,'cb this.form')
                    this.cb(this.form)
                }
            })
        }
    },
    mounted(){
        this.initData();
        console.log(this.form,'form')
        // 对dValue进行处理，格式出现问题
        Vue.set(this.form,'dValue1',this.form.dvalue1)
        Vue.set(this.form,'dValue2',this.form.dvalue2)
        Vue.set(this.form,'dValue3',this.form.dvalue3)
    
        // 测量值处理
        if(this.form.clzList.length>0){
            this.form.clzList.forEach((v,i)=>{
                this.measuredValue.push({clz1:v.clz1,clz2:v.clz2,clz3:v.clz3})
            })
        }
    }
}
</script>
<style scoped>
.allWidth {
  width: 100%;
}
.textStyle {
  text-align: center;
}
.color {
  color: #606266;
}
.bottom_button {
  text-align: center;
  margin-top: 10px;
}
.calcCursor{
    cursor: pointer;
    font-size: 20px;
}
.marginTop{
    margin-top: 10px;
}
</style>

