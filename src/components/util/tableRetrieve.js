import {ajaxRequest} from './base'
import $ from 'jquery'
import TableColumnHeader from '../Table/TableColumnHeader.vue'
import Vue from 'vue'

function handleMouldBack(index,value){
  console.log(index,value,this)
  console.log(this,'handleMouldBack内的this')
    if(index==1){
      this.defaultOpen=value;
    }else if(index==2){
      this.rowsCondition=value;

    }else if(index==3){
      this.sortBy = value[0];
      this.order = value[1];
    }
}
function  handleSelectTemplate (value) {
  if(!value){
    return
  }
  let obj = this.allModules,headList=[],tempObj={};
  for(let i in obj){
    if(i==value){
      headList=obj[i];
    }
  }
  headList.forEach(v=>{
    tempObj[v]=true;
  });
  this.headObj=tempObj;
  console.log(tempObj)
}
function defaultShowAllCol () {
  let param = [].concat(this.paramJson), headObj = {};
  param.forEach(v => v.isTableDefault == 1 ? headObj[v.nameCode] = true : null);
  this.headObj = headObj;

}
function recoverRetrieve (temp) {

  /*模板信息回显高级搜索组件 模板具体内容放在json格式的content字段里*/
  !$.isEmptyObject(temp) ? this.defaultOpen = temp.isOpen == 1 ? 1 : 0 : null;
  let info = temp.content ? JSON.parse(temp.content) : {}, flag = false;
  this.moduleList = [];
  if (!$.isEmptyObject(info)) {
    for (let i in info) {
      if (i == this.templateValue) {
        flag = true;
      }
      this.moduleList.push({name: i})
    }
  }
  this.allModules = info;
  if (!this.templateValue || !flag) {
    this.templateValue = temp.isDefModule;
  }
  this.handleSelectTemplate(this.templateValue);

  if (!flag) {
    /*检索项*/
    let searchInfo = temp.findWhere ? JSON.parse(temp.findWhere) : {};
    if (!$.isEmptyObject(searchInfo)) {
      this.rowsCondition = searchInfo;
    }
    /*排序*/
    let sortInfo = temp.defOrder ? JSON.parse(temp.defOrder) : {};
    if (!$.isEmptyObject(sortInfo)) {
      this.sortBy = sortInfo[0];
      this.order = sortInfo[1];
    }
  }
}

function getModuleType(){
  let currentRouter = this.$route,
    currentType = '';
  if(currentRouter.matched && currentRouter.matched.length){
    currentRouter.matched.forEach(val => {
      if(val.path == currentRouter.path){
        currentType = val.components.default['__file']
      }
    })
  }
  let index = currentType.lastIndexOf('\\');
  currentType = currentType.substring(index+1)
  currentType = currentType.substring(-1,currentType.lastIndexOf('.'))
  return currentType
}

function getTemplate (flag) {
  /*获取到当前菜单下模板列表*/
  let type = getModuleType.call(this);
  ajaxRequest('get', 'back/settingTemplate/list', {userId: this.userId, moduleType: type, isDelete: 0}, (res) => {
    if (res.code == 200) {
      let temp = res.rows.length?res.rows[0]:{};
      recoverRetrieve.call(this,temp,flag);
    }
  })
}

function  getResultCondition(){
  this.paramJson.forEach((v)=>{
    v.isQueryResult == 1?this.resultCondition.push(v):null;
  })
}
function  renderHeader (h, {column, $index}) {
  /*表格头部自定义渲染  key值必加 隐藏列时需重新渲染头部*/
  let property = column.property,flag=false;
  this.rowsCondition.forEach(v=>{
    if(property==v.nameCode){
      flag=true;
    }
  });
  if(flag){
    let currentInfo = this.paramJson.filter((v) => {return v.nameCode == property});
    //console.log('aaaa',currentInfo,'序号',$index)
    return (
      <TableColumnHeader key={$index + property} column={column} handleSearch={this.handleSearch.bind(this)}
                         currentInfo={currentInfo}/>
    )
  }else{
    return column.label
  }

}

function getComparison (property) {
  /*通过列属性，找到当前列json配置中第一个比较项*/
  let temp = this.paramJson.filter((v) => {return v.nameCode == property})
  let comparison = temp.length > 0 ? temp[0].comparison : ''
  if (Object.prototype.toString.call(comparison) === '[object String]') {
    comparison = comparison.split(',')[0]
  } else {
    comparison = comparison[0]
  }
  return comparison
}

function getSqlSeg (property) {
  /*通过列属性，找到当前列json配置中sqlSeg信息*/
  let temp = this.paramJson.filter((v) => {return v.nameCode == property})
  let sqlSeg = temp.length > 0 ? temp[0].sqlSeg : ''
  return sqlSeg
}

function personalSetting (flag) {
  /*控制显示个性化设置的弹窗 isSetting 默认false*/
 debugger
  this.isSetting = flag;
  !flag ? getTemplate.call(this,true) : null
}

function  handleSearch (column, value) {
  /*表格头部检索回调 获取当前列检索信息回显高级搜索组件
  * comparison 默认显示第一条比较项
  * column.property 列英文名称
  * value 检索值
  * sqlSeg 列sqlSeg信息*/
  var comparison = getComparison.call(this,column.property);
  var sqlSeg = getSqlSeg.call(this,column.property);
  this.retrieveCondition=[0, column.property, comparison, value, sqlSeg];
  this.defaultOpen=1;
  //this.$refs['retrieve-wapper'].insertRetrieveItem(0, column.property, comparison, value, sqlSeg)

}
function getMounted(){
  getTemplate.call(this);
  /*处理默认展示的表格列*/
  defaultShowAllCol.call(this);
  getResultCondition.call(this);
}

/*Vue.prototype.renderHeader=function(h, { column, $index }) {
  console.log(this)
  var a = renderHeader.call(this, h, { column, $index });
  return a;
};
Vue.prototype.handleSearch=function(column, value){
  handleSearch.call(this, column, value);
};
Vue.prototype.personalSetting=function(flag){
  alert(99)
  personalSetting.call(this, flag);
};
Vue.prototype.handleMouldBack=function (index, value){
  handleMouldBack.call(this, index, value);
  this.getTableList();
};
Vue.prototype.handleSelectTemplate=function(value){
  console.log(this)
  handleSelectTemplate.call(this, value);
};
Vue.prototype.emptyCondition=function() {
  /!*清空查询项*!/
  console.log(this)
  this.$refs["retrieve-wapper"].search.conditions = [
    {
      nameCode: null,
      sqlSeg: null,
      comparison: null,
      value: null
    }
  ];
};*/
export {

  getMounted
};
