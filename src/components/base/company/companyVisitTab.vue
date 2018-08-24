<template>
  <div style="position:relative;">

    <div class="parameter-item">
    </div>
    <el-row v-if="!isWatch">
      <el-button type="primary" @click="handleEdit(null)">新增拜访记录</el-button>
    </el-row>
    <div v-show="!isSetting">
      <div style="margin-top:10px;">
        <el-table  :data="tableData" 
          :max-height="QJTableMaxHeight" 
          border
          style="width: 100%;min-height:39vh;"
          @sort-change="handleSort"
          @selection-change="handleSelectionChange">

          <el-table-column
            label="序号"
            type="index"
            width="60">
          </el-table-column>


          <!-- <el-table-column
            prop="customerName"
            label="客户名称"
          >
          </el-table-column> -->

          <el-table-column
            prop="visitor"
            label="拜访人"
          >
          </el-table-column>


          <el-table-column
            prop="visitDate"
            label="拜访时间"
            :formatter="function(row, column, cellValue, index){return  new Date(cellValue).format('YYYY-MM-DD')}"
          >
          </el-table-column>

          <el-table-column
            prop="wayOfVisiting"
            label="拜访方式"
          >
          </el-table-column>

          <el-table-column
            prop="receptionist"
            label="接待人"
          >
          </el-table-column>
          <el-table-column
            prop="receptionist"
            label="添加人"
          >
          </el-table-column>
          <el-table-column
            prop="addTime"
            label="添加时间"
            :formatter="function(row, column, cellValue, index){return  new Date(cellValue).format('YYYY-MM-DD')}"
          >
          </el-table-column>

          <!-- <el-table-column
            prop="contactInformation"
            label="联系方式"
          >
          </el-table-column>

          <el-table-column
            prop="visitSituation"
            label="拜访情况"
          >
          </el-table-column>
          <el-table-column
            prop="handleAdvice"
            label="处理意见"
          >
          </el-table-column> -->
          <el-table-column
            prop="isHandle"
            :formatter="function(row, column, cellValue, index){return cellValue === 0?'未处理':'已处理'}"
            label="处理状态"
          >
          </el-table-column>
          <el-table-column
            prop="handleUserName"
            label="处理人"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="handleTime"
            label="处理时间"
          >
          </el-table-column> -->

          <el-table-column
            label="操作"
            width="80"
            v-if="!isWatch">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-edit-outline" title="编辑"></i></el-button>
              <el-button v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,[scope.row]),placement:'left'}" type="text" style="padding:0;font-size:18px;">
                <i
                  class="el-icon-delete" title="删除"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:10px;text-align:center; float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
      <companyVisitForm v-if="!!edit" :data="edit" :callback="handleEditCallback" :defaultName="data.companyName" :defaultInfo="defaultInfo"></companyVisitForm>
    </div>
  </div>


</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest, formatArrayToTree} from '../../util/base';
  import $ from 'jquery';
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import companyVisitForm from './companyVisitForm';

  export default {
    name: "parameter-table",
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      companyVisitForm
    }, 
    props:{
      data:{
        type:Object,
      },
      isPut:{
        type:Boolean,
        required:true,
      },
      isWatch:{
        type:Boolean,
        default:false
      }
    },

    data() {
      let dateCheck = (rule,value,cb)=>{
        if(!value){
          cb();
        }
        if(!!value && !!this.form.visitDate){
          let timeNext = value.split('-').join('');
          let timeVisit = this.form.visitDate.split('-').join('')
        }
        if(!!this.form.visitDate){
          if(timeVisit - timeNext <= 0){
            cb()
          }else{
            cb(new Error('下次拜访时间不对！'))
          }
        }else{
          cb(new Error('请先填入拜访时间!'))
        }
      }
      let todayCheck = (rule,value,cb)=>{
        let time = new Date();
        let timeToday = time.getFullYear()+''+ (time.getMonth()+1 > 10 ? time.getMonth()+1 :'0'+(time.getMonth()+1) )+''+time.getDate();
        let timeVisit = value.split('-').join('')
        if(timeToday - timeVisit <= 0){
          cb()
        }else{
          cb(new Error('拜访时间不能小于今天！'))
        }

      }
      return {
        rules:{
          visitSituation:[{type:'string',max:200,trigger:'blur',message:'最大不能超过200个字符!'}],
          specialPrice:[{type:'string',max:200,trigger:'blur',message:'最大不能超过200个字符!'}],
          visitSummary:[{type:'string',max:200,trigger:'blur',message:'最大不能超过200个字符!'}],
          visitDate:[{validator:todayCheck,trigger:'blur'}],
          nextVisitDate:[{validator:dateCheck,trigger:'blur'}],
        },
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: '',
        orderType: '',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        isSetting: 0,
        defaultOpen: true,
        edit: null,
        visitors:[],
        depart:[],
        // 传入的默认信息
        defaultInfo:{},
        form:{
          visitor:'',
          attendant:'',
          visitDate:'',
          nextVisitDate:'',
          visitorOrgid:'',
          receptionist:'',
          contactInformation:'',
          visitSituation:'',
          specialPrice:'',
          visitSummary:''
        },

        attachment:'',
        fileList:[], //
        limitNumb:4,//附件上传个数限制
        up_url:'',//自定义上传路径 [非必填]  默认不用修改
        fdata:{//附件额外参数
              serverId:'',//服务id     [非必填]  分布式附件服务可以用默认不用配制
              flowId:'', //流程id      [非必填]  流程相关
              execType:'',//操作类型   [非必填]  业务相关
              caseId:'',//登记号       [非必填]  业务相关的登记号
        },


      }
    },
    methods: {
      handleCancel(){
        this.$emit('willBack')
      },
      handleClear(){
        this.form = {}
        this.$refs['upFiles'].$refs['upFiles'].clearFiles();
      },
      //callBack上传组件数据发生变化回调
      callBack(file,list){
        this.fileList=list;
      },

      handleSubmit(){
        let _this = this;
        let  attachment = '';
        for(let i=0;i<this.fileList.length;i++){
          attachment = this.fileList[i].response.v_attach_id+'#'+attachment
        }
        _this.form.attachment = attachment;
        this.form.companyId = this.data.id;
        this.$refs.form.validate((valid) => {
          if (valid) {
              ajaxRequest('post','back/companyVisit/',this.form,(res)=>{
                if(res.code==200){
                  this.$message({
                    type:'success',
                    message:'新增成功'
                  });
                  this.getTableList();
                }else{
                  this.$message.error('请求出错，请重新提交！')
                }
              });

          } else {
            return false;
          }
        })
      },


      changeDepartEvt(visitorOrgid) {
        //根据部门ID获取人员
        if (visitorOrgid) {
          ajaxRequest('get', 'back/user/listUserByDeptId/' + visitorOrgid, {}, (res) => {
            this.visitors = res.rows;
            Vue.set(this.form, 'visitor', '');
          })
        }
      },


      changeVisitor(id) {
        this.visitors.forEach((data) => {
          if (id == data.id) {
            Vue.set(this.form,'id',data.id);
          }
        });
      },

      handleSort: function (column, prop, order) {
        this.orderProperty = column['prop'];
        if (column['order'] == 'descending') {
          this.orderType = 'desc';
        } else {
          this.orderType = 'asc';
        }
        this.getTableList();
      },
      getComparison(property) {
        /*通过列属性，找到当前列json配置中第一个比较项*/
        let temp = paramJson.filter((v) => {
          return v.nameCode == property
        });
        let comparison = temp.length > 0 ? temp[0].comparison : '';
        if (Object.prototype.toString.call(comparison) === '[object String]') {
          comparison = comparison.split(",")[0]
        } else {
          comparison = comparison[0]
        }
        return comparison
      },
      getSqlSeg(property) {
        /*通过列属性，找到当前列json配置中sqlSeg信息*/
        let temp = paramJson.filter((v) => {
          return v.nameCode == property
        });
        let sqlSeg = temp.length > 0 ? temp[0].sqlSeg : '';
        return sqlSeg
      },
      getTableList() {
        // if (this.searchKey || this.fuzzySearch === 1 || this.orderProperty) {
          ajaxRequest('get', 'back/companyVisit/retrieve', {
            fuzzySearch: 1,
            page: this.page,
            isDelte:0,
            rows: this.rows,
            total: 0,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            companyId:this.data.id
          }, (res) => {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
              this.multipleSelection = [];
            }
          })
      },

      handleToggleTheme(color) {
        this.$store.commit('toggleTheme', color)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePageSizeChange(size) {
        this.page = 1;
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      handleEdit(rowInfo) {
        this.defaultInfo = {
          receptionist:this.data.contacter,
          contactInformation:this.data.mobilePhone
        }
        this.edit = rowInfo || {}
      },
      handleDelete(data) {
        if (data.length > 0) {
          let ids = data.map(function (v) {
            return v.id
          }).join(",");
          ajaxRequest('post', 'back/companyVisit/list/' + ids, {_method: 'delete'}, function (res) {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.getTableList();
            }
            else {
              this.$message.error('删除失败');
            }
          }.bind(this))
        } else {
          this.$message({
            message: '请先选择要删除的数据',
            type: 'warning'
          })
        }
      },
      handleEditCallback(rowInfo) {
        let _this = this;
        if (rowInfo) {
          if (rowInfo.id) {
            rowInfo.updateWay = 0;
            ajaxRequest('put', 'back/companyVisit/', rowInfo, function (res) {
              if (res.code === 200) {
                _this.$message.success('编辑成功');
                _this.getTableList();
                _this.edit = null;
              }
              else {
                _this.$message.error('编辑失败');
              }
            });
          }else{
            rowInfo.companyId = this.data.id;
            ajaxRequest('post','back/companyVisit/',rowInfo,(res)=>{
              if(res.code==200){
                this.$message({
                  type:'success',
                  message:'保存成功！'
                });
                this.getTableList();
                _this.edit = null;
              }else{
                this.$message.error('请求出错，请重新提交！')
              }
            });
          }
        }
        else {
          this.edit = null
        }
      },
      getTemplate() {
        /*获取到当前菜单下模板列表*/
        ajaxRequest('get', 'back/settingTemplate/list', {userId: 1, moduleType: 1, isDelete: 0}, (res) => {
          if (res.code == 200) {
            this.moduleList = res.rows;
            /*个性化设置完成后需通过templateValue刷新当前模板*/
            var temp = res.rows.filter((v) => {
              return v.id == this.templateValue
            });
            if (temp.length > 0) {
              this.recoverRetrieve(temp[0]);
            } else {
              this.templateValue = '';
              this.recoverRetrieve({});
            }
          }
        });
      },
      recoverRetrieve(temp) {
        /*模板信息回显高级搜索组件 模板具体内容放在json格式的content字段里*/
        if (!$.isEmptyObject(temp)) {
          let headObj = {};
          let info = temp.content ? JSON.parse(temp.content) : [];

          this.rowsCondition = info.conditions;
          this.sortBy = info.sortBy;
          this.order = info.order;
          if (info.headList) {
            for (let i = 0, len = info.headList.length; i < len; i++) {
              headObj[info.headList[i]] = true;
            }
          }
          this.headObj = headObj;
          this.defaultOpen = info.defaultOpen;
        }
      },
      handleSelectTemplate(value) {
        ajaxRequest('get', 'back/settingTemplate/list', {id: value}, (res) => {
          if (res.code == 200) {
            var temp = res.rows[0];
            this.recoverRetrieve(temp);
          }
        });
      },

    },
    mounted() {
      ajaxRequest('get', 'back/businessStaff/getDepart', {}, function (res) {
        this.depart = res
        if(this.form.departId){
          this.departEvtInit(this.form.departId);
        }
      }.bind(this))
      if(this.data.id){
        this.getTableList();
      }
    }
  }
</script>

<style scoped>
  .custom-input {
    width: 200px;
    height: 32px;
  }

  .custom-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  .custom-input .el-input-group__append {
    padding: 0 10px;
  }
  .custom-1d74b7 .el-col-2{width: 25%;}
  .bfjl{width: 100%;}
  .custom-1d74b7 .el-col-3{width: 100%;}
</style>
