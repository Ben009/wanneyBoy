<template>
    <div class="MStandardList">
        <div v-if="!standardId">
            <!-- 高级检索搜索框 start -->
            <div style="margin-bottom:10px;" v-if="defaultOpen">
                <Retrieve ref="retrieve-wapper"
                          :rowsCondition='rowsCondition'
                          :sortBy="sortBy"
                          :order="order"
                          :paramJson="paramJson"
                          :retrieveCondition="retrieveCondition"
                          :collectionInfo="collectionInfo"/>
            </div>
            <!-- 高级检索搜索框 end -->

            <!-- 个性化设置 start -->
            <div style="display: flex;justify-content: space-between;margin-bottom:10px;">
                <div style="width:240px">
                </div>
                <div style="display: inline-block;text-align: center">
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
        <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)"
                   class="el-icon-setting">个性化设置</el-button>
        <div style="display:inline-block">
          <global-tootips>
            <p>１、计量标准名称红色，表示已有证书或原始记录模版使用关联至该计量标准；</p>
            <p>２、查询记录灰色，表示该计量标准为封存或撤消；</p>
            <p>３、B1表按开展项目的校检方式为检定、检定或校准的内容导出；</p>
            <p>４、B2表按开展项目的校检方式为校准的内容导出；</p>
          </global-tootips>
        </div>
                    <!-- <div class="el-icon-info  shuoming" >
                      <el-row class="el-sm">
                        <p>1.有权限人员查询所有记录，无权限仅可查询本部门记录;</p>
                        <p>2.若<span style="color:red">计量标准名称</span> => 红色，表示已有模版使用该计量标准;</p>
                      </el-row>
                    </div> -->
        <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                   :handleMouldBack="QJHandleMouldBack"/>
      </span>
            </div>
            <!-- 个性化设置 end -->

            <!-- 表格 start -->
            <div class="MStandardList-table" v-loading="MStandardListLoading" element-loading-spinner="el-icon-loading">
                <el-table :max-height="QJTableMaxHeight"
                          :data="standardList"
                          border
                          style="width: 100%"
                          v-loading="loading">
                    <el-table-column
                            type="index"
                            width="50"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="code"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="代码">
                    </el-table-column>
                    <el-table-column
                            prop="standardName"
                            show-overflow-tooltip
                            :formatter="formatIsUsedByZs"
                            :render-header="QJrenderHeader"
                            label="计量标准名称">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.standardNameE"
                            prop="standardNameE"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="计量标准名称（英文）">
                    </el-table-column>
                    <el-table-column
                            prop="standardCerNo"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="计量标准证书号">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.socCerNo"
                            prop="socCerNo"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="社会公用证书号">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.standardProp"
                            prop="standardProp"
                            show-overflow-tooltip
                            :formatter="formatStandardProp"
                            :render-header="QJrenderHeader"
                            label="标准性质">
                    </el-table-column>
                    <el-table-column
                            prop="standardReleaseDate"
                            show-overflow-tooltip
                            :formatter="dealDate"
                            :render-header="QJrenderHeader"
                            label="计量标准发证日期">
                    </el-table-column>
                    <el-table-column
                            prop="standardValidDate"
                            show-overflow-tooltip
                            :formatter="dealDate"
                            :render-header="QJrenderHeader"
                            label="计量标准有效期">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.socReleaseDate"
                            prop="socReleaseDate"
                            show-overflow-tooltip
                            :formatter="dealDate"
                            :render-header="QJrenderHeader"
                            label="社会公用证书发证日期">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.socValidDate"
                            prop="socValidDate"
                            show-overflow-tooltip
                            :formatter="dealDate"
                            :render-header="QJrenderHeader"
                            label="社会公用证书有效日期">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.remark"
                            prop="remark"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="备注">
                    </el-table-column>
                    <el-table-column
                            prop="departmentName"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="维护部门">
                    </el-table-column>
                    <el-table-column
                            prop="responsibleUserName"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="负责人">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.telephone"
                            prop="telephone"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="负责电话">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.chiefExaminer"
                            prop="chiefExaminer"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="主持考核单位">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.takeExaminer"
                            prop="takeExaminer"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="承担考核单位">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.isSafekeeping"
                            prop="isSafekeeping"
                            :formatter="formatSafekeep"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="是否封存">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.approvalAuth"
                            prop="approvalAuth"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="批准机关">
                    </el-table-column>
                    <el-table-column
                            prop="auditingResult"
                            :formatter="formatAduit"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="审核状态">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.totalVal"
                            prop="totalVal"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="总价值">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.classAccuracy"
                            prop="classAccuracy"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="准确度等级">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.classAccuracyE"
                            prop="classAccuracyE"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="准确度等级（英文）">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.measuringRange"
                            prop="measuringRange"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="测量范围">
                    </el-table-column>
                    <el-table-column
                            v-if="headObj.measuringRangeE"
                            prop="measuringRangeE"
                            show-overflow-tooltip
                            :render-header="QJrenderHeader"
                            label="测量范围（英文）">
                    </el-table-column>
                    <el-table-column
                            show-overflow-tooltip
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-edit-outline" title="详情"></i>
                            </el-button>
                            <el-button v-has="'M22004'"
                                       v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,scope.row)}"
                                       type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-delete" title="删除"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 表格 end -->
            <div style="margin-top:10px;text-align:center; float:right;">
                <mind-pagination
                        :current-page="page"
                        :page-size="rows"
                        :total="total"
                        @size-change="handlePageSizeChange"
                        @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
        </div>
        <m-standard-form v-if="!!standardId" :standardId="standardId" @goBack="back" :isAdd="false"></m-standard-form>
    </div>
</template>

<script>
    import $ from 'jquery';
    import Retrieve from '../../Retrieve'; // 高级检索
    import WorkMould from '../../mould/WorkMould'; // 高级检索弹出框
    import RetrieveConfig from './RetrieveConfig/RetrieveConfig'; // 高级检索配置项
    import TableColumnHeader from '../../Table/TableColumnHeader'; // 表格头部
    import MStandardForm from './MStandardForm'

    export default {
        name: "MStandardList",
        data() {
            return {
                /************************************* 高级检索字段 start *************************************/
                fuzzySearch: 0,
                isSetting: 0, //控制个性化设置弹窗是否展示
                rowsCondition: RetrieveConfig, //默认同目录下json数据 会依据模板改变
                paramJson: RetrieveConfig, //同目录下json数据 常量
                moduleList: [], //模板列表
                templateValue: "", //当前选择的模板id
                sortBy: "", //排序字段
                order: "", //desc降序 asc升序
                headObj: {}, //表头显示对象 {category:true}
                defaultOpen: true, //默认开启高级查询
                userId: "",
                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
                orderProperty: '',
                orderType: '',
                /************************************* 高级检索字段 end *************************************/

                /************************************* 表格字段开始 start *************************************/
                page: 1,
                rows: 10,
                total: 0,
                MStandardListLoading: false,
                //是否显示编辑页面
                standardId: null,
              loading:false,
            }
        },
        computed: {
            standardList() {
                return this.$store.state.Mstandard.standardlist
            },
            departlist() {
                return this.$store.state.Mstandard.departlist
            }
        },
        methods: {
            /***********************************************  表格方法 start  *********************************************/
            /**
             * [getTableList 获取所有的计量标准列表]
             * @return {[type]} [description]
             */
            getTableList() {
              this.loading=true
                console.log('================')
                this.MStandardListLoading = true;
                let routerApi = this.searchKey || this.fuzzySearch === 1 ? 'getRetrieveStandardList' : 'getStandardList'
                this.$store.dispatch('getRetrieveStandardList', {
                    // fuzzySearch: this.searchKey || this.fuzzySearch === 1 ? 1 : null,
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    isDelete: 0,
                    sc: this.sc
                }).then(res => {
                    this.total = res.total
                    this.MStandardListLoading = false
                  this.loading=false
                })
            },
            /**
             * [handleDelete 删除操作：软删除 (isDelete：1)]
             * @param  {[type]} rowInfo [description]
             * @return {[type]}         [description]
             */
            handleDelete(rowInfo) {
                this.$store.dispatch('updataStandardList', {id: rowInfo.id, isDelete: 1}).then(res => {
                    this.$message.success('删除成功')
                    this.getTableList()
                })
            },
            /**
             * [handleEdit 编辑操作 跳转到录入页面 其中有一个审核标志和证书审核编辑区分]
             * @param  {[type]} rowInfo [description]
             * @return {[type]}         [description]
             */
            handleEdit(rowInfo) {
                this.$store.commit('SET_CERTIFICATE_ADUIT', 'list')
                this.standardId = rowInfo.id;
                // this.$router.push({
                //   path: '/admin/247',
                //   query: {
                //     id:rowInfo.id
                //   }
                // })
            },
            back() {
                this.standardId = null;
                this.asyncInitFunction();
            },
            /**
             * [dealDate 格式化显示时间]
             * @param  {[type]} row       [description]
             * @param  {[type]} column    [description]
             * @param  {[type]} cellValue [description]
             * @return {[type]}           [description]
             */
            dealDate(row, column, cellValue) {
                if (cellValue) {
                    return new Date(cellValue).format('YYYY-MM-DD')
                }
            },
            /**
             * [formatDepart 格式化显示部门]
             * @param  {[type]} row       [description]
             * @param  {[type]} column    [description]
             * @param  {[type]} cellValue [description]
             * @return {[type]}           [description]
             */
            formatDepart(row, column, cellValue) {
                if (cellValue) {
                    for (let key of this.departlist) {
                        if (key.id == cellValue) {
                            return key.departName
                        }
                    }
                }
            },
            /**
             * [formatAduit 格式化显示审核状态]
             * @param  {[type]} row       [description]
             * @param  {[type]} column    [description]
             * @param  {[type]} cellValue [description]
             * @return {[type]}           [description]
             */
            formatAduit(row, column, cellValue) {
                if (row.isAuditing == 0 && row.auditingResult == 0) {
                    return '未送审'
                } else {
                    let result = {0: '未审核', 1: '通过', 2: '未通过'}
                    return result[cellValue]
                }
            },
            formatSafekeep(row, column, cellValue) {
                if (row.isSafekeeping == 0) {
                    return '否'
                } else {
                    return '是'
                }
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
            /***********************************************  表格方法 end  *********************************************/
            /*********************************************** 表格数据格式化集合 ********************************************/
            formatStandardProp(row, column, cellValue) {
                let result = {0: '高标', 1: '次标'}
                return result[cellValue]
            },
            formatIsUsedByZs(row, column, cellValue) {
                if (row.isUsedByZs > 0) {
                    return ( < span
                    style = "color:red" > {cellValue} </span>)
                } else {
                    return cellValue;
                }
            },
            /*********************************************** 表格数据格式化集合 ********************************************/
            // 异步编程管理
            async asyncInitFunction() {
                await Promise.all([this.getTableList(), this.QJGetMounted()])
            }
        },
        components: {
            Retrieve,
            WorkMould,
            TableColumnHeader,
            MStandardForm
        },
        mounted() {
            //判断是否从首页跳转进来,并设置默认查询条件
            let objFromIndex = this.$route.query;
            if (objFromIndex && objFromIndex.title) {
                let now = new Date();
                now.setMonth(now.getMonth() + 6);
                this.collectionInfo = [{
                    name: '',
                    value: [{
                        comparison: "3",
                        nameCode: "standardValidDate",
                        sqlSeg: "trunc(m.STANDARD_VALID_DATE)",
                        value: now.format("YYYY-MM-DD")
                    }]
                }];
                setTimeout(res => {
                    this.QJAdvanceSearch();
                }, 0)
            } else {
                this.asyncInitFunction()
            }
        }
    }
</script>

<style scoped lang="scss">
    .MStandardList {

    .flex-one {
        flex: 1
    }

    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
        cursor: pointer;
    }

    .shuoming::after {
        content: "";
        /*background: #fff;*/
        position: absolute;
        z-index: 999;
        /* top: 0; */
        /* left: -65px; */
        right: 10;

    }

    .el-sm {
        background: #ffffff;
        position: absolute;
        z-index: 999;
        -webkit-box-shadow: 1px 7px 33px -9px #969696;
        box-shadow: 1px 7px 33px -9px #969696;
        border: 1px solid #56bc4e8c;
        border-radius: 5px;
        color: dimgrey;
        margin-left: -230px;
        margin-right: 0px;
        word-break: break-all;
        margin-top: 5px;
        padding: 4px 5px;
        font-size: 14px;
        opacity: 50;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

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
