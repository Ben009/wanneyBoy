<!-- author：黄溧  注释原因：重复 如果没用可删除-->
<template>
  <div ref="nm-page" style="width:100%; overflow-x:auto;">
    <!-- 业务受理提交后submitHidden，不显示批量设置、添加器具信息，只保留合计，此时将合计居中显示 -->
    <div class="batch-box" style="margin: 10px 0; min-width:1200px;" :class="[(!!wtdInfo.submitHidden ? wtdInfo.submitHidden == 0 : true) ? '' : alignCenter]" >
      <template v-if="(!!wtdInfo.submitHidden ? wtdInfo.submitHidden == 0 : true)">
      <span>批量设置</span>
      <el-tooltip class="item" effect="dark" content="根据所选内容批量设置下方器具对应的值">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
      <span>：</span>
      <el-select v-model="batchName" placeholder="请选择"  @change="handleBatchChange" size="mini">
        <el-option
          v-for="item in batchInfo"
          :key="item.nameCode"
          :label="item.title"
          :value="item.nameCode">
        </el-option>
      </el-select>
      <span>值：</span>
      <el-select v-if="batchObj[batchName]?batchObj[batchName].component=='select':0" v-model="batchData"
                 placeholder="请选择"  size="mini">
        <el-option
          v-for="item in batchObj[batchName].options"
          :key="item.code"
          :label="item.remark"
          :value="item.code">
        </el-option>
      </el-select>
      <el-input v-if="batchObj[batchName]?batchObj[batchName].component=='input':0" v-model="batchData" clearable
                size="mini" style="width:200px"></el-input>
      <el-button type="primary" @click="handleBatch" size="mini" class="but-plsz">批量设置</el-button>
      <!-- <span>根据所选内容批量设置下方器具对应的值 </span> -->
      </template>
      <span style="font-size:14px;">
      合计：
      <span style="font: bold 16px 微软雅黑;color:black">{{count}}</span>条报检记录
      <span style="font: bold 16px 微软雅黑;color:black">{{setNumber}}</span>套
      需出<span style="font: bold 16px 微软雅黑;color:black">{{ certificateNumber}}</span>份证书
      加急<span style="font: bold 16px 微软雅黑;color:red">{{emergencyGrade}}</span>套
      分包<span style="font: bold 16px 微软雅黑;color:blue">{{ subcontractArea}}</span>套
    </span>
      <el-button type="primary"
                 v-show="addAppliancePower"
                 @click="addAppliance" v-if="wtdInfo.source != 1 && (!!wtdInfo.submitHidden ? wtdInfo.submitHidden == 0 : true)" size="mini" class="but-plsz">添加器具</el-button>
    </div>
    <div class="placeholder" style=" line-height: 40px; -webkit-box-sizing: border-box;min-height:83px;min-width:1200px;height:auto">
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
         <div v-if="isRefresh">
       <instrument-info-item
        v-for="(item,index) in data" :ref="'form'+index"
        :dataindex="index"
        :data="item"
        :headList="jsonData"
        :add="add.bind(this,index)"
        :copy="copy.bind(this,index)"
        :del="dataDelete.bind(this,index)"
        :columnsInfo="columnsInfo"
        :key='item.key+renderKey'
        :isAdvancedChecked="item.registrationNo?selectObj[item.registrationNo]:0"
        :postCorre="postCorre"
        :wtdInfo="wtdInfo"
        :instrumentAddCopyShow="!!instrumentAddCopyShow?instrumentAddCopyShow:'0'"
        :instrumentDelShow="!!instrumentDelShow?instrumentDelShow:'0'"
        @select-value="selectValue"
        @post-add="postAdd"
        @selection-change="selectionChange"
        @focusCompanyName="focusCompanyName"
      ></instrument-info-item>
         </div>
    <addApplianceCommon :callbackAdd="setApplianceInfo" v-if="showAdd"></addApplianceCommon>
    </div>


  </div>
</template>
<script>
  import Vue from 'vue'
  import InstrumentInfoItem from './InstrumentInfoItem'
  import addApplianceCommon from '../quotation/addApplianceCommon'
  import $ from 'jquery'
  import {ajaxRequest, ajaxProxyRequest} from '@/components/util/base';

  export default {
    name: 'instrument-info',

    props: {
      columnsInfo: {type: Object, required: true},
      batchInfo: {type: Array, required: true},
      header: {type: Array, required: true},
      defaultList: {type: Array, required: true},
      tableData: {type: Array},
      wtdInfo:{type:Object},
      instrumentAddCopyShow:{type:String},
      instrumentDelShow:{type:String},
      moduleFlag:{type:Number},
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
        renderKey:0,
        options: [],//存放批量处理对应值的下拉,
        postCorre:{}, // 岗位对应下拉 { [部门id] :options }
        showAdd: false,
        isRefresh: true,
        alignCenter: 'alignCenter',//居中样式
        addAppliancePower:false,
      }
    },
    computed: {
      batchObj: function () {
        let obj = {};
        this.batchInfo.forEach(v => {
          if (v.component == 'select') {
            v.options = this.options[v.nameCode];
          }
          obj[v.nameCode] = v;
        })
        return obj
      },
      count: function () {
        return this.data.length
      },
      setNumber: function () {
        let num = 0;
        this.data.forEach((v) => {
          v.setNumber ? num += parseInt(v.setNumber) : null;
        })
        return num
      },
      certificateNumber: function () {
        let num = 0;
        this.data.forEach((v) => {
          v.certificateNumber ? num += parseInt(v.certificateNumber) : null;
        })
        return num
      },
      emergencyGrade: function () {
        let num = 0;
        this.data.forEach((v) => {
          let isUrgent = 0;
          try{
            isUrgent = v.urgentDayPercent.split("@@")[0];
          }catch(e){
            isUrgent = v.isUrgent;
          }
          isUrgent > 0 ? (v.setNumber ? num += parseInt(v.setNumber) : 0) : 0;
        })
        return num
      },
      subcontractArea: function () {
        let num = 0;
        this.data.forEach((v) => {
          v.subcontractArea > 0 ? (v.setNumber ? num += parseInt(v.setNumber) : 0) : 0;
        })
        return num
      },
    },
    watch: {
      header(v,o) {
        this.getTableData();
        this.$nextTick(() => {
          this.fixedTableColumns();
        });
      },
      selectedData(v, o) {
        let obj = {};
        v.forEach(item => {
          item.registrationNo ? obj[item.registrationNo] = true : null;
        });
        this.selectObj = obj;
        this.renderKey++
        console.log(this.selectObj)
      },
      tableData(v){
        this.data = [].concat(v);
        this.data.forEach(v=>{
          v.key=this.getRandomKey();
        })
      },

    },
    methods: {
      focusCompanyName(){
      this.$emit("focusCompanyName");
      },
      handleSelectAll(val) {
        if (val) {
          this.selectedData = [].concat(this.data);
        } else {
          this.selectedData = [];
        }
      },
      selectionChange(row, action) {

        if (action == 'add') {
          this.selectedData.push(row);
        } else {

          let temp = this.selectedData.filter((v) => {
            return v.registrationNo!= row.registrationNo
          });
          this.selectedData = temp;
        }
        if (this.selectedData.length == this.data.length) {
          this.isSelectAll = true;
        } else {
          this.isSelectAll = false;
        }
        console.log(this.selectedData)
      },

      handleBatchChange() {
        this.batchData = '';
      },
      /*批量设置*/
      handleBatch() {
        this.data.forEach(v => {
          for (let i in v) {
            if (i == this.batchName && i == 'applianceUse') {
              if (v.isCompulsoryVerify) {
                Vue.set(v, i, this.batchData);
              }
            }
            if (i == this.batchName && i !== 'applianceUse') {
              Vue.set(v, i, this.batchData);
            }
          }
        })
      },
      selectValue(row, index) {
        Vue.set(this.data, index, row);

      },
      postAdd(obj){
        this.postCorre=obj;
      },
      handleSubmit() {
        console.log(this.$refs)
        let _this = this
        Promise.all(this.data.map((v, i) => {
          return function (resolve, reject) {
            _this.$refs['form' + i].validate(valid => {
              if (valid) {

                resolve()
              }
              else {
                reject('请检测填写数据')
              }
            })
          }
        }))
          .then(() => {
            //提交数据
            console.log('ddd')
          })
          .catch(err => {
            //处理错误
          })
        /*this.$refs.form.validate((valid) => {
          console.log(valid);
          if (valid) {
          } else {
            return false;
          }
        })*/
      },
      add(index) {
        let newItem = $.extend({}, this.defaultList[0]);
        newItem.key=this.getRandomKey();
        this.data.splice((index + 1), 0, newItem);

      },
      copy(index) {
        let newItem = $.extend({}, this.data[index]);
        newItem.key=this.getRandomKey();
        this.data.splice((index + 1), 0, newItem);

      },
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
        headerBox.css({height: height});
        let page = this.$refs['nm-page'],
          $box = $(page).parents('.tbs_info'),
          boxPositionY = $box.offset().top;
        $box.on('scroll', function () {
          let scrollTop = $(this).scrollTop();
          if (scrollTop > headerPositionY) {
            header.css({position: 'fixed', 'top': boxPositionY, 'width': width, zIndex: 99})
          }
          else {
            header.css({position: 'static'})
          }
        })
      },
      /*
        author：黄溧  注释原因：重复 如果没用可删除
       */
      getTableHeader() {
        // 获取表单头部信息
        this.jsonData =  $.extend(true,[], this.header);
      },
      getTableList() {
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
      getRandomKey(){
        var data=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

        var result="";
        for(var i=0;i<20;i++){
          var r=Math.floor(Math.random()*62);		//取得0-62间的随机数，目的是以此当下标取数组data里的值！
          result+=data[r];		//输出20次随机数的同时，让rrr加20次，就是20位的随机字符串了。
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
        if(this.tableData) {
          this.tableData.forEach((v, i) => {
            v.isCompulsoryVerify = (v.isCompulsoryVerify === '1' || v.isCompulsoryVerify) ? true : false;
            v.isDoubleNumber = (v.isDoubleNumber === '1' || v.isDoubleNumber) ? true : false;
            v.urgentDayPercent = v.isUrgent + "@@" + v.urgentProportions;
            if(!v.powerTypes){
              v.powerTypes = '0';
            }else{
            v.powerTypes = v.powerTypes+"";
            }
            if(!v.isRepair){
              v.isRepair = '0';
            }else{
            v.isRepair = v.isRepair+"";
			}
          });
        }
      },
      addAppliance(){
        this.showAdd = true;
      },
      //回写添加的器具数据
    setApplianceInfo(datas){
      this.showAdd = false;
      //如果有数据，则赋值到器具组件中
      if(datas){
        let obj = new Object();
        obj.applianceName = datas.applianceName;
        obj.applianceActualName = datas.applianceName;
        obj.certificateType = datas.certificateType;
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
        obj.urgentDayPercent = "0@@0";
        obj.isUrgent = "0";
        obj.urgentProportions = "0";
        obj.subcontractArea = "0";
        obj.isRepair = "0";
        obj.powerTypes = "0";
        obj.setNumber = 1;
        obj.pieceNumber = 1;
        obj.certificateNumber = 1;
        if(!this.data[this.data.length-1].id && !this.data[this.data.length-1].applianceActualName){
          this.data.splice(this.data.length-1,1,obj)
          this.isRefresh = false;
          this.$nextTick(() => {
            this.isRefresh = true;
          });
        }else{
          this.data.push(obj)
        }
      }
    }
    },
    created(){
      let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
      if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
        btnPower = "@@";
      }
      console.log( this.addAppliancePower)
      if((btnPower.indexOf("@M13906@") != -1&&this.moduleFlag==1)||(btnPower.indexOf("@M16707@") != -1&&this.moduleFlag==2)){
        this.addAppliancePower = true ;
      }
      console.log( this.addAppliancePower)
    },
    mounted() {
      /*
        author：黄溧  注释原因：重复 如果没用可删除
      */
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
    components: {InstrumentInfoItem,addApplianceCommon},
    /*render () {
      return (
        <div ref="nm-page">
          <div class="placeholder" style=" line-height: 40px; -webkit-box-sizing: border-box;">
            <div ref="table-header" style=" background-color: #fff;" >
              <table>
                <colgroup>
                  <col width="30"/>
                  <col width="120"/>
                  <col width="80"/>
                  <col width="80"/>
                  <col width="80"/>
                  <col width="80"/>
                  <col width="80"/>
                  <col width="80"/>
                  <col width="80"/>
                  <col width="80"/>
                  <col width="80"/>
                  <col width="30"/>
                </colgroup>
                <thead >
                <tr >
                  <td>序号</td>
                  {
                    this.columnsInfo.info_fir.map((v,i)=>{
                      return <td colspan={v.colspan?v.colspan:'1'}>{v.title}<span class={v.isRequired?'required':''}>(*)</span></td>
                    })
                  }
                  <td>器具实际名称</td>
                  <td>套数<span class="required">(*)</span></td>
                  <td>件/套数<span class="required">(*)</span></td>
                  <td>证书数量<span class="required">(*)</span></td>
                  <td>检测部门<span class="required">(*)</span></td>
                  <td>岗位<span class="required">(*)</span></td>
                  <td>检测方式</td>
                  <td>是否强检</td>
                  <td rowspan="2">操作</td>
                </tr>
                <tr>
                  {
                    this.columnsInfo.info_sec.map((v,i)=>{
                      return <td colspan={v.colspan?v.colspan:'1'}>{v.title}<span class={v.isRequired?'required':''}>(*)</span></td>
                    })
                  }

                  <td>规格型号</td>
                  <td>测量范围</td>
                  <td>设备编号</td>
                  <td>出厂编号</td>
                  <td>制造厂商</td>
                  <td>检测参数</td>
                  <td>分包区域</td>
                  <td>是否加急</td>
                  <td>器具用途</td>
                </tr>
                </thead>
              </table>
            </div>
          </div>
          <div>
            {
              this.data.map((item, index) => {
                return <InstrumentInfoItem
                  ref={'form' + index}
                  index={index}
                  data={item}
                  columnsInfo={this.columnsInfo}
                  add={this.add.bind(this, index)}
                  copy={this.copy.bind(this, index)}
                  del={this.delete.bind(this, index)}
                />
              })
            }
          </div>

          <div>
              合计：
              {this.count}条报检记录
              {this.num}套
              {this.num}件
              需出{this.num}份证书
              加急{this.num}套
              分包{this.num}套
          </div>
        </div>












      )
    }*/
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
  .batch-box span{font-size: 14px;}
  .but-plsz{border:1px solid #3094e0!important; background:none!important;color:#3094e0!important;}
  .but-plsz:hover{background:#3094e0!important;color:#fff!important;}
  .title-color{
  background-color: #ededed;
}
.alignCenter{
  text-align: center!important
}

</style>
