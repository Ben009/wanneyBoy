<template>
  <!-- 溯源信息 -->
  <div :class="{'applianceDetail-item':true,'eventPause':info=='traceabilityConfirm'}">
    <div class="special">
      <global-tootips>
        <p>1、本页面用于维护设备的溯源信息以及查看历史溯源记录；</p>
        <p>2、保存表示保存溯源信息，保存并送审表示保存溯源信息同时发起符合性确认流程。</p>
        <p>3、点击“计算”按钮就会根据检校周期和实际检校日期自动计算证书有效日期和计划检校日期；</p>
        <template v-if="standardId">
          <p>4、加入自检任务表示将该设备加入自检任务，需通过委托－自检要号节点进行配号后检测；</p>
          <p>5、加入外送计划表示该设备需外送校检，可将该设备加入外送计划任务；</p>
          <p>6、“自检更新”系统将自动匹配该设备在本系统证书模块中出具的证书，若已检测完毕将证书相关信息自动带入，含证书扫描件；使用该功能必须通过系统下达自检任务后自检配号操作；直接受理模式不支持该功能；</p>
        </template>
      </global-tootips>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" class="form">
      <el-Row>
        <el-col :span="8">
          <el-form-item label="证书编号" prop="certificateNo">
            <el-input v-model="form.certificateNo" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证书类型" prop="certificateType" :readonly="readonly">
            <el-autocomplete
              v-model="form.certificateType"
              :fetch-suggestions="queryCertificateTypes"
              placeholder="请输入证书类型"
              value="remark"
              value-key="remark"
              :show-overflow-tooltip="true"
              style="width:100%;"
              :debounce="500"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检校周期(月)" prop="verificationPeriod">
            <el-input v-model="form.verificationPeriod" :readonly="readonly">
              <template slot="append">
                <i @click="computeDate" class=" el-icon-date calc" title="计算"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

      </el-Row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="检校机构" prop="verificationMechanism">
            <el-autocomplete
              v-model="form.verificationMechanism"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入检校机构"
              value="remark"
              value-key="remark"
              :show-overflow-tooltip="true"
              style="width:100%;"
              :debounce="500"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="检校人员" prop="verificationPerson">
            <el-input v-model="form.verificationPerson" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检校费" prop="verificationFee">
            <el-input v-model="form.verificationFee" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-row>

        <el-col :span="8">
          <el-form-item label="实际检校日期" prop="calibrationDate">
            <el-date-picker
              :disabled="readonly"
              v-model="form.calibrationDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              class="allwidth" style="width:100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证书有效日期" prop="effectiveDate">
            <el-date-picker
              :disabled="true"
              v-model="form.effectiveDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              class="allwidth">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划检校日期" prop="scheduleDate">
            <template slot="label">
              <span>计划检校日期</span>
              <el-tooltip content="系统默认为有效日期提前1个月">
                <i class="el-icon-info fs12"></i>
              </el-tooltip>
            </template>
            <el-date-picker
              :disabled="true"
              v-model="form.scheduleDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              class="allwidth">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="系统证书" prop="zsId">
            <el-input v-model="form.certificateNo" :disabled="true" style="width: 80%;"></el-input>
            <el-input v-model="form.zsId" v-show="false"></el-input>
            <el-button type="primary" @click="toZsHtml">查看</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="证书扫描件" prop="certificateId">
          <mind-upload ref="upFiles" :limitNumb="limitNumb" :callBack="callBack" :fileList="fileList"
                       :disabled="readonly"></mind-upload>
        </el-form-item>
      </el-row>
      <div class="title-item mb20" v-if="info != 'traceabilityConfirm'"><span>审核意见:</span></div>

      <el-row v-if="info != 'traceabilityConfirm'">
        <el-col :span="24">
          <el-form-item label="审核结果" prop="departmentReviewResult">
            经确认，本次检校数据能否满足相关要求：
            <el-select v-model="form.departmentReviewResult" @change="changeResult" disabled
                       placeholder="请选择">
              <el-option label="是" value="1">
              </el-option>
              <el-option label="否" value="0">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门审核人:" prop="userName">
            <el-input v-model="form.userName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日期:" prop="departmentReviewTime">
            <el-input v-model="form.departmentReviewTime" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="审核意见:" prop="departmentReviewAdvise">
            <textarea v-model="form.departmentReviewAdvise" style="resize:vertical;" disabled></textarea>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" style="display: block; text-align: center;" v-if="saveFlag">
        <el-row>
          <el-button type="primary" @click="handleEdit" v-if="this.tableData.length>0">编辑</el-button>
          <el-button type="primary" @click="save" :disabled="disabled">周检已审核</el-button>
          <el-button type="primary" @click="handleSave" :disabled="disabled">周检并送审</el-button>
          <el-button type="primary" v-if="standardId" @click="selfCheck">自检</el-button>
          <el-button type="primary" v-if="standardId" @click="outGoing">外送</el-button>
          <el-button type="primary" v-if="standardId" @click="selfCheckUpdate">自检更新</el-button>
        </el-row>
      </span>
    <span slot="footer" class="dialog-footer" style="display: block; text-align: center;" v-if="reviewFlag">
        <el-row>
          <el-button type="primary" round @click="handleReview">审核</el-button>
        </el-row>
      </span>
    <span slot="footer" class="dialog-footer" style="display: block; text-align: center;" v-if="replayFlag">
        <el-row>
          <el-button type="primary"  @click="confirm">确认</el-button>
          <el-button type="primary"  @click="replayView">重新送审</el-button>
        </el-row>
      </span>
    <div class="title-item mb20"><span>历史溯源记录</span></div>
    <el-table :max-height="QJTableMaxHeight"
              :data="tableData"
              border
              style="width: 100%"
              class="el-table">
      <el-table-column
        type="index"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="certificateNo"
        label="证书编号">
      </el-table-column>
      <el-table-column
        prop="certificateType"
        label="证书类型">
      </el-table-column>
      <el-table-column
        prop="verificationMechanism"
        label="检校机构">
      </el-table-column>
      <el-table-column
        prop="verificationPerson"
        label="检定人员">
      </el-table-column>
      <el-table-column
        prop="verificationFee"
        label="检校费">
      </el-table-column>
      <!-- <el-table-column
        prop="verificationPeriod"
        label="检校周期">
      </el-table-column> -->
      <el-table-column
        prop="calibrationDate"
        label="实际检校日期"
        :formatter="dealDate">
      </el-table-column>
      <el-table-column
        prop="effectiveDate"
        :formatter="dealDate"
        label="证书有效期">
      </el-table-column>
      <el-table-column
        prop="scheduleDate"
        label="计划检校日期"
        :formatter="dealDate">
      </el-table-column>
      <!-- <el-table-column
        prop="updateTime"
        label="操作日期"
        :formatter="dealDate">
      </el-table-column> -->
      <el-table-column
        label="操作" width="80px">
        <template slot-scope="scope">
          <!-- <el-button type="text" style="padding:0;font-size:14px;" :disabled="readonly">
            <i class="el-icon-tickets" title="查看证书"></i>
          </el-button> -->
          <!--<el-button @click="detail(scope.row)" type="text" style="padding:0;font-size:14px;" :disabled="readonly">-->
          <!--<i class="el-icon-edit" title="详情"></i>-->
          <!--</el-button>-->
          <el-button v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,scope.row),placement:'left'}  "
                     type="text" style="padding:0;font-size:14px;" :disabled="readonly">
            <i class="el-icon-delete" title="删除"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <delivery-dialog v-if="deliveryFlag" @cancel="deliveryBack" :standardId="standardId"></delivery-dialog>

    <!-- 点击外送弹框 -->
    <mind-dialog
      title="内传更新"
      :visible="selfCheckUpdateFlag"
      dialogSize="mini"
      @close="selfCheckUpdateFlag=false"
      center>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form-item label="证书编号">
              <el-input v-model="selfCheckUpdateValue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmSelfCheckUpdate">确 定</el-button>
        </span>
    </mind-dialog>
  </div>

</template>

<script>
  import Vue from "vue";

  // 引入封装的ajax控件
  import {
    ajaxRequest,
    ajaxSyncRequest,
    ajaxProxyRequest,
    formatDate
  } from "../../../util/base";

  import $ from "jquery";
  import rightclick from "../../../../directives/rightcilck.js";
  import rightClick from "../../../../mixins/FormRightClick.js";
  import deliveryDialog from './instrumentationTabDialog/deliveryDialog.vue'

  const defaults = {}
  export default {
    name: "appliance-detail",
    components: {deliveryDialog},
    props: {
      replayId: {//审核结果
        default: ''
      },
      replayInstid: {
        default: ''
      },
      reviewId: {//证书审核
        // type:Number,
        default: ''
      },
      reviewInstid: {
        default: ''
      },
      instId: {
        // type:Number,
        default: ''
      },
      standardId: {//用来判断自检按钮是否显示
        // type:Number,
        default: ''
      },
      data: {
        type: Object
      },
      callback: {
        type: Function
      },
      info: {
        type: String,
      }
    },
    data() {
      let verificationFeeCheck = (r, v, cb) => {
        if (!v) {
          cb()
        }
        let regx = /^[0-9.]*$/g
        if (regx.test(v)) {
          cb();
        } else {
          cb(new Error('请输入数字'))
        }
      }
      return {
        //外送默认值
        traId: '',
        //外送选项
        outGoingOptions: [],
        //外送弹框
        centerDialogVisible: false,
        saveFlag: true,
        reviewFlag: false,
        replayFlag: false,
        readonly: false,//页面只可读
        audit: false,
        num: 1,
        applianceName: [],
        appliances: [],
        tableData: [],
        multipleSelection: [],
        rules: {
          registrationNo: [{
            validator: (rule, value, callback) => {
              if (!!value) {
                if (!((/^[0-9]*$/).test(value))) {
                  callback(new Error("只能输入数字"))
                } else if (value.toString().length != 9) {
                  callback(new Error("只能输入输入九位"))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }, trigger: "blur"
          }],
          certificateNo: [
            {required: true, message: "证书编号不能为空"},
            {max: 500, message: "最多输入500个字符", triggle: "blur"}
          ],
          verificationMechanism: [
            {required: true, message: "检校机构不能为空"},
            {max: 200, message: "最多输入200个字符", triggle: "blur"}
          ],
          verificationPeriod: [{
            validator: (rule, value, callback) => {
              if (!!value) {
                if (!((/^[0-9]*$/).test(value))) {
                  callback(new Error("只能输入数字"))
                } else if (value.toString().length > 2) {
                  callback(new Error("最大为两位数"))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }, trigger: "blur"
          }],
          verificationPerson: [{max: 200, message: "最多输入200个字符", triggle: "blur"}],
          verificationFee: [
            {validator: verificationFeeCheck, triggle: "blur"}
          ],
          certificateType: [{required: true, message: "不能为空"}]
        },
        departs: [],
        form: $.extend({}, defaults, this.data || {}),
        limitNumb: 3,
        fileList: [], //上传的文件
        finishedTime: new Date().format("YYYY-MM-DD HH:MM:SS"),
        toggle: false,//保存和编辑按钮切换
        editId: '',
        disabled: false,
        form1: {},//只作展示审核意见
        deliveryFlag: false,//外送弹窗flag
        selfCheckUpdateFlag: false,//自检更新弹窗flag
        selfCheckUpdateValue: undefined,//自检更新输入内容
      };
    },
    directives: {rightclick},
    mixins: [rightClick],
    created() {
      //判断按钮显示
      if (this.reviewId) {
        this.saveFlag = false
        this.reviewFlag = true
        this.replayFlag = false
        this.readonly = true
      }
      if (this.replayId) {
        this.saveFlag = false
        this.reviewFlag = false
        this.replayFlag = true
        this.audit = true
        this.readonly = true
      }
      //获取溯源历史记录
      if (this.instId || this.standardId) {
        this.getTableList();
      }

      //获取审核信息
      if (this.replayId) {
        ajaxRequest('get', "back/instrmentationAud/?id=" + this.replayId, {}, res => {
          this.form = res.daoResult;
        })
      }
    },
    computed: {},
    methods: {
      //获取溯源记录
      getTableList() {
        if (this.instId || this.standardId) {
          ajaxRequest("get", "back/instrmentationAud/getInstrmentationAudByInstId?instId=" + (this.instId ? this.instId : this.standardId), {}, res => {
              this.tableData = res;
              if (this.tableData.length > 0) {
                //展示最新的一条至上方
                this.detail(this.tableData[0]);
              }
            }
          );
        }
      },
      //确认
      confirm() {
          this.$confirm("确认审核?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            delete this.form['addTime']
            delete this.form['updateTime']
            ajaxRequest('put', "back/instrmentationAud/confirmReview", this.form, res => {
              if (res.code === 200) {
                this.$router.push({
                  path: '/admin/762'
                })
              }
            })
          })
      },
      //重新送审
      replayView() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$confirm("确认重新送审?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              delete this.form['addTime']
              delete this.form['updateTime']
              ajaxRequest('put', "back/instrmentationAud/reSubmitReview", {
                id: this.replayId,
                instId: this.instId
              }, res => {
                if (res.code === 200) {
                  this.$router.push({
                    path: '/admin/762'
                  })
                }
              })
            })
          }
        })
      },
      //改变审核结果
      changeResult() {
        if (this.form.departmentReviewResult == "1") {
          this.form.departmentReviewAdvise = "同意"
        } else {
          this.form.departmentReviewAdvise = ''
        }
      },
      handleReview() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$confirm("确认审核?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              delete this.form['addTime']
              delete this.form['updateTime']
              this.form.id = this.reviewId,
                this.form.instId = this.reviewInstid
              ajaxRequest('PUT', "back/instrmentationAud/certificateReview", this.form, res => {
                if (res.code === 200) {
                  this.$message.success('审核成功')
                  this.$router.push({
                    path: '/admin/389'
                  })
                } else {
                  this.$message.error('审核失败')
                }
              })
            })
          } else {
            return false
          }
        })

      },
      //取消编辑
      handleCancel() {
        this.toggle = false
        this.$refs.form.resetFields();
        this.$refs.upFiles.deleteFile()
      },
      //编辑
      handleEdit() {
        let annexs = ''
        if (this.fileList.length > 0) {
          for (let i = 0; i < this.fileList.length; i++) {
            annexs = this.fileList[i].id + ',' + annexs
          }
        }
        if (annexs != '') {
          annexs = annexs.substring(0, annexs.length - 1)
          this.form.certificateId = annexs
        }
        this.$confirm("确认编辑?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.form.id = this.editId;
          ajaxRequest('PUT', "back/instrmentationAud/", this.form, res => {
            if (res.code == 200) {
              this.$message.success("编辑成功");
              this.getTableList();
            } else {
              this.$message.error("编辑失败");
            }
          })
        })
      },
      //详情
      detail(row) {
        this.toggle = true
        this.editId = row.id
        this.$refs.form.resetFields();
        if (row.certificateId) {
          this.$refs.upFiles.loadAttacheIds(row.certificateId);
        }
        console.log(row, 'row-----');
        this.form = Object.assign(
          {},
          {
            registrationNo: row.registrationNo,
            certificateType: String(row.certificateType),
            verificationMechanism: row.verificationMechanism,
            calibrationDate: row.calibrationDate,
            certificateNo: row.certificateNo,
            effectiveDate: row.effectiveDate,
            scheduleDate: row.scheduleDate,
            verificationFee: row.verificationFee,
            verificationPeriod: row.verificationPeriod,
            verificationPerson: row.verificationPerson,
            departmentReviewResult:row.departmentReviewResult,
            departmentReviewTime:row.departmentReviewTime?new Date(row.departmentReviewTime).format("YYYY-MM-DD"):'',
            departmentReviewAdvise:row.departmentReviewAdvise,
            userName:row.userName,
            zsId: row.zsId
          }
        );
      },
      //删除数据
      handleDelete: function (data) {
          ajaxRequest("PUT","back/instrmentationAud/",{isDelete: 1, id: data.id}, res =>{
              if (res.code == 200) {
                this.$message.success("删除成功");
                this.getTableList();
              } else {
                this.$message.error("删除失败");
              }
            }
          );
      },
      //表格日期格式化
      dealDate: function (row, column, cellValue) {
        if (!cellValue) {
          return "";
        }
        if (cellValue) {
          return new Date(cellValue).format("YYYY-MM-DD");
        }
      },
      //保存已审核
      save() {
        this.$confirm( < div > < p
        style = "text-align:center" > 您正在修改该设备溯源信息 </p>
          <p style = "text-align:center" > 若本次修改的内容为新的周检记录，需将该记录保存至该设备的历史溯源记录，请点击“周检，</p>
          <p style = "text-align:center" > 若本次修改的内容仅是修改原溯源信息，并非新的周检信息，请点击“修改”</p>
          < p style = "text-align:center" > 不提交选择取消。</p></div >, '提示', {
          confirmButtonText: '修改',
          cancelButtonText: '取消',
          center: true,
          type: 'warning'
        }
      ).
        then(() => {
          let annexs = ''
          if (this.fileList.length > 0) {
            for (let i = 0; i < this.fileList.length; i++) {
              annexs = this.fileList[i].id + ',' + annexs
            }
          }
          if (annexs != '') {
            annexs = annexs.substring(0, annexs.length - 1)
            this.form.certificateId = annexs
          }
          this.$refs.form.validate(valid => {
            if (valid) {
              ajaxRequest('get', 'back/instrmentationAud/getCountInstrAudNum?instId=' + this.instId, {}, res => {
                if (res.auditingCount > 0) {
                  this.$message.error('存在审核未完成的周检信息禁止保存')
                } else {
                  this.$confirm("确认保存?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    center: true,
                    type: "warning"
                  }).then(() => {
                    delete this.form['status']
                    this.form.isFinished = 1,
                      this.form.instId = this.instId,
                      ajaxRequest("post", "back/instrmentationAud/", this.form, res => {
                        if (res.code === 200) {
                          this.$message.success("保存成功");
                          this.$refs.form.resetFields();
                          this.$refs.upFiles.deleteFile()
                          this.getTableList();

                        }
                      });
                  });
                }
              })

            } else {
              return false;
            }
          });
        })
      },
      //保存并送审
      handleSave() {
        this.$confirm(
          < div > < p style = "text-align:center" > 您正在修改该设备溯源信息 </p>
          <p style = "text-align:center" > 若本次修改的内容为新的周检记录，需将该记录保存至该设备的历史溯源记录，请点击“周检，</p>
          <p style = "text-align:center" > 若本次修改的内容仅是修改原溯源信息，并非新的周检信息，请点击“修改”</p>
          <p style = "text-align:center" > 不提交选择取消。</p></div >, '提示', {
          confirmButtonText: '修改',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }
      ).
        then(() => {
          let annexs = ''
          if (this.fileList.length > 0) {
            for (let i = 0; i < this.fileList.length; i++) {
              annexs = this.fileList[i].id + ',' + annexs
            }
          }
          if (annexs != '') {
            annexs = annexs.substring(0, annexs.length - 1)
            this.form.certificateId = annexs
          }
          this.$refs.form.validate(valid => {
            if (valid) {
              if (this.instId != "") {
                ajaxRequest('get', 'back/instrmentationAud/getCountInstrAudNum?instId=' + this.instId, {}, res => {
                  if (res.auditingCount > 0) {
                    this.$message.error('存在审核未完成的周检信息禁止保存')
                  } else {
                    this.$confirm("确认保存?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      center: true,
                      type: "warning"
                    }).then(() => {
                      delete this.form['isFinished']
                      delete this.form['finishedTime']
                      this.form.status = 0;
                      this.form.instId = this.instId
                      ajaxRequest("post", "back/instrmentationAud/", this.form, res => {
                        if (res.code === 200) {
                          this.$message.success("保存成功");
                          this.$refs.form.resetFields();
                          this.$refs.upFiles.deleteFile()
                          this.getTableList();
                        }
                      });
                    });
                  }
                })
              }
            } else {
              return false;
            }
          });
        })
      },
      //自检
      selfCheck() {
        ajaxRequest('get', 'back/instrmentationAud/getCountInstrAudNum?instId=' + this.instId, {}, res => {
          if (res.isFinshedCount > 0) {
            this.$message.error('该设备已安排计划自检,当前周检未完成请至“周检查询”节点设置')
          } else {
            this.$confirm("确认自检?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              center: true,
              type: "warning"
            }).then(() => {
              ajaxRequest("post", "back/instrmentationAud/insertInstrumentationTraDetail?instId=" + this.instId, {source: 4}, res => {
                if (res.code === 200) {
                  this.$message.success("自检成功");
                }
              });
            });
          }
        })
      },
      //外送
      outGoing() {
        ajaxRequest('get', 'back/instrmentationAud/getCountInstrAudNum?instId=' + this.standardId, {}, res => {
          if (res.statusCount > 0) {
            this.$message.error('状态非（正常）禁止外送')
          } else if (res.JhWsCount > 0) {
            this.$message.error('已在外检计划中，该计划未结束')
          } else if (res.DdWsCount > 0) {
            this.$message.error('该设备已于外检计划时自行外送当前溯源信息未更新')
          } else {
            this.deliveryFlag = true
          }
        })
      },
      //确认外送
      outGoingConfirm() {
        let source = ''
        if (this.traId == '') {
          source = 5
        } else {
          source = 2
        }
        ajaxRequest("post", "back/instrmentationAud/insertInstrumentationTraDetail?instId=" + this.instId, {
          traId: this.traId,
          source: source
        }, res => {
          if (res.code === 200) {
            this.$message.success("外送成功");
            this.centerDialogVisible = false
          }
        });
      },
      selfCheckUpdate() {
        //  点自检更新；系统依据ID自动去证书库中匹配；取最新的一条记录；
        //  如果取到：将校检日期、有效期（如果为空，按照校检日期+周期计算）、下次计划日期、校检员、校检费用、证书号带过来；
        //  同时证书编号填入证书扫描件，点查看的时候通过这个编号去查看证书；
        //  处理方式是将form表单的数据赋值为请求获取的数据
        ajaxRequest("get", "back/instrumentation/getZsInfo", {id: this.instId}, res => {
          if (res.code === 200) {
            //找到证书，更新表单数据
            if (res.map.isHaveZs) {
              let zsId = res.map.zsId;
              this.form.zsId = zsId;
              this.form.certificateNo = res.map.zs_bh;//证书编号
              this.form.calibrationDate = res.map.zsjdrq;//检定日期
              this.form.effectiveDate = res.map.zsyxrq;//有效期
              this.form.verificationPeriod = res.map.jdzq;//周期
              this.form.verificationPerson = res.map.jdy//检定员
              this.form.verificationFee = res.map.verificationFee//工作量
            } else {
              //找不到证书
              this.$confirm('找不到该自检登记号，是否通过输入证书编号查找更新?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.selfCheckUpdateFlag = true;
              }).catch(() => {
                // 取消操作
              })
            }
          } else if (res.code === 300) {
            this.$message.error("非自检，无法自检更新");
          }
        });
      },
      // 输入证书编号后的请求
      confirmSelfCheckUpdate() {
        let zsbh = this.selfCheckUpdateValue;
        if (!zsbh) {
          this.$message.error("证书编号不能为空");
        } else {
          // 发送查找请求
          ajaxRequest("get", "back/instrumentation/getZsInfoByZsbh", {zsbh: zsbh}, res => {
              if (res.code === 200) {
                let zsId = res.map.zsId;
                this.form.zsId = zsId;
                this.form.certificateNo = res.map.zs_bh;//证书编号
                this.form.calibrationDate = res.map.zsjdrq;//检定日期
                this.form.effectiveDate = res.map.zsyxrq;//有效期
                this.form.verificationPeriod = res.map.jdzq;//周期
                this.form.verificationPerson = res.map.jdy//检定员
                this.form.verificationFee = res.map.verificationFee//工作量
                this.selfCheckUpdateFlag = false
              } else if (res.code === 300) {
                this.$message.error("查询不到此证书！")
              }
            }
          );
        }
      },
      //计算日期
      computeDate() {
        if (!this.form.verificationPeriod == "") {
          if (this.form.verificationPeriod.length <= 2 && this.form.verificationPeriod.match(/[0-9]/g)) {
            // this.form.verificationPeriod  检校周期
            //计算证书有效日期
            let now = new Date(this.form.calibrationDate); // 获取需要计算的时间
            let monthNow = new Date(
              now.setMonth(now.getMonth() + Number(this.form.verificationPeriod))
            ); // 计算增加(检校周期)月的时间
            let effectiveDate = new Date(monthNow.setDate(monthNow.getDate() - 1)); // 计算增加(检校周期)月减去一天的时间

            //计算实际检校日期
            let monthNow1 = new Date(now.setMonth(now.getMonth() - 1)); // 计算增加(检校周期)月的时间
            let scheduleDate = new Date(monthNow1.setDate(monthNow1.getDate())); // 计算增加(检校周期)月减去一个月的时间
            // this.$refs.form.validateField('verificationPeriod',(valid)=>{
            Vue.set(
              this.form,
              "effectiveDate",
              new Date(effectiveDate).format("YYYY-MM-DD")
            );
            Vue.set(
              this.form,
              "scheduleDate",
              new Date(scheduleDate).format("YYYY-MM-DD")
            );
          }
        } else {
          this.$message.error("请先填写检校周期");
        }
      },
      //callBack上传组件数据发生变化回调
      callBack(file, list) {
        this.fileList = list
      },
      // 外送返回
      deliveryBack() {
        this.deliveryFlag = false;
      },
      querySearchAsync(queryString, cb) {
        if (!queryString || queryString == undefined || queryString == "") {
          cb([]);
        } else {
          // 此接口要改变形式，换成下面的那种形式进行模糊搜索
          ajaxProxyRequest("get", "/njmind/findParam/verificationMechanism", {}, res => {
            cb(res.list)
          });
        }
      },
      //查看证书html
      toZsHtml() {
        alert(this.form.zsId);
      },
      //证书类别
      queryCertificateTypes(queryString, cb) {
        if (!queryString || queryString == undefined || queryString == "") {
          cb([]);
        } else {
          // 此接口要改变形式，换成下面的那种形式进行模糊搜索
          ajaxProxyRequest("get", "/njmind/findParam/inStrcertificateType", {}, res => {
            cb(res.list)
          });
        }
      }
    },
    mounted() {
      console.log(this.standardId)
      // this.getTableList();

    },
    updated() {

    }
  };
</script>

<style scoped>
  .mb20 {
    margin-bottom: 20px !important;
  }

  .calcDate {
    width: 100% !important;
    margin-right: 10px;
  }

  .el-table {
    margin-top: 20px !important;
  }

  .allwidth {
    width: 100% !important;
  }

  .calc {
    cursor: pointer;
  }

  .eventPause {
    pointer-events: none;
  }

  .special {
    display: flex;
    justify-content: flex-end;
    pointer-events: auto;
  }
</style>
