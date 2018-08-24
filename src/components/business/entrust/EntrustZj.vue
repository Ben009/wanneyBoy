<template>
    <div>
        <div style="margin-bottom:5px;">
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"/>
        </div>
        <div style="display: flex;justify-content: space-between;">
            <!-- <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增委托单位</el-button> -->
            <div style="display: inline-block;text-align: center;margin:0 auto">
                <el-button type="primary" size="mini" @click="BatchNumber">批量要号</el-button>
                <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
            </div>
            <span style="float: right">
            <el-select size="mini" v-if="resultCondition.length" v-model="templateValue" placeholder="请选择"
                       @change="QJHandleSelectTemplate">
              <el-option
                      v-for="item in moduleList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="QJPersonalSetting(1)"
                       class="el-icon-setting">个性化设置</el-button>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                       :handleMouldBack="QJHandleMouldBack"/>
          </span>
        </div>
        <!-- <div style="display: inline-block;text-align: center">
          <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
          <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning" >&nbsp;清空</el-button>
        </div>
        <span style="float: right">
          <el-select size="mini" v-if="resultCondition.length" v-model="templateValue"  placeholder="请选择" @change="handleSelectTemplate">
            <el-option
              v-for="item in moduleList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
           <div style="margin-bottom:5px;">
          <Retrieve v-if="defaultOpen" ref="retrieve-wapper" :needSort="false" :rowsCondition='rowsCondition' :sortBy="sortBy"
                  :order="order" @toparentevent="advanceSearch"/>
          </div>
           <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
          &nbsp;&nbsp;&nbsp;
          <el-button type="primary" size="mini" round @click="BatchNumber" class="el-icon-setting">批量要号</el-button>
          <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
        </span>
      </div> -->
        <div style="margin-top:10px;">
            <el-table :max-height="QJTableMaxHeight" v-loading="loading"
                      :data="tableData"
                      border
                      @selection-change="handleSelectionChange"
                      style="width: 100%" size="small">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="instrumentationName" label="器具名称"></el-table-column>
                <el-table-column prop="deviceNumber" label="设备编号"></el-table-column>
                <el-table-column prop="manufacturingCode" label="出厂编号"></el-table-column>
                <el-table-column prop="model" label="型号规格"></el-table-column>
                <el-table-column prop="departName" label="使用部门"></el-table-column>
                <el-table-column prop="addTime" label="申请时间" :formatter="dealDate"></el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="操作">
                    <template slot-scope="scope">
                        <el-button v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,[scope.row])}"
                                   type="text" style="padding:0;font-size:18px;">
                            <i class="el-icon-delete" title="删除"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top:20px;text-align:center; float:right;">
            <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import Retrieve from '../../Retrieve'; // 高级检索
    import WorkMould from '../../mould/WorkMould'; // 高级检索弹出框
    import paramJson from './EntrustZj'; // 高级检索配置项
    import TableColumnHeader from '../../Table/TableColumnHeader'; // 表格头部
    import {ajaxRequest} from '@/components/util/base';

    export default {
        name: "MStandardList",
        data() {
            return {
                /************************************* 高级检索字段 start *************************************/
                defaultOpen: true, // 高级检索是否开启
                rowsCondition: paramJson, // 高级检索配置项
                sortBy: '', // 排序字段
                order: '', // desc降序 asc升序
                headObj: {}, // 表头显示对象 {category:true}
                isSetting: false, // 高级检索弹框是否展示
                templateValue: '', //当前选择的模板id
                fuzzySearch: 0,
                multipleSelection: "",
                paramJson: paramJson, //同目录下json数据 常量
                /************************************* 高级检索字段 end *************************************/

                /************************************* 表格字段开始 start *************************************/
                tableData: [],
                page: 1,
                rows: 10,
                total: 0,
                resultCondition: [],
                retrieveCondition: [],
                departStr: "",
                loading: false
            }
        },
        computed: {
            moduleList() {
                return this.$store.state.Mstandard.retrieveTemplate
            },
            departlist() {
                return this.$store.state.Mstandard.departlist
            }
        },
        methods: {
            /***********************************************  高级检索对应处理逻辑 start  *********************************************/
            /**
             * [getModuleType 获取高级检索对应的模板地址]
             * @return {[type]} [description]
             */
            getModuleType() {
                let currentRouter = this.$route,
                    currentType = '';
                if (currentRouter.matched && currentRouter.matched.length) {
                    currentRouter.matched.forEach(val => {
                        if (val.path == currentRouter.path) {
                            currentType = val.components.default['__file']
                        }
                    })
                }
                let index = currentType.lastIndexOf('\\');
                currentType = currentType.substring(index + 1)
                currentType = currentType.substring(-1, currentType.lastIndexOf('.'))
                return currentType
            },


            /**
             * [getTemplate 获取高级检索模板]
             * @return {[type]} [description]
             */
            getTemplate() {
                /*获取到当前菜单下模板列表*/
                this.$store.dispatch('getTemplate', {
                    userId: 1,
                    moduleType: this.getModuleType(),
                    isDelete: 0
                }).then(res => {
                    /*个性化设置完成后需通过templateValue刷新当前模板*/
                    var temp = [];
                    if (this.templateValue) {
                        temp = res.filter((v) => {
                            return v.id == this.templateValue
                        })
                    } else {
                        temp = res.filter((v) => {
                            this.templateValue = v.id;
                            return JSON.parse(v.content).isDefault
                        })
                    }
                    if (temp.length > 0) {
                        this.recoverRetrieve(temp[0])
                    } else {
                        this.templateValue = ''
                        this.recoverRetrieve({})
                    }
                })
            },


            /**
             * [recoverRetrieve 高级检索回调时触发数据更新操作]
             * @param  {[type]} temp [description]
             * @return {[type]}      [description]
             */
            recoverRetrieve(temp) {
                /*模板信息回显高级搜索组件 模板具体内容放在json格式的content字段里*/
                if (!$.isEmptyObject(temp)) {
                    let headObj = {}
                    let info = temp.content ? JSON.parse(temp.content) : []
                    //console.log('bvbvbv',info)

                    this.rowsCondition = info.conditions
                    this.sortBy = info.sortBy
                    this.order = info.order
                    if (info.headList) {
                        for (let i = 0, len = info.headList.length; i < len; i++) {
                            headObj[info.headList[i]] = true
                        }
                    }
                    this.headObj = headObj
                    this.defaultOpen = info.defaultOpen
                }
            },


            /**
             * [handleSelectTemplate 处理选中的模板数据跟新]
             * @param  {[type]} value [description]
             * @return {[type]}       [description]
             */
            handleSelectTemplate(value) {
                this.$store.dispatch('getDefaultSelect', {id: value}).then(res => {
                    let temp = res[0]
                    this.recoverRetrieve(temp)
                })
            },

            /**
             * [defaultShowAllCol 默认展示所有的头部]
             * @return {[type]} [description]
             */
            defaultShowAllCol() {
                let param = [].concat(this.rowsCondition), headObj = {}
                // console.log(this.RetrieveConfig,'11111')
                param.forEach(v => v.isDefault == 1 ? headObj[v.nameCode] = true : null)
                this.headObj = headObj
            },

            /**
             * [handleSearch 处理搜索：为高级检索匹配对应数据]
             * @param  {[type]} column [description]
             * @param  {[type]} value  [description]
             * @return {[type]}        [description]
             */
            handleSearch(column, value) {
                this.$refs['retrieve-wapper'].insertRetrieveItem(0, column['property'], 0, value);
            },
            handleSelectionChange(val) {
                var dacode = new Array();
                val.forEach(v => {
                    //添加部门名称进去
                    dacode.push(v.departName);
                });
                this.departStr = dacode.toString();
                console.log("departStr---->" + this.departStr);
                this.multipleSelection = val;
            },
            /**
             * [renderHeader 插入搜索dom]
             * @param  {[type]} h              [description]
             * @param  {[type]} options.column [description]
             * @param  {[type]} options.$index [description]
             * @return {[type]}                [description]
             */
            renderHeader: function (h, {column, $index}) {
                /*表格头部自定义渲染  key值必加 隐藏列时需重新渲染头部*/
                let property = column.property
                let currentInfo = this.rowsCondition.filter((v) => {
                    return v.nameCode == property
                })
                //console.log('aaaa',currentInfo,'序号',$index)
                return (
                    < TableColumnHeader
                key = {$index +property}
                column = {column}
                handleSearch = {this.handleSearch.bind(this)
            }
                currentInfo = {currentInfo}
                />
            )
            },

            /**
             * [personalSetting 个性化设置]
             * @param  {[type]} flag [description]
             * @return {[type]}      [description]
             */
            personalSetting(flag) {
                /*控制显示个性化设置的弹窗 isSetting 默认false*/
                this.isSetting = flag
                !flag ? this.getTemplate() : null
            },

            /**
             * [advanceSearch 高级布局搜索]
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            advanceSearch: function (data) {
                this.sc = JSON.stringify(data.conditions);
                this.orderProperty = data.sortBy;
                this.orderType = data.order;
                this.fuzzySearch = 1;
                this.getTableList();
            },
            /***********************************************  高级检索对应处理逻辑 end  *********************************************/

            /***********************************************  表格方法 start  *********************************************/
            getTableList() {
                this.loading = true;
                ajaxRequest('POST', 'back/instraumentationTra/findByZjInstrumenation', {
                    fuzzySearch: 1,
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    isDelete: 0,
                    sc: this.sc,
                }, (res) => {
                    this.tableData = res.rows;
                    this.total = res.total;
                    this.loading = false;
                })


            },
            handleDelete(rowInfo) {
                console.log(rowInfo);
                ajaxRequest('POST', 'back/instrumentationTraDetail/deleteBatch', {
                    ids: rowInfo[0].id,
                    traId: rowInfo[0].tarId
                }, (res) => {
                    if (res.code == 200) {
                        this.$message.success('删除成功')
                        this.getTableList()
                    } else {
                        this.$message.success('删除失败')
                    }
                })
            },
            handleEdit(rowInfo) {
                this.$router.push({
                    path: '/admin/258',
                    query: {
                        id: rowInfo.id
                    }
                })
            },
            dealDate(row, column, cellValue) {
                if (cellValue) {
                    return new Date(cellValue).format('YYYY-MM-DD')
                }
            },
            formatDepart(row, column, cellValue) {
                if (cellValue) {
                    for (let key of this.departlist) {
                        if (key.id == cellValue) {
                            return key.departName
                        }
                    }
                }
            },
            getDepartList() {
                // this.$store.dispatch('getDepartList')
            },
            //批量要号传递器具信息
            BatchNumber() {
                //获取departStr
                var st = "";
                if (this.departStr != null && this.departStr != "") {
                    var sa = this.departStr.split(",");//根据逗号分隔
                    var x = "";//比较的变量
                    var flag = true;
                    for (var i = 0; i < sa.length; i++) {
                        if (i > 0) {
                            if (x != sa[i]) {
                                flag = false;
                            }
                        }
                        x = sa[i];
                    }
                    if (flag == false) {
                        this.$message.error('请选择相同的部门。');
                        return false;
                    }
                }
                if (this.multipleSelection == "") {
                    this.$message.error('请至少选择一条数据。')
                    return false;
                }
                //将器具名称置为空
                this.multipleSelection.forEach((row) => {
                    row.applianceName = "";
                });

                this.$router.push({
                    name: '169',
                    params: {
                        source: 1,
                        obj: this.multipleSelection
                    }
                })
            },
            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size;
                this.getTableList()
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage
                this.getTableList()
            },
            // 异步编程管理
            async asyncInitFunction() {
                await Promise.all([this.defaultShowAllCol(), this.getTableList(), this.getDepartList()])
            }
        },
        components: {
            Retrieve,
            WorkMould,
            TableColumnHeader
        },
        mounted() {
            this.asyncInitFunction()
        }
    }
</script>

<style scoped>
    .el-icon-setting {
        background: none !important;
        border: none !important;
        color: #3094e0 !important;
    }

    .el-icon-setting:hover {
        color: #3094e0 !important;
    }

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
</style>
