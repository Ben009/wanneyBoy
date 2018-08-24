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

            <mind-select v-else
                         v-model="form[item.name]"
                         :options="item.options"
                         :extraConfig="{'size':'small','disabled':item.disabled}"></mind-select>
          </div>

          <div v-if="item.dom === 'inputNumber'">
            <el-input-number v-if="item.name=='setNumber'" v-model="form[item.name]" :type="item.type" size="small"
                             :min="1" :max="999" :controls="false"
                             style="width:50%" @change="handleSetNumberChange"
                             :disabled="item.disabled"></el-input-number>

            <el-input-number v-else-if="item.name=='pieceNumber'" v-model="form[item.name]" :type="item.type"
                             size="small" :min="1" :controls="false"
                             style="width:50%" @change="handlePieceNumberChange"
                             :disabled="item.disabled"></el-input-number>

            <el-input-number  v-else-if="item.name=='afterDiscountPrice'" v-model.number="form[item.name]" :type="item.type"
                             :disabled="form.isDiscount!=1 || !priceEdit"
                             @change="handleSetAfterPrice"  :controls="false"
                             size="small"
                             style="width:100%"> </el-input-number>

            <el-input-number v-else v-model="form[item.name]" :type="item.type"
                             size="small"
                             :controls="false"
                             style="width:50%"
                             :disabled="item.disabled"></el-input-number>
          </div>

          <div v-if="item.dom === 'input'">
            <el-input v-if="!form[item.name]"  @input="valueChange(item.name)" v-model="form[item.name]" :type="item.type" size="small"
                      :clearable="item.type !== 'number' && !item.disabled"
                      :min="item.type=='number'?0:null" :disabled="item.disabled" style="width:100%"></el-input>
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
              <el-checkbox :change="handleAdvancedChexbox" :extraConfig="{'disabled':item.disabled}" v-model="advancedChecked">
              </el-checkbox>{{form[item.name]}}
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
            <el-autocomplete
              popper-class="qb-popper-auto-item"
              v-model="form[item.name]"
              :fetch-suggestions="querySearch.bind(this,item)"
            >
              <template slot-scope="{ item }" >
                <div v-if="item.type!=='more'" class="auto-item">
                  <span v-for="info in columnsInfo.moreInfo" @click="setValue(item)" :ref='"selectItem"+item.index' >{{info.head}}{{item[info.nameCode]}}</span>
                </div>
                <div v-if="item.type==='more'" @click="show">更多</div>

              </template>
            </el-autocomplete>
          </div>
          <!-- 高级检索end -->
          <template v-if="item.dom === 'none'" :rowspan="item.rowspan" style="border-bottom:1px red  dashed;">
            <el-button type="text" @click="add"  style="padding:2px;font-size:18px;margin-left:0;">
              <i class="el-icon-circle-plus" title="增加"></i>
            </el-button>
            <el-button type="text" @click="copy" style="padding:2px;font-size:18px;margin-left:0;">
              <i class="el-icon-njm-copy" title="复制"></i>
            </el-button>
            <el-button type="text" @click="del" style="padding:2px;font-size:18px;margin-left:0;">
              <i class="el-icon-delete" style="color:red" title="删除"></i>
            </el-button>
          </template>

          <template v-if="item.dom === 'certificateNumber'" :rowspan="item.rowspan">
            <span>{{form[item.name]}}</span>
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
  import RelativeList from '../plan/RelativeList.vue'
  import MoreList from '../plan/MoreList.vue'
  var Big = require('big.js')

  export default {
    name: 'instrument-info-item',
    props: {
      dataindex: {required: true, type: Number},
      data: {required: true, type: Object},
      columnsInfo: {required: true, type: Object},
      headList: {required: true, type: Array},
      isAdvancedChecked: {required: true},
      add: {required: true, type: Function},
      copy: {required: true, type: Function},
      del: {required: true, type: Function},
      originalDecimals: {required: true, type: Number},
      companyId: {type: Number},
      wtdInfo:{type:Object}
    },
    data () {
      return {
        rules: {
          applianceName: [{required: true, message: '器具名称不能为空'}]
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

      //价格修改权限
      priceEdit:function(){
        let btnPower = localStorage.getItem('btnPower');
        if(btnPower.indexOf('M7135')!=-1){
          return true;
        }else {
          return false;
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
      handlePostChange(value){
        this.handleIsUrgentChange(this.form.urgentDayPercent);
      },
      advancedChecked: {
        get: function () {
          return this.isAdvancedChecked
        },
        set: function () {
        }
      }
    },
    mounted () {
      this.applianceUseChange = this.form.com_applianceUseChange ? this.form.com_applianceUseChange : '';
    },
    methods: {
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

      /** *******************************联动相关change事件*******************************/
      changeCertificateNumber(index) {
        if (this.form.certificateNumber !== 0) {
          Vue.set(this.form, 'certificateNumber', 0);
        } else {
          Vue.set(this.form, 'certificateNumber', this.form.setNumber);
        }
      },
      /* 套数与证书数量相同 */
      handleSetNumberChange (value) {
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
        this.$nextTick(() => {
          let afterDiscountPrice = this.setDecimalsPoint(this.form.afterDiscountPrice, this.originalDecimals)// 折后单价
          let setNumber = this.form.setNumber// 套数
          let pieceNumber = this.form.pieceNumber// 件数
          let total = new Big(afterDiscountPrice).mul(setNumber).mul(pieceNumber)// 合计
          Vue.set(this.form, 'afterDiscountTotal', total + '')
        })

      },
      handlePieceNumberChange(name, type, value){
        if (value < 0) {
          this.$message.error('数量不能小于0');
          Vue.set(this.form, 'pieceNumber', 0);
          return
        }
        this.$nextTick(() => {
          let afterDiscountPrice = this.setDecimalsPoint(this.form.afterDiscountPrice, this.originalDecimals)// 折后单价
          let setNumber = this.form.setNumber// 套数
          let pieceNumber = this.form.pieceNumber// 件数
          let total = new Big(afterDiscountPrice).mul(setNumber).mul(pieceNumber)// 合计
          Vue.set(this.form, 'afterDiscountTotal', total + '')
        })

      },
      // 修改折后单价
      handleSetAfterPrice (val) {
        // 根据小数位截取折后单价
        val = this.setDecimalsPoint(val, this.originalDecimals)
        Vue.set(this.form, 'afterDiscountPrice', val + '')
        // 计算校测费
        let setNumber = this.form.setNumber// 套数
        let pieceNumber = this.form.pieceNumber// 件数
        let total = new Big(val).mul(setNumber).mul(pieceNumber)// 合计
        Vue.set(this.form, 'afterDiscountTotal', total + '')
      },
      /* 检验证书数量是否大于套数 */
      handleCertificateNumberChange (value) {
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
      /* 分包区域change将证书数量置0 */
      handleAreaChange () {
        if (value !== '0') {
          Vue.set(this.form, 'certificateNumber', 0);
        } else {
          Vue.set(this.form, 'certificateNumber', this.form.setNumber);
        }
      },
      /* 是否强检控制是否可选器具用途 */
      handleCompulsoryVerifyChange (value) {
        this.applianceDisabled = !value;
        this.applianceRequired = value;
        Vue.set(this.form, 'applianceUse', '');
      },
      /** ********************************advancedChecbox change事件**********************************************/
      handleAdvancedChexbox (value) {
        /* 触发父组件事件 改变选中的数据 */
        if (value) {
          this.$emit('selection-change', this.form, 'add')
        } else {
          this.$emit('selection-change', this.form, 'delete')
        }
      },

      /* 相关列表选择数据 */
      setValue (row) {
        if (row) {
          row.unitPrice = !row.detectionFee ? parseFloat(0) : row.detectionFee
          row.afterDiscountPrice = this.setDecimalsPoint(row.unitPrice, this.originalDecimals)// 折后单价
          row.afterDiscountTotal = row.afterDiscountPrice
          /* 重新拉取岗位 */
          if (!this.options[row.departId]) {
            this.refreshPostOptions(row.departId)
          }
          this.isRelative = 0
          /* 手输字段不赋值 */
          let temp = [].concat(this.headList[0], this.headList[1])
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

          //计量器具库没有维护，默认为现场
          if(!row.detectionMethod){
            Vue.set(this.form, 'detectionMethod', '0')
          }
          Vue.set(this.form, 'applianceId', row.id)
          Vue.set(this.form, 'isDiscount', row.isDiscount)
          this.$emit('select-value', this.form, this.dataindex)
        }
      },
      show () {
        this.isShow = 1
        this.isRelative = 0
      },
      /*是否加急change重新计算检测期限*/
      handleIsUrgentChange(value){
        if(value){
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
        }
      },
      refreshPostOptions (departId) {
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
        if(params){
          let queryString = params ? { [item.name]: params } : {}, _this = this;
          let param = $.extend({},queryString, {[item.name]: this.form[item.name],companyId:this.companyId}, item.parameter)
          ajaxRequest('get', item.ajaxChangeUrl, param, (res) => {
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


      handleResult (res, name) {
        for(let key in res){
          Vue.set(res[key],'value',res[key][name])
          Vue.set(res[key],'index',key)
        }
        res.push({
          type:'more'
        })
        this.relativeData=res;
      },

      handleCallBack (row) {
        this.isShow = false
        this.setValue(row);
        // if (row) {
        //   if (!this.options[row.departId]) {
        //     this.refreshPostOptions(row.departId)
        //   }
        //   this.isRelative = 0
        //   let temp = [].concat(this.headList[0], this.headList[1])
        //   temp.forEach(v => {
        //     if (!v.isHandWriting) {
        //       Vue.set(this.form, v.name, row[v.name])
        //     }
        //   })
        //   Vue.set(this.form, 'id', row.id)
        //   this.$emit('select-value', this.form, this.dataindex)
        // }
      },
      test () {
        let flag = true
        $('#rdata tr td').each(function (i, tds) {
          let rq = $(this).attr('required')
          // console.log("ddd"+i,rq,$(this).find("input").val());
          if (rq && $(this).find('input').val() == '') {
            flag = false
            $(this).addClass('error').find('input').addClass('err')
          }
        })
        if (this.form.certificateNumber > this.form.setNumber) {
          this.$message({
            type: 'error',
            message: '证书数量不能大于套数'
          })
          return false;
        }

        if (this.form.applianceName && this.form.applianceName.length>100) {
          this.$message({
            type: 'error',
            message: '器具名称不能超过100个字符'
          })
          return false;
        }

        if (this.form.applianceActualName && this.form.applianceActualName.length>100) {
          this.$message({
            type: 'error',
            message: '器具实际名称不能超过100个字符'
          })
          return false;
        }

        if (this.form.setNumber && this.form.setNumber.length>6) {
          this.$message({
            type: 'error',
            message: '套数不能超过6个字符'
          })
          return false;
        }

        if (this.form.pieceNumber && this.form.pieceNumber.length>6) {
          this.$message({
            type: 'error',
            message: '件数不能超过6个字符'
          })
          return false;
        }

        if (this.form.certificateNumber && this.form.certificateNumber.length>6) {
          this.$message({
            type: 'error',
            message: '证书数量不能超过6个字符'
          })
          return false;
        }

        if (this.form.applianceUnit && this.form.applianceUnit.length>20) {
          this.$message({
            type: 'error',
            message: '器具单位不能超过20个字符'
          })
          return false;
        }

        if (this.form.model && this.form.model.length>200) {
          this.$message({
            type: 'error',
            message: '型号规格不能超过200个字符'
          })
          return false;
        }

        if (this.form.measureRange && this.form.measureRange.length>200) {
          this.$message({
            type: 'error',
            message: '测量范围不能超过200个字符'
          })
          return false;
        }

        if (this.form.equipmentNo && this.form.equipmentNo.length>200) {
          this.$message({
            type: 'error',
            message: '设备编号不能超过200个字符'
          })
          return false;
        }

        if (this.form.factoryNo && this.form.factoryNo.length>200) {
          this.$message({
            type: 'error',
            message: '出厂编号不能超过200个字符'
          })
          return false;
        }

        if (this.form.manufacturer && this.form.manufacturer.length>200) {
          this.$message({
            type: 'error',
            message: '制造厂商不能超过200个字符'
          })
          return false;
        }

        return flag
      },
      // 截取小数
      setDecimalsPoint (num, point) {
        var num = parseFloat(num)
        if (isNaN(num)) {
          return 0
        }
        if (point == 1) {
          num = Math.floor(num * 10) / 10
        } else if (point == 2) {
          num = Math.floor(num * 100) / 100
        } else if (point == 0) {
          num = Math.floor(num)// 保留整数
          return num
        }
        var s = num.toString()
        var rs = s.indexOf('.')
        if (rs < 0) {
          rs = s.length
          s += '.'
        }
        while (s.length <= rs + point) {
          s += '0'
        }
        return s
      }
    },
    components: {MoreList, RelativeList}

  }
</script>

<style>
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
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
    width:600px;
    overflow: hidden;
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
