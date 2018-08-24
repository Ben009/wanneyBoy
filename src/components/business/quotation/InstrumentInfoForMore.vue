<!-- author：黄溧  注释原因：重复 如果没用可删除-->
<template>
  <div ref="nm-page" style="width:100%; overflow-x:auto;">
    <div class="batch-box" style="margin: 10px 0; min-width:1200px;">
      <template>
        <span>批量设置：</span>
        <el-tooltip class="item" effect="dark" content="根据所选内容批量设置下方器具对应的值">
          <i class="el-icon-info ft12"></i>
        </el-tooltip>
        <span>：</span>

        <el-select v-model="batchName" placeholder="请选择" clearable @change="handleBatchChange" size="mini">
          <el-option
            v-for="item in batchInfo"
            :key="item.nameCode"
            :label="item.title"
            :value="item.nameCode">
          </el-option>
        </el-select>
        <span>值：</span>
        <el-select v-if="batchObj[batchName]?batchObj[batchName].component=='select':0" v-model="batchData"
                   placeholder="请选择" size="mini">
          <el-option
            v-for="item in batchObj[batchName].options"
            :key="item.code"
            :label="item.remark"
            :value="item.code">
          </el-option>
        </el-select>
        <el-input v-if="batchObj[batchName]?batchObj[batchName].component=='input':0" v-model="batchData" clearable
                  size="mini" style="width:200px"></el-input>
        <el-button type="primary" @click="handleBatch" size="mini">批量设置</el-button>
      </template>
      <span style="font-size:14px;">
      合计：
      <span style="font: bold 16px 微软雅黑;color:black">{{count}}</span>条报检记录
      <span style="font: bold 16px 微软雅黑;color:black">{{setNumber}}</span>套
      需出<span style="font: bold 16px 微软雅黑;color:black">{{ certificateNumber}}</span>份证书
      分包<span style="font: bold 16px 微软雅黑;color:blue">{{ subcontractArea}}</span>套
    </span>
      <!--<span>根据所选内容批量设置下方器具对应的值 </span>-->
      <el-button type="primary" v-has="'M7160'" @click="addAppliance" size="mini" class="but-plsz">添加器具</el-button>
    </div>

    <div class="placeholder"
         style=" line-height: 40px; -webkit-box-sizing: border-box;min-height:83px;min-width:1200px;">
      <div ref="table-header" style=" background-color: #fff;">
        <table>
          <colgroup>
            <col v-for="(item,index) in jsonData[0]" :width="item.width">
          </colgroup>
          <thead>
          <tr v-for="head in jsonData">
            <td v-for="(item,index) in head" :colspan="item.colspan" :rowspan="item.rowspan" class="title-color">
              <div v-if="item.dom==='advancedChecbox'" style="text-align: left;padding-left:10px">
                <el-checkbox @change="handleSelectAll" v-model="isSelectAll">{{item.cname}}<span v-if="item.required"
                                                                                                 class="required">(*)</span>
                </el-checkbox>
              </div>
              <div v-else>
                <el-tooltip v-if="item.isMsg" class="item" effect="dark" :content="item.msg">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
                {{item.cname}}<span v-if="item.required" class="required">(*)</span>
              </div>
            </td>
          </tr>
          </thead>
        </table>
      </div>
    </div>
    <div style="min-width:1200px;">
      <instrument-info-item
        v-for="(item,index) in data" :ref="'form'+index"
        :dataindex="index"
        :data="item"
        :headList="jsonData"
        :add="add.bind(this,index)"
        :copy="copy.bind(this,index)"
        :del="dataDelete.bind(this,index)"
        :columnsInfo="columnsInfo"
        :key='item.key'
        :wtdInfo="wtdInfo"
        :postCorre="postCorre"
        :isAdvancedChecked="item.registrationNo?selectObj[item.registrationNo]:0"
        :companyId="companyId"
        @select-value="selectValue"
        @selection-change="selectionChange"
        :originalDecimals="originalDecimals"
        @post-add="postAdd"
      ></instrument-info-item>
    </div>
    <addApplianceCommon :callbackAdd="setApplianceInfo" v-if="showAdd"></addApplianceCommon>
  </div>
</template>
<script>
  import Vue from 'vue'
  import InstrumentInfoItem from './InstrumentInfoItemForMore'
  import $ from 'jquery'
  import {ajaxRequest, ajaxProxyRequest} from '@/components/util/base'
  import addApplianceCommon from './addApplianceCommon'

  export default {
    name: 'instrument-info',
    props: {
      columnsInfo: {type: Object, required: true},
      batchInfo: {type: Array, required: true},
      header: {type: Array, required: true},
      defaultList: {type: Array, required: true},
      tableData: {type: Array},
      originalDecimals: {type: Number, required: true},
      companyId: {type: Number},
      wtdInfo: {type: Object},
    },
    data() {
      return {
        /*
            author：黄溧  注释原因：重复
           */
        data: [{name: '1', type: ''}],
        selectedData: [],
        isSelectAll: true,
        selectObj: {},

        jsonData: [],
        headList: [],

        batchName: '',
        batchData: '',
        list: [],

        options: [], // 存放批量处理对应值的下拉,
        renderKey: 0,
        showAdd: false,
        postCorre: {}, // 岗位对应下拉 { [部门id] :options }
      }
    },
    computed: {
      batchObj: function () {
        let obj = {}
        this.batchInfo.forEach(v => {
          if (v.component == 'select') {
            v.options = this.options[v.nameCode]
          }
          obj[v.nameCode] = v
        })
        return obj
      },
      count: function () {
        return this.data.length
      },
      setNumber: function () {
        let num = 0
        this.data.forEach((v) => {
          v.setNumber ? num += parseInt(v.setNumber) : null
        })
        return num
      },
      certificateNumber: function () {
        let num = 0
        this.data.forEach((v) => {
          v.certificateNumber ? num += parseInt(v.certificateNumber) : null
        })
        return num
      },
      subcontractArea: function () {
        let num = 0;
        this.data.forEach((v) => {
          v.subcontractArea > 0 ? (v.setNumber ? num += parseInt(v.setNumber) : 0) : 0;
        })
        return num
      }
    },
    watch: {
      selectedData(v, o) {
        let obj = {}
        v.forEach(item => {
          obj[item.id] = true
        })
        this.selectObj = obj
      }
    },
    methods: {
      postAdd(obj) {
        this.postCorre = obj;
      },
      handleSelectAll(val) {
        if (val) {
          this.selectedData = [].concat(this.data)
        } else {
          this.selectedData = []
        }
      },
      selectionChange(row, action) {
        if (action == 'add') {
          this.selectedData.push(row)
        } else {
          let temp = this.selectedData.filter((v) => {
            return v.id != row.id
          })
          this.selectedData = temp
        }
        if (this.selectedData.length == this.data.length) {
          this.isSelectAll = true
        } else {
          this.isSelectAll = false
        }
      },

      handleBatchChange() {
        this.batchData = ''
      },
      /* 批量设置 */
      handleBatch() {
        this.data.forEach(v => {
          for (let i in v) {
            if (i == this.batchName) {
              Vue.set(v, i, this.batchData)
              this.renderKey++
            }
          }
        })
      },
      selectValue(row, index) {
        Vue.set(this.data, index, row)
      },
      refreshOptions(departId) {
        let options = []
        ajaxRequest('get', 'back/post/listByDeptId/' + departId, null, (res) => {
          options = res.rows
        })
        this.jsonData[0].forEach((v) => {
          if (v.name == 'postId') {
            Vue.set(v, 'options', options)
          }
        })
      },
      handleSubmit() {
        let _this = this
        Promise.all(this.data.map((v, i) => {
          return function (resolve, reject) {
            _this.$refs['form' + i].validate(valid => {
              if (valid) {
                resolve()
              } else {
                reject('请检测填写数据')
              }
            })
          }
        }))
          .then(() => {
            // 提交数据

          })
          .catch(err => {
            // 处理错误
          })
      },
      add(index) {
        let newItem = $.extend({}, this.defaultList[0]);
        newItem.key = this.getRandomKey();
        this.data.splice((index + 1), 0, newItem);
      },

      copy(index) {
        let newItem = $.extend({}, this.data[index]);
        delete newItem.bjid;
        delete newItem.qjidNew;
        newItem.key = this.getRandomKey();
        this.data.splice((index + 1), 0, newItem)
        this.$emit('sumTotalCharge')
      },
      //删除行
      dataDelete(index) {
        if (this.data.length > 1) {
          this.data.splice(index, 1)
        } else {
          this.$message.error('第一行不能删除')
        }
      },
      fixedTableColumns() {
        let header = $(this.$refs['table-header']),
          headerBox = header.parent(),
          headerPositionY = header.position().top,
          width = header.width(),
          height = header.height();
        headerBox.css({height: height})
        let page = this.$refs['nm-page'],
          $box = $(page).parents('.el-dialog__body'),
          boxPositionY = $box.offset().top;
        console.log(width,'333333333')
        $box.on('scroll', function () {
          console.log(width,'1111111111')
          let scrollTop = $(this).scrollTop()
          if (scrollTop > headerPositionY) {
            header.css({position: 'fixed', 'top': boxPositionY, 'width': width, zIndex: 99})
          }
          else {
            header.css({position: 'static', 'width': width})
          }
        })

      },
      /*
          author：黄溧  注释原因：重复 如果没用可删除
         */
      getTableHeader() {
        // 获取表单头部信息
        this.jsonData = $.extend(true, [], this.header);
      },
      getTableList() {
        // 获取表单数据信息
        // 获取表单数据信息
        if (this.tableData && this.tableData.length > 0) {
          this.data = [].concat(this.tableData);
          this.data.forEach(v=>{
            v.key=this.getRandomKey();
          })
        } else {
          let obj = {};
          for (let i in this.defaultList[0]) {
            obj[i] = this.defaultList[0][i];
          }
          obj.key=this.getRandomKey();
          Vue.set(this.data, 0, obj);
        }
        this.selectedData = [].concat(this.data);
      },

      getRandomKey() {
        var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var result = "";
        for (var i = 0; i < 20; i++) {
          var r = Math.floor(Math.random() * 62);		//取得0-62间的随机数，目的是以此当下标取数组data里的值！
          result += data[r];		//输出20次随机数的同时，让rrr加20次，就是20位的随机字符串了。
        }
        return result
      },

      getDataSourse() {
        return new Promise(resolve => {
          let tempJsonArray = [...this.jsonData[0], ...this.jsonData[1]],
            codeList = [], options = [];
          tempJsonArray.forEach(temp => {
            if (temp.code) {
              codeList.push(temp.code)
            }
          });
          ajaxProxyRequest('get', '/njmind/findParams/' + codeList.join('$'), null,
            (res) => {
              tempJsonArray.forEach((val, key) => {
                if (res && typeof res == 'object') {
                  for (let key in res) {
                    if (val.code && res[val.code]) {
                      Vue.set(val, 'options', res[val.code].list)
                    }
                  }
                  resolve()
                }
              });

              this.batchInfo.forEach(v => {
                if (res && typeof res == 'object') {
                  for (let i in res) {
                    if (v.component == 'select' && res[v.code]) {
                      options[v.nameCode] = res[v.code].list;
                    }
                  }
                }
              });
              this.options = options;
            });
          ajaxRequest('get', 'back/depart/list/', {isDelete: 0}, (res) => {
            tempJsonArray.forEach((val, key) => {
              if (val.name == 'departId') {
                Vue.set(val, 'options', res.rows)
              }
            })
          })
        })
      },
      async getTableData() {
        await this.getTableHeader()
        await this.getTableList()
        await this.getDataSourse()
        await this.handleTableData()
      },
      handleTableData() {

      },
      //添加器具
      addAppliance() {
        this.showAdd = true;
      },
      //回写添加的器具数据
      setApplianceInfo(datas) {
        this.showAdd = false;
        //如果有数据，则赋值到器具组件中
        if (datas) {
          let obj = new Object();
          obj.applianceName = datas.applianceName;
          obj.applianceActualName = datas.applianceName;
          obj.certificateType = datas.certificateType;
          obj.setNumber = 1;
          obj.pieceNumber = 1;
          obj.certificateNumber = 1;
          obj.unitPrice = datas.detectionFee;
          obj.applianceUnit = datas.chargeUnit;
          obj.afterDiscountPrice = datas.detectionFee;
          obj.afterDiscountTotal = datas.detectionFee;
          obj.departId = datas.departId;
          obj.postId = datas.postId;
          obj.model = datas.model;
          obj.measureRange = datas.measureRange;
          obj.equipmentNo = datas.equipmentNo;
          obj.factoryNo = datas.factoryNo;
          obj.manufacturer = datas.manufacturer;
          obj.detectionParameter = datas.detectionParameter;
          obj.detectionMethod = datas.detectionMethod;
          obj.id = datas.id;
          obj.subcontractArea = '0';
          if(!this.data[this.data.length-1].id && !this.data[this.data.length-1].applianceActualName){
            this.data.splice(this.data.length-1,1,obj)
            this.isRefresh = false;
            this.$nextTick(() => {
              this.isRefresh = true;
            });
          }else{
            this.data.push(obj)
          }
          //重新计算价格
          this.$emit('sumTotalCharge')
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.fixedTableColumns();
      });
      this.getTableData();
      this.batchInfo.forEach((v, i) => {
        if (i == 0) {
          this.batchName = v.nameCode
        }
      })
    },
    components: {InstrumentInfoItem, addApplianceCommon}
  }
</script>

<style scoped>
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  .required {
    color: #f00;
  }

  .batch-box span {
    font-size: 14px;
  }

  .but-plsz {
    border: 1px solid #3094e0 !important;
    background: none !important;
    color: #3094e0 !important;
  }

  .but-plsz:hover {
    background: #3094e0 !important;
    color: #fff !important;
  }

  .title-color {
    background-color: #ededed;
  }
</style>
