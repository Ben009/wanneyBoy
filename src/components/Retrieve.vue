<template>
  <div style="background:#fbfbfb; padding:14px 0px;">
    <table style="font-size:14px; width:100%; text-align:center; table-layout:fixed;">
      <thead>
      <tr>
        <th class="qb-th-normal" style="width:150px;">逻辑：</th>
        <th class="qb-th-normal">检索项：</th>
        <th class="qb-th-normal">比较：</th>
        <th class="qb-th-normal" style="min-width:200px;">检索词：</th>
        <th class="qb-th-normal"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(v,i) in search.conditions">
        <td class="retrieveTr">
          <el-select size="mini" v-if="i>0" v-model="v.logicalValue" placeholder="请选择">
            <el-option
                    v-for="item in logicalValues"
                    :key="item.value"
                    :label="item.title"
                    :value="item.value">
            </el-option>
          </el-select>
        </td>
        <td style="padding:5px 0px;display:inline-block">
          <el-select size="mini" v-model="v.sqlSeg" placeholder="请选择" @change="changeRetrieveItem(v,i)">
            <el-option
                    v-for="item in tempColumnsData"
                    v-if="item.isQueryCondition==1"
                    :key="item.nameCode"
                    :label="item.name"
                    :value="item.sqlSeg">
            </el-option>
          </el-select>
        </td>
        <td>
          <el-select size="mini" v-model="v.comparison" placeholder="请选择">
            <el-option
                    v-for="item in columnsObject[v.nameCode]?columnsObject[v.nameCode].comparison:[]"
                    :key="item"
                    :label="Compare[item]"
                    :value="item">
            </el-option>
          </el-select>
        </td>
        <td>
          <el-input size="mini"
                    v-if="!columnsObject[v.nameCode] || columnsObject[v.nameCode].component=='input'"
                    v-model="v.value" placeholder="请输入内容"></el-input>
          <el-date-picker
                  v-else-if="columnsObject[v.nameCode].component==='date'"
                  v-model="v.value"
                  size="mini"
                  type="date"
                  :format="columnsObject[v.nameCode].dateFormat"
                  :value-format="columnsObject[v.nameCode].dateFormat"
                  placeholder="选择日期">
          </el-date-picker>
          <el-select size="mini" v-else-if="columnsObject[v.nameCode].component='select'" v-model="v.value"
                     placeholder="请选择">
            <el-option
                    v-for="item in columnsObject[v.nameCode].options"
                    :key="rexObj[v.nameCode]?item[rexObj[v.nameCode].code]:item.code"
                    :label="rexObj[v.nameCode]?item[rexObj[v.nameCode].remark]:item.remark"
                    :value="rexObj[v.nameCode]?item[rexObj[v.nameCode].code]:item.code">
            </el-option>
          </el-select>
          <!--<div v-else-if="columnsObject[v.nameCode].component='select'">
            <span v-for="item in columnsObject[v.nameCode].options">{{rexObj}}{{rexObj[v.nameCode]}}</span>
          </div>-->
        </td>
        <td ref="retrieve-td">
          <el-button size="mini" type="primary" plain @click="addRetrieveItem">增加</el-button>
          <el-button size="mini" type="danger" plain @click="delRetrieveItem(i)">删除</el-button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="qb-second" v-if="needSort">


      <!--<el-button type="primary" round @click="retrieve" class="el-icon-search">查询</el-button>-->
      <div :style="{float:'right',marginRight:marginRight2}">

        <!-- <el-select size="mini"  v-model="collectionType" placeholder="请选择" @change="handleCollectionChange" style="width:100px;">
           <el-option
             v-for="item in collectionList"
             :key="item.name"
             :label="item.name"
             :value="item.name">
           </el-option>
         </el-select>-->
        <el-dropdown trigger="click" @command="handleCollectionChange">
          <div class="el-dropdown-link">
            <div style="position: relative;cursor: pointer; padding: 0 40px 0 10px;border:1px #c0c4cc solid;border-radius: 3px;height:28px;">
              <input type="text" readonly v-model="collectionType" placeholder="请选择"
                     style="width:60px;cursor: pointer;border:none;height:26px;">
              <i class="el-icon-circle-close" style="position: absolute;right:25px;top:6px;"
                 @click="deleteCollect($event)"></i>
              <i class="el-icon-arrow-down el-icon--right"
                 style="position: absolute;right:7px;top:6px;color:#c0c4cc"></i>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown" style="width:110px;" class="qb-drop-collect">
            <el-dropdown-item command="-1">
              请选择
            </el-dropdown-item>
            <el-dropdown-item v-for="item in collectionList" :key="item.name" :command="item.name">
              {{item.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" type="primary" plain
                   v-mindPopover="{message:'<div>请输入收藏名称</div><div><el-input v-model=flag3 v-focusSelectFull></el-input></div>',
                           placement:'left',success:handleCollect.bind(this),info:'',isOpen:handleOpen.bind(this)}">
          收藏
        </el-button>
        <!--<el-button v-if="collectionType" size="mini" type="danger" plain @click="deleteCollect">删除</el-button>-->
      </div>

      <div style="margin-left:150px;">
        <span style="display:inline-block;margin-right:3%;">请选择查询结果排序方式：</span>
        <el-select size="mini" v-model="search.sortBy" placeholder="请选择">
          <el-option
                  v-for="item in sortColumnsData"
                  :key="item.name"
                  :label="item.name"
                  :value="item.sqlSeg">
          </el-option>
        </el-select>
        <el-select size="mini" v-model="search.order" placeholder="请选择">
          <el-option
                  v-for="item in orders"
                  :key="item.name"
                  :label="item.title"
                  :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div style="text-align:center; font-size:14px; color:#606266; margin:10px 0;" v-if="!needSort">
      <!--<el-button type="primary" round @click="retrieve" class="el-icon-search">查询</el-button>-->
    </div>

  </div>
</template>

<script>
    import Vue from 'vue';
    import {ajaxRequest, ajaxSyncRequest, ajaxProxyRequest, ajaxSyncProxyRequest} from './util/base';
    import $ from 'jquery';
    /*
      import {Select,  Input, Button, Checkbox} from 'element--ui移除外部引入element';
      Vue.use(Input);
      Vue.use(Button);
      Vue.use(Checkbox);
       */
    export default {
        name: "retrieve",
        props: {
            rowsCondition: {
                type: Array,
                required: true
            },
            paramJson: {
                type: Array,
            },
            sortBy: {},
            order: {},
            logic: {
                type: String,
                default() {
                    return 'and'
                }
            },
            retrieveCondition: {
                type: Array,
                default() {
                    return []
                }
            },
            collectionInfo: {
                type: Array,
                default() {
                    return []
                }
            },
            needSort: {
                type: Boolean,
                default() {
                    return true
                }
            }
        },
        data() {

            return {
                logicalValues: [{title: '并且', value: 0}, {title: '或者', value: 1}],
                orders: [{title: '升序', value: 'asc'}, {title: '降序', value: 'desc'}],
                columns: [].concat(this.rowsCondition),
                search: {
                    conditions: [{         //检索条件数组
                        nameCode: null,      //字段英文名称
                        sqlSeg: null,        //检索项
                        comparison: null,  //检索条件
                        value: null,      //检索值
                    }],
                    sortBy: null,     //查询结果排序字段
                    order: null      //排序类型 asc升序  desc降序
                },
                Compare: {
                    0: '包含', 1: '等于', 2: '大于', 3: '小于', 4: '不等于', 5: '大于等于', 6: '小于等于', 7: '不包含', 8: '为空', 9: '不为空'
                },
                ajaxOptions: {}, ///存放所有需要ajax的下拉框options
                rexObj: {},     //存放所有需要ajax的下拉框options的code remark对应值

                collectionType: null,
                collectionList: [],
                marginRight1: 0,
                marginRight2: '9%',
            }
        },
        computed: {
            /*将列信息通过nameCode字段放入计算对象里 方便映射组件*/
            columnsObject() {
                let obj = {};
                //console.log('computed 循环计算',this.columns)
                this.columns.forEach(v => {
                    if (v.component == 'select') {
                        if (v.ajaxUrl) {
                            if (!this.ajaxOptions[v.nameCode]) {
                                var options = this.getOptions(v.ajaxUrl);
                                this.ajaxOptions[v.nameCode] = options;
                            } else {
                                var options = this.ajaxOptions[v.nameCode]
                            }
                            this.rexObj[v.nameCode] = v.toRex;
                        } else {
                            var options = v.options;
                        }
                        v.options = options;
                    }
                    if (Object.prototype.toString.call(v.comparison) === '[object String]') {
                        v.comparison = v.comparison.split(",");
                    }
                    obj[v.nameCode] = v;
                });
                console.log(obj)
                return obj;
            },
            tempColumnsData() {
                return this.columns
            },
            sortColumnsData() {
                let arr = [];
                if (!!this.paramJson) {
                    this.paramJson.forEach((v) => {
                        v.isSort == 1 ? arr.push(v) : null;
                    });
                }
                return arr
            },
        },
        watch: {
            /*props会根据不同的模板选择改变,用watch监听,重新赋对应值*/
            rowsCondition: function (newValue, oldValue) {
                //console.log('@@@@@',newValue)
                this.columns = newValue;
                /*有默认值 但下拉列表不包括默认值*/
                this.checkConditions();
                /*let sqlSeg = this.search.conditions[0].sqlSeg;
                let temp = [].concat(newValue).filter(v=>{return v.sqlSeg==sqlSeg});
                if(temp.length==0){
                  Vue.set(this.search.conditions,0,{nameCode:null, sqlSeg:null, comparison:null, value:null,});
                }*/
            },
            sortBy: function (newValue, oldValue) {
                this.search.sortBy = newValue;
            },
            order: function (newValue, oldValue) {
                if (newValue == 1) {
                    this.search.order = 'desc';
                } else if (newValue == 2) {
                    this.search.order = 'asc';
                } else {
                    this.search.order = 'desc';
                }

            },
            retrieveCondition(n) {
                if (n.length > 0) {
                    this.insertRetrieveItem();
                }

            },
            collectionInfo(n) {

                if (this.collectionInfo.length > 0) {
                    // debugger
                    let arr = $.extend(true, [], this.collectionInfo);
                    this.collectionList = $.extend(true, [], this.collectionInfo);
                    this.search.conditions = arr[0].value;
                    this.collectionType = arr[0].name;

                }
            },
            innerWidth(v) {//监控该值实现窗口变化触发
                this.getMarginRight();
            }
        },
        methods: {
            /*收藏下拉change*/
            handleCollectionChange(value) {
                if (value !== '-1') {
                    this.collectionType = value;
                    let arr = $.extend(true, [], this.collectionList);
                    arr.forEach(v => {
                        if (v.name === value) {
                            this.search.conditions = v.value;
                        }
                    })
                } else {
                    this.collectionType = null;
                    this.defaultChange(true);
                    this.search.conditions.splice(1);
                }

            },
            /**
             * 是否打开收藏的提示框 修改则不需要打开
             * @return {[type]} [description]
             */
            handleOpen() {
                let type = this.QJGetModuleType();
                let userId = localStorage.getItem("userId");
                let curCondition = $.extend(true, [], this.collectionList);
                let param = {
                    userId: userId,//用户id
                    moduleType: type,//模板类型
                    searchConditionCollection: JSON.stringify(curCondition),//收藏检索条件
                };
                if (this.collectionType) {
                    curCondition.forEach(v => {
                        if (v.name == this.collectionType) {
                            v.value = $.extend(true, [], this.search.conditions);
                        }
                    });
                    ajaxRequest('post', 'back/settingTemplate/', param, (res) => {
                        if (res.code == 200) {
                            this.collectionList = curCondition;
                            this.$message({type: "success", message: "修改成功"});
                        }
                    });
                    return false;
                } else {
                    return true;
                }
            },
            /*点击收藏事件*/
            handleCollect(_this) {
                let value = '';
                if (_this['_data'].flag3) value = _this['_data'].flag3;

                if (value == '' || value == null) {
                    this.$message({
                        type: 'error',
                        message: '收藏名称不能为空'
                    });
                    return true
                }

                let flag = false;
                this.collectionList.forEach(v => {
                    if (v.name == value) {
                        flag = true;
                    }
                });
                if (flag) {
                    this.$message({
                        type: 'error',
                        message: '收藏名称重复'
                    });
                    return true
                }

                let type = this.QJGetModuleType();
                let userId = localStorage.getItem("userId");
                let curCondition = $.extend(true, [], this.collectionList);
                curCondition.unshift({name: value, value: $.extend(true, [], this.search.conditions)});
                let param = {
                    userId: userId,//用户id
                    moduleType: type,//模板类型
                    searchConditionCollection: JSON.stringify(curCondition),//收藏检索条件
                };
                ajaxRequest('post', 'back/settingTemplate/', param, (res) => {
                    if (res.code == 200) {
                        this.collectionList = curCondition;
                        this.collectionType = value;
                        this.$message({type: "success", message: "收藏成功"});
                    }
                })
            },
            /*删除收藏*/
            deleteCollect(ev) {
                ev.stopPropagation();
                let type = this.QJGetModuleType();
                let userId = localStorage.getItem("userId");
                let curCondition = $.extend(true, [], this.collectionList);
                curCondition = curCondition.filter(v => {
                    return v.name != this.collectionType
                });
                if (curCondition.length == 0 && !this.collectionType) {
                    return
                }
                ajaxRequest('post', 'back/settingTemplate/',
                    {
                        userId: userId,
                        moduleType: type,
                        searchConditionCollection: JSON.stringify(curCondition)
                    }, (res) => {

                        if (res.code == 200) {
                            this.collectionList = curCondition;
                            this.collectionType = null;
                            this.defaultChange(true);
                            this.search.conditions.splice(1);
                            this.$message({type: "success", message: "删除该收藏成功"});
                        }
                    })
            },
            checkConditions() {
                let arr = this.search.conditions, len = arr.length;
                for (let i = 0; i < len; i++) {
                    let flag = this.handleCheck(arr[i].sqlSeg);
                    if (flag) {
                        this.search.conditions.splice(i, 1);
                        i--;
                        len--;
                    }
                }
                if (this.search.conditions.length == 0) {
                    Vue.set(this.search.conditions, 0, {nameCode: null, sqlSeg: null, comparison: null, value: null,});
                }
            },
            handleCheck(v) {
                let flag = true;
                this.columns.forEach((item, index) => {
                    if (v == item.sqlSeg) {
                        flag = false;
                    }
                });
                return flag
            },
            addRetrieveItem() {
                /*新增一条检索项 用conditions维护*/
                this.search.conditions.push({
                    logicalValue: this.logic == 'or' ? 1 : 0,
                    nameCode: null,
                    sqlSeg: null,
                    comparison: null,
                    value: null,
                })
            },
            insertRetrieveItem() {
                let arr = this.retrieveCondition;
                if (arr.length == 0) {
                    return
                }
                let lv = arr[0], n = arr[1], c = arr[2], v = arr[3], s = arr[4];
                let obj = this.search.conditions[0];
                /*表格标题检索回调 插入一条检索项*/
                //if(obj.sqlSeg == null || (obj.sqlSeg == s && !obj.value)){
                if (!obj.value) {
                    this.search.conditions[0].nameCode = n;
                    this.search.conditions[0].sqlSeg = s;
                    this.search.conditions[0].comparison = c;
                    this.search.conditions[0].value = v;
                } else {
                    this.search.conditions.push({
                        logicalValue: this.logic == 'or' ? 1 : 0,
                        sqlSeg: s,
                        nameCode: n,
                        comparison: c,
                        value: v,
                    })
                }
            },
            delRetrieveItem(index) {
                /*删除一条检索项 用conditions维护*/
                if (this.search.conditions.length == 1) {
                    let nameCode = this.search.conditions[0].nameCode;
                    let sqlSeg = this.search.conditions[0].sqlSeg;
                    let comparison = this.search.conditions[0].comparison;
                    this.search.conditions = [{
                        nameCode: nameCode,
                        sqlSeg: sqlSeg,
                        comparison: comparison,
                        value: null,
                    }];
                    console.log(this.search.conditions)
                } else {
                    this.search.conditions.splice(index, 1);
                }
            },
            changeRetrieveItem(item, index) {
                /*检索项change时,更改conditions当前index属性值*/
                let sqlSeg = item.sqlSeg, obj = $.extend({}, this.columnsObject);
                for (let j in obj) {
                    if (sqlSeg == obj[j].sqlSeg) {
                        this.search.conditions[index].nameCode = j;
                    }
                }
                item.comparison = this.columnsObject[item.nameCode] ? this.columnsObject[item.nameCode].comparison[0] : null;
                item.value = null;
            },
            retrieve() {
                this.handleSearch();
                this.$emit('toparentevent', this.search);
            },
            handleSearch() {
                /*处理检索项为日期格式的传值 to_date('2018-05-06','yyyy-MM-dd')*/
                let conditions = this.search.conditions;
                for (let i = 0, len = conditions.length; i < len; i++) {
                    let sqlSeg = conditions[i].sqlSeg, obj = $.extend({}, this.columnsObject);
                    for (let j in obj) {
                        if (sqlSeg == obj[j].sqlSeg && obj[j].component == 'date') {
                            if (conditions[i].value && conditions[i].value.indexOf('to_date(') == -1) {
                                conditions[i].value = 'to_date(\'' + conditions[i].value + '\',\'' + obj[j].dateFormat + '\')';
                            }
                        }
                    }
                }
            },
            getOptions(url) {
                //debugger;
                /*检索项类型为下拉框时，获取数据源*/
                var options = [];
                if (url) {
                    ajaxSyncProxyRequest('get', url, null, (res) => {
                        if (res instanceof Array) {
                            options = res;
                        } else {
                            options = res.list ? res.list : res.rows;
                        }
                    });

                }
                return options
            },
            defaultChange(flag) {
                let obj = $.extend({}, this.columnsObject);
                for (let key in obj) {
                    if (obj[key]['isQueryConditionDefault'] && obj[key]['isQueryCondition']) {
                        this.search.conditions[0].sqlSeg = obj[key].sqlSeg;
                    }
                    if (!flag) {
                        if (obj[key]['isSortDefault'] && obj[key]['isSort']) {
                            this.search.sortBy = obj[key].sqlSeg;
                            this.search.order = 'desc';
                        }
                    }
                }
                this.changeRetrieveItem(this.search.conditions[0], 0);
            },
            getMarginRight() {
                let width = $(this.$refs['retrieve-td'][0]).width();
                this.marginRight1 = (width - 56 * 2 - 15) / 2 + 'px';
                this.marginRight2 = (width - 56) / 2 + 'px';
            }
        },
        mounted() {
            //debugger
            this.defaultChange();

            /*选择模板后数据回显*/
            this.columns = [].concat(this.rowsCondition);
            if (this.sortBy) {
                this.search.sortBy = this.sortBy;
            }
            if (this.order == 1) {
                this.search.order = 'desc';
            } else if (this.order == 2) {
                this.search.order = 'asc';
            }

            //console.log('dddddddddd',this.columns)
            this.insertRetrieveItem();
            this.getMarginRight();
        }
    }
</script>

<style lang="scss">
  .qb-th-normal {
    font-weight: normal;
    color: #606266;
  }

  .qb-second {
    text-align: center;
    font-size: 14px;
    color: #606266;
    margin: 10px 0;
    overflow: hidden
  }

  .qb-drop-collect ul {
    width: 112px;
  }
</style>
