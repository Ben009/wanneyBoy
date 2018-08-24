<!-- author：黄溧  注释原因：重复 如果没用可删除-->
<template>
  <el-form :model="form" :rules="rules" class="placeholder-body">
    <table>
      <colgroup>
        <col v-for="(item,index) in headList[0]" :width="item.width">
      </colgroup>
      <tbody id="rdata">
      <tr v-for="head in headList">
        <td v-for="(item,index) in head" :required="item.name === 'applianceUse' ? applianceRequired : item.required" :name="item.name" :colspan="item.colspan" :rowspan="item.rowspan">

          <span v-if="item.dom === 'order'">{{dataindex+1}}</span>
          <span v-if="item.dom === 'span'">{{form[item.name]}}</span>
          <div v-if="item.dom === 'select'">
            <!--部门联动岗位-->
            <mind-select v-if="item.name=='departId'"
                         v-model="form[item.name]"
                         :options="item.options"
                         :optionsConfig="{label:'departName',value:'id'}"
                         :extraConfig="{'size':'small','disabled':item.disabled}"
                         :changeCallback="refreshPostOptions"></mind-select>
            <!--岗位-->
            <mind-select v-else-if="item.name=='postId'"
                         v-model="form[item.name]"
                         :options="postOptions[form.departId]"
                         :optionsConfig="{label:'postName',value:'id'}"
                         :extraConfig="{'size':'small','disabled':item.disabled}"
                         :changeCallback="handlePostChange"></mind-select>
            <!--分包区域联动证书数量-->
            <mind-select v-else-if="item.name=='subcontractArea'"
                         v-model="form[item.name]"
                         :options="item.options"
                         :extraConfig="{'size':'small','disabled':item.disabled}"
                         :changeCallback="handleAreaChange"></mind-select>
            <!--器具用途-->
            <mind-select v-else-if="item.name=='applianceUse'"
                         v-model="form[item.name]"
                         :options="applianceUseOptions"
                         :extraConfig="{'disabled':applianceDisabled}"
            ></mind-select>
            <!--是否加急联动检测期限-->
            <mind-select v-else-if="item.name=='urgentDayPercent'"
                         v-model="form[item.name]"
                         :options="item.options"
                         :extraConfig="{'size':'small','disabled':item.disabled}"
                         :changeCallback="handleIsUrgentChange"></mind-select>
            <mind-select v-else
                         v-model="form[item.name]"
                         :options="item.options"
                         :extraConfig="{'size':'small','disabled':item.disabled}"></mind-select>
          </div>
          <div v-if="item.dom === 'inputNumber'">
            <el-input-number :ref="item.name" v-if="item.name=='setNumber'" v-focus-next-on-enter="item.nextValJson" v-model="form[item.name]" :type="item.type" size="small" :min="1" :max="999" :controls="false"
                    style="width:50%"  @change="handleSetNumberChange" :disabled="item.disabled"></el-input-number>
            <!-- <el-input v-else-if="item.name=='certificateNumber'" v-model="form[item.name]" :type="item.type"
                      size="small" min="0" @change="handleCertificateNumberChange" :disabled="item.disabled"></el-input> -->
            <el-input-number v-else-if="item.name=='pieceNumber'" v-model="form[item.name]" :type="item.type" size="small" :min="1" :controls="false"
                    style="width:50%"  @change="handlePieceNumberChange" :disabled="item.disabled"></el-input-number>
          </div>
          <div v-if="item.dom === 'input'">
            <el-input :ref="item.name" @input="valueChange(item.name)" v-model="form[item.name]" :type="item.type" size="small" v-if="!form[item.name]"
                      :min="item.type=='number'?0:null"
                      :disabled="item.disabled"
                      v-focus-next-on-enter="item.nextValJson"
                      ></el-input>
                      <el-popover
              v-if="form[item.name]"
              :visible-arrow="false"
              trigger="hover">
              <div v-html="form[item.name]"></div>
              <el-input :ref="item.name" slot="reference" v-model="form[item.name]" :type="item.type" size="small"
              :min="item.type=='number'?0:null"
             :disabled="item.disabled" ></el-input>
            </el-popover>

          </div>
          <div v-if="item.dom === 'checkbox'">
            <!--是否强检-->
            <mind-checkbox v-if="item.name=='isCompulsoryVerify'" v-model="form[item.name]"
                           :change="handleCompulsoryVerifyChange"
                           :extraConfig="{'disabled':item.disabled}"></mind-checkbox>
            <mind-checkbox v-else v-model="form[item.name]" :extraConfig="{'disabled':item.disabled}"></mind-checkbox>

          </div>
          <div v-if="item.dom === 'date'">
            <el-date-picker
              :disabled="item.disabled"
              :clearable="!item.disabled"
              v-model="form[item.name]"
              size="small"
              style="max-width:135px"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <!--复选框和输入框-->
          <div v-if="item.dom === 'advancedChecbox'">
            <template v-if="item.name === 'registrationNo'">
              <mind-checkbox :change="handleAdvancedChexbox" :extraConfig="{'disabled':item.disabled}" v-model="advancedChecked">
                </mind-checkbox>{{form[item.name]}}
            </template>
            <template v-else>
              <mind-checkbox :change="handleAdvancedChexbox" :extraConfig="{'disabled':item.disabled}"
                           v-model="advancedChecked"></mind-checkbox>
            <el-input v-model="form[item.name]" :type="item.type" size="small"
                      :clearable="item.type !== 'number' && !item.disabled" :min="item.type=='number'?0:null"
                      style="display:inline-block;width:80%" :disabled="item.disabled"></el-input>
            </template>
          </div>
          <!-- 高级检索 -->
          <div v-if="item.dom === 'advancedInput'" style="position: relative;">

            <!--<el-input :ref="item.name" v-focus-next-on-enter="item.nextValJson" size="small" v-model="form[item.name]" clearable @input="handleChange(item)"></el-input>

            <RelativeList v-if="relativeData.length && isRelative" :relativeData="relativeData" :show="show"
                          :setValue="setValue" :columnsInfo="columnsInfo"/>-->

            <el-autocomplete
              v-focus-next-on-enter="item.nextValJson"
              popper-class="qb-popper-auto-item"
              v-model="form[item.name]"
              :fetch-suggestions="querySearch.bind(this,item)"
              @keyup.enter.native="enterSelectDefault"
            >
              <template slot-scope="{ item }" >
                <div v-if="item.type!=='more'" class="auto-item">
                  <span v-for="info in columnsInfo.moreInfo" @click="setValue(item)" :ref='"selectItem"+item.index' >{{info.head}}{{item[info.nameCode]}}</span>
                </div>
                <div v-if="item.type==='more'" @click="show" class="more">更多</div>

              </template>
            </el-autocomplete>
          </div>
          <!-- 高级检索end -->
          <template v-if="item.dom === 'none'" :rowspan="item.rowspan" style="border-bottom:1px red  dashed;">
            <!-- <el-button type="primary" @click="add" v-if="instrumentAddCopyShow === '0'" style="padding:4px;font-size:12px;margin-left:0;">增加</el-button>
            <el-button type="warning" @click="copy" v-if="instrumentAddCopyShow === '0'" style="padding:4px;font-size:12px;margin-left:0; background:#fbb142; border:#fbb142;">复制</el-button>
            <el-button type="danger" @click="del" v-if="instrumentDelShow === '0'" style="padding:4px;font-size:12px;margin-left:0;">删除</el-button> -->
          <el-button type="text" @click="add" v-if="instrumentAddCopyShow === '0'" style="padding:2px;font-size:18px;margin-left:0;">
              <i class="el-icon-circle-plus" title="增加"></i>
            </el-button>
            <el-button type="text" @click="copy" v-if="instrumentAddCopyShow === '0'" style="padding:2px;font-size:18px;margin-left:0;">
              <i class="el-icon-njm-copy" title="复制"></i>
              <!-- el-icon-njm-copy         -->
            </el-button>
            <el-button type="text" @click="del" v-if="instrumentDelShow === '0'" style="padding:2px;font-size:18px;margin-left:0;">
              <i class="el-icon-delete" style="color:red" title="删除"></i>
            </el-button>
          </template>

          <template v-if="item.dom === 'certificateNumber'" :rowspan="item.rowspan">
            <span>{{form[item.name]}}</span>
            <!-- <el-button type="primary" v-show="form.subcontractArea === '0'"
                       style="padding:2px;font-size:14px;margin-left:2px;background:#ff7777;border:#ff7777;" @click="changeCertificateNumber">
              {{form.certificateNumber === 0 ? '需出证' : '无需出证'}}
            </el-button> -->

            <el-button type="text" v-show="form.subcontractArea === '0'" style="padding:0;font-size:18px;"
                        @click="changeCertificateNumber">
              <i v-if="form.certificateNumber === 0" class="el-icon-circle-check-outline" title="需出证"></i>
              <i v-else class="el-icon-circle-close-outline" style="color:red" title="无需出证"></i>
            </el-button>

          </template>
        </td>
      </tr>

      </tbody>
    </table>
    <more-list v-if="isShow" :callback="handleCallBack" :relativeData="relativeData" :columnsInfo="columnsInfo"
               :ajaxChangeUrl="ajaxChangeUrl"></more-list>
  </el-form>
</template>


<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import {ajaxRequest, ajaxSyncRequest, ajaxProxyRequest, ajaxSyncProxyRequest} from '../../util/base'
  import RelativeList from './RelativeList.vue'
  import MoreList from './MoreList.vue'

/*   import {Form, FormItem, Input, InputNumber, Option} from 'element--ui'
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(InputNumber) */

  export default {
    name: 'instrument-info-item',
    props: {
      dataindex: {required: true, type: Number},
      data: {required: true, type: Object},
      postCorre: { type: Object},
      columnsInfo: {required: true, type: Object},
      headList: {required: true, type: Array},

      isAdvancedChecked: {required: true},

      add: {required: true, type: Function},
      copy: {required: true, type: Function},
      del: {required: true, type: Function},
      wtdInfo:{type:Object},
      instrumentAddCopyShow:{required:true,type:String},
      instrumentDelShow:{required:true,type:String},
    },
    data() {
      return {
        // author：黄溧  注释原因：重复 如果没用可删除

        rules: {
          applianceName: [{required: true, message: '参数名不能为空'}],
          applianceActualName:[{max:200, message:'最多输入200个字符', trigger:'blur'}],
          model:[{max:200, message:'最多输入200个字符', trigger:'blur'}],
          measureRange:[{max:200, message:'最多输入200个字符', trigger:'blur'}],
          equipmentNo:[{max:200, message:'最多输入200个字符', trigger:'blur'}],
          factoryNo:[{max:200, message:'最多输入200个字符', trigger:'blur'}],
          manufacturer:[{max:200, message:'最多输入200个字符', trigger:'blur'}],
          detectionParameter:[{max:200, message:'最多输入200个字符', trigger:'blur'}],
        },

        isShow: false,
        relativeData: [],
        ajaxChangeUrl: '',
        isRelative: 0,
        form: this.data,

        options: $.extend({},this.postCorre),//岗位下拉 部门ID 对应岗位options
        applianceDisabled: !Boolean(this.data.isCompulsoryVerify === '1' || this.data.isCompulsoryVerify),  //器具用途是否禁用取决于强检
        applianceRequired: Boolean(this.data.isCompulsoryVerify === '1' || this.data.isCompulsoryVerify),   //器具用途是否必填取决于强检
        applianceUseChange: ''
      }
    },
    // author：黄溧  注释原因：重复 如果没用可删除
    computed: {

      /*计算器具用途options*/
      applianceUseOptions() {
        let options = [];
        this.headList.forEach(u => {
          u.forEach(v => {
            if (v.name == 'applianceUse') {
              options = v.options;
            }else if(v.name == 'detectionDeadline'){
              if(this.form.urgentDayPercent){
              let urgentDays = this.form.urgentDayPercent.split("@@")[0];
              if(!urgentDays || urgentDays == 'null'){
                this.form.urgentDayPercent = '0@@0';
                urgentDays = 0;
              }
              if(this.form.postId){
                ajaxRequest('get', "back/entrustSjd/getDetectionDeadline", {
                  postId: this.form.postId,
                  urgentDay: urgentDays,
                  serviceDate:this.wtdInfo.serviceDate
                }, (res) => {
                  if (res.code == 200) {
                    Vue.set(this.form,"detectionDeadline",res.daoResult)
                  }
                });
              }
              }
            }
          })
        });
        console.log('ddddddddddddddddddd', this.form.applianceName,)
        if (this.form.applianceName && this.applianceUseChange && !this.applianceDisabled) {
          let arr = this.applianceUseChange.split(','), temp = [];
          if(this.form.applianceUse && this.form.applianceUse.indexOf(',') != -1){
          Vue.set(this.form, 'applianceUse', arr[0]);
          }
          arr.forEach(item => {
            options.forEach(v => {
              if (v.code == item) {
                temp.push(v)
              }
            })
          });
          return temp
        } else {
          return options
        }
      },

      /*计算岗位options*/
      postOptions: function () {
        let obj = $.extend({}, this.options);
        if (this.form.departId && !obj[this.form.departId]) {
          let op = this.refreshPostOptions(this.form.departId,this.form.postId);
          obj[this.form.departId] = op;
        }
        return obj
      },
      advancedChecked: {
        get: function () {
          return this.isAdvancedChecked
        },
        set: function () {

        }
      }
    },

    mounted() {
      this.applianceUseChange = this.form.com_applianceUseChange ? this.form.com_applianceUseChange : '';
    },
    methods: {
      changeCertificateNumber(index) {
        if (this.form.certificateNumber !== 0) {
          Vue.set(this.form, 'certificateNumber', 0);
        } else {
          Vue.set(this.form, 'certificateNumber', this.form.setNumber);
        }
      },
      /**
       * [valueChange 为了解决input显示和隐藏时表格没有聚焦的问题]
       * @param  {[type]} slug [description]
       * @return {[type]}      [description]
       */
      valueChange(slug){
        this.$nextTick(()=>{
          this.$refs[slug][0].focus()
        })
      },
      /*********************************联动相关change事件*******************************/
      /*套数与证书数量相同*/
      handleSetNumberChange(value) {
        if (value < 0) {
          this.$message.error('数量不能小于0');
          Vue.set(this.form, 'setNumber', 0);
          return
        }
        if(this.form.subcontractArea == 0) {
          Vue.set(this.form, 'certificateNumber', value);
        }else{
          Vue.set(this.form, 'certificateNumber', 0);
        }
      },
      /*检验证书数量是否大于套数*/
      handleCertificateNumberChange(value) {
        if (value < 0) {
          this.$message.error('数量不能小于0');
          Vue.set(this.form, 'certificateNumber', 0);
          return
        }
        if (value > this.form.setNumber) {
          this.$message({
            type: 'error',
            message: '证书数量不能大于套数 '
          })
        }
      },
      handlePieceNumberChange(name, type, value) {
        if (value < 0) {
          this.$message.error('数量不能小于0');
          Vue.set(this.form, 'pieceNumber', 0);
          return
        }
      },
      /*分包区域change将证书数量置0*/
      handleAreaChange(value) {
        if (value !== '0') {
          Vue.set(this.form, 'certificateNumber', 0);

        } else {
          Vue.set(this.form, 'certificateNumber', this.form.setNumber);

        }
      },
      /*是否加急change重新计算检测期限*/
      handleIsUrgentChange(value){
        if(!value){return}
        let urgentDays = value.split("@@")[0];
        if(this.form.postId){
          ajaxRequest('get', "back/entrustSjd/getDetectionDeadline", {
            postId: this.form.postId,
            urgentDay: urgentDays,
            serviceDate:this.wtdInfo.serviceDate
          }, (res) => {
            if (res.code == 200) {
              Vue.set(this.form,"detectionDeadline",res.daoResult)
            }
          });
        }
      },
      handlePostChange(value){
         this.handleIsUrgentChange(this.form.urgentDayPercent);
      },
      /*是否强检控制是否可选器具用途*/
      handleCompulsoryVerifyChange(value) {
        this.applianceDisabled = !value;
        this.applianceRequired = value;
        Vue.set(this.form, 'applianceUse', '');
      },
      /**********************************advancedChecbox change事件**********************************************/
      handleAdvancedChexbox(value) {
        /*触发父组件事件 改变选中的数据*/
        if (value) {
          this.$emit('selection-change', this.form, 'add');
        } else {
          this.$emit('selection-change', this.form, 'delete');
        }
      },

      /*相关列表选择数据*/
      setValue(row) {
        console.log(row,'rowwwwwwwwwww')
        if (row) {
          if(row.status == 2){
            this.$confirm('该检测项目已临时停止，暂停时间为'+row.suspendBeginDate+'~'+row.suspendEndDate+'，确定添加？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.setApplianceValue(row);
            }).catch(() => {
              // 取消操作
            })
          }else{
            this.setApplianceValue(row);
          }
        }
      },
      setApplianceValue(row){
            /*重新计算器具用途列表*/
          this.applianceUseChange = row.applianceUse;
          Vue.set(this.form, 'com_applianceUseChange', row.applianceUse);
          /*重新拉取岗位*/
          if (!this.options[row.departId]) {
            this.refreshPostOptions(row.departId,row.postId)
          }
          this.isRelative = 0;
          /*手输字段不赋值*/
          let temp = [].concat(this.headList[0], this.headList[1]);
          //手动隐藏赋值
          //计量器具id
          Vue.set(this.form,'applianceId',row.id);
          Vue.set(this.form,'source',row.source ? row.source : 0);
          //是否授权
          if(row.isCalibrationAuth === '1' ||
             row.isCnasAuth === '1' ||
             row.isVerifyAuth === '1'){
            Vue.set(this.form,'isAuthorise','1');
          }else{
            Vue.set(this.form,'isAuthorise','0');
          }


          temp.forEach(v => {
            if (!v.isHandWriting) {
              if (v.name === "applianceActualName") {//器具实际名称，如果有值，不覆盖
                if (this.form.applianceActualName === "" || this.form.applianceActualName == null) {
                  Vue.set(this.form, v.name, row["applianceName"])
                }
              } else if (v.name === "detectionDeadline") {//检测期限，计算
                ajaxRequest('get', "back/entrustSjd/getDetectionDeadline", {
                  postId: row["postId"],
                  urgentDay: 0,
                  serviceDate:this.wtdInfo.serviceDate
                }, (res) => {
                  if (res.code == 200) {
                    Vue.set(this.form,v.name,res.daoResult)
                  }
                });
              } else {
                Vue.set(this.form, v.name, row[v.name])
              }
            }
          });

          this.form = $.extend(this.form,row,{});

          Vue.set(this.form, 'isCompulsoryVerify', Boolean(this.form.isCompulsoryVerify!="0"));
          this.applianceDisabled = !this.form.isCompulsoryVerify;
          this.applianceRequired = this.form.isCompulsoryVerify;

          Vue.set(this.form, 'id', row.id);
          this.$emit('select-value', this.form, this.dataindex);
          },
      show() {
        this.isShow = 1;
        this.isRelative = 0;
      },
      /*handleChange(item) {
        console.log(item, this.form[item.name])
        if (this.form[item.name]) {
          let param = $.extend({}, {[item.name]: this.form[item.name],companyId:this.wtdInfo.companyId,planApplianceId:this.wtdInfo.planApplianceId}, item.parameter);
          ajaxRequest('get', item.ajaxChangeUrl, param, (res) => {
            if (res.code == 200) {
              this.relativeData = res.rows;
              this.relativeData.length > 0 ? this.isRelative = 1 : null;
              this.ajaxChangeUrl = item.ajaxChangeUrl;
            }
          })
        } else {
          this.isRelative = 0;
        }
      },*/
      refreshPostOptions(departId,postId) {
        let options = [],obj=$.extend({},this.options);
        if (departId) {
          ajaxSyncRequest('get', 'back/post/listByDeptId/' + departId, {isDelete: 0}, (res) => {
            options = res.rows;
            obj[departId]=options;
            this.$emit('post-add',obj);
            Vue.set(this.options, departId, options);
            if(res.rows.length == 1){
              Vue.set(this.form,'postId',res.rows[0].id);
              this.handlePostChange(res.rows[0].id);
            }else{
              // if()
             Vue.set(this.form,'postId',postId);
            }
          })
        }
        return options
      },
       querySearch(item,params,cb){
         console.log(item,params,cb)
         if(params){
           let queryString = params ? {
               [item.name]: params
             } : {},
             _this = this;
           let param = $.extend({},queryString,{companyId:this.wtdInfo.companyId,planApplianceId:this.wtdInfo.planApplianceId,moduleFlag:item.moduleFlag},item.parameter);
           ajaxRequest('get',item.ajaxChangeUrl, param , (res)=> {
             if (res.code === 200) {
               if(res.rows.length>0){
                 _this.handleResult(res.rows,item.name);
                 cb(res.rows);
               }else{
                 cb([]);
                 Vue.set(this.form,item.name,'');
               }

             }
             else {
               _this.$message.error('获取数据失败')
             }
           })
         }else{
           cb([])
         }

       },

       handleResult(res,name) {
         for(let key in res){
           Vue.set(res[key],'value',res[key][name])
           Vue.set(res[key],'index',key)
         }
         res.push({
           type:'more'
         })

         this.relativeData=res;
       },

      handleCallBack(row) {
        this.isShow = false;
        this.setValue(row);
      },
      /*handleSelect(item){
        if(item.type === 'more'){
          this.isShow=true;
        }else{
          this.form = item;
        }
        this.$emit('select-value',item,this.dataindex);
      },*/
      enterSelectDefault(){
        this.$refs.selectItem0[0].click();
      },
      test() {
        let flag = true;
        $("#rdata tr td").each(function (i, tds) {
          let rq = $(this).attr("required");
          // console.log("ddd"+i,rq,$(this).find("input").val());
          $(this).removeClass('error')
          $(this).removeClass('success')
          if (rq && ($(this).find("input").val() == '' || $(this).find("input").val() == null)) {
            flag = false;
            $(this).addClass('error').find("input").addClass('err')
          } else if (rq && !($(this).find("input").val() == '' || $(this).find("input").val() == null)) {
            $(this).addClass('success').find("input").addClass('suc')
          }
        });
        if (this.form.certificateNumber > this.form.setNumber) {
          this.$message({
            type: 'error',
            message: '证书数量不能大于套数'
          });
          flag = false;
        }
        return flag
      }
    },
    components: {MoreList, RelativeList}

  }
</script>

<style lang="scss">
  .placeholder-body{
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
  }


  .advancedTable {
    width: 100px;
  }

  .form-item {
    margin: 0 !important;
  }

  table #rdata tr td.error input.err {
    border: 1px red solid !important;
  }

  table #rdata tr td.success input.suc {
    border: 1px #67c23a solid !important;
  }

  .flex .advancedTable {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .custom-1d74b7 .el-button--warning:hover{background:#fdc36d!important; border:1px solid #fdc36d!important;}
  .el-autocomplete-suggestion.el-popper.qb-popper-auto-item{
    width:600px !important;
  }
  .el-autocomplete-suggestion.el-popper.qb-popper-auto-item .auto-item{
    width: 560px;
    overflow: hidden;
    padding: 0 20px;
  }
  .el-autocomplete-suggestion.el-popper.qb-popper-auto-item .more{
    padding-left:20px;
  }
  .el-autocomplete-suggestion.el-popper.qb-popper-auto-item .more:hover{
    background: #61bbff;
  }
  .el-autocomplete-suggestion.el-popper.qb-popper-auto-item .auto-item:hover{
    background: #61bbff;
  }
  .el-popper.qb-popper-auto-item.el-autocomplete-suggestion li{
    padding:0;
  }
  .el-autocomplete-suggestion.el-popper.qb-popper-auto-item .auto-item span{
    float: left;
    width:16.66%;
    height:30px;
    line-height:30px;
    font-size:14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
