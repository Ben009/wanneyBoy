import {ajaxRequest} from '../components/util/base'
import $ from 'jquery'
import TableColumnHeader from '../components/Table/TableColumnHeader.vue'

export default {
  activated() {
    if(typeof this.getTableList == 'function'){
      this.getTableList()
    }
  },
  methods:{

    QJHandleMouldBack(index,value){
      if(index==1){
        this.defaultOpen=value;
      }else if(index==2){
        let arr = [];
          value.forEach(v=>{
            this.paramJson.forEach(item=>{
              if(v.nameCode==item.nameCode){
                arr.push(item);
              }
          })
        });
        this.rowsCondition=arr;

      }else if(index==3){
        this.sortBy = value[0];
        this.order = value[1];
      }
    },
    QJhandleDateSearch(){
      /*处理检索项为日期格式的传值 to_date('2018-05-06','yyyy-MM-dd')*/
      let conditions = this.$refs["retrieve-wapper"].search.conditions;
      for(let i = 0,len=conditions.length; i < len;i++){
        let sqlSeg = conditions[i].sqlSeg,obj=$.extend({},this.$refs["retrieve-wapper"].columnsObject);
        for(let j in obj){
          if(sqlSeg == obj[j].sqlSeg && obj[j].component=='date'){
            console.log(conditions[i].value)
            if(conditions[i].value && conditions[i].value.indexOf('to_date(')==-1){
              conditions[i].value='to_date(\''+conditions[i].value+'\',\''+obj[j].dateFormat+'\')';
            }
          }
        }
      }
    },
    QJAdvanceSearch() {
      this.QJhandleDateSearch();
      let data = this.$refs["retrieve-wapper"].search;
      let conditions = data.conditions,sc=[];
      [].concat(conditions).forEach(v=>{
        this.paramJson.forEach(item=>{
          if(item.nameCode==v.nameCode){
            item.isSpecial?v.isSpecial=item.isSpecial:null;
            sc.push(v);
          }
        })
      });
      this.page=1;
      this.sc = JSON.stringify(sc);
      this.orderProperty = data.sortBy;
      this.orderType = data.order;
      this.fuzzySearch = 1;
      this.getTableList();
    },
    QJHandleSelectTemplate (value) {
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
    },
    QJDefaultShowAllCol () {
      let param = [].concat(this.paramJson), headObj = {};
      param.forEach(v => v.isTableDefault == 1 ? headObj[v.nameCode] = true : null);
      this.headObj = headObj;

    },
    QJRecoverRetrieve (temp,isStart) {

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
      this.QJHandleSelectTemplate(this.templateValue);

      if (!flag) {
        /*检索项*/
        let searchInfo = temp.findWhere ? JSON.parse(temp.findWhere) : {};
        if (!$.isEmptyObject(searchInfo)) {
          let arr = [];
          searchInfo.forEach(v=>{
            this.paramJson.forEach(item=>{
              if(v.nameCode==item.nameCode){
                arr.push(item);
              }
            })
          });
          this.rowsCondition = arr;
        }
        /*排序*/
        let sortInfo = temp.defOrder ? JSON.parse(temp.defOrder) : {};
        if (!$.isEmptyObject(sortInfo)) {
          this.sortBy = sortInfo[0];
          this.order = sortInfo[1];
        }
      }
      //if(!isStart){ //第一次渲染收藏 模板切换时无影响
          let collectionInfo = temp.searchConditionCollection ? JSON.parse(temp.searchConditionCollection) : null;
          if(collectionInfo){
            this.collectionInfo = collectionInfo;
          }
          console.log(this.collectionInfo,'collectionInfocollectionInfocollectionInfo')
      //}
    },
    QJGetModuleType(){
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
    },
    QJGetTemplate (flag) {
      /*获取到当前菜单下模板列表*/
      var type = this.QJGetModuleType();
      console.log(type,'type')
      ajaxRequest('get', 'back/settingTemplate/list', {userId: window.localStorage.getItem("userId"), moduleType: type, isDelete: 0}, (res) => {
        if (res.code == 200) {
          let temp = res.rows.length?res.rows[0]:{};
          console.log(res,'搜索条件res')
          this.QJRecoverRetrieve(temp,flag);
        }
      })
    },
    QJGetResultCondition(){
      this.paramJson.forEach((v)=>{
        v.isQueryResult == 1?this.resultCondition.push(v):null;
      })
    },
    QJrenderHeader (h, {column, $index}) {
      console.log(column)
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
          <TableColumnHeader key={$index + property} column={column} handleSearch={this.QJhandleSearch.bind(this)} index={$index}
        currentInfo={currentInfo}/>
      )
      }else{
        return column.label
      }

    },
    getComparison (property) {
      /*通过列属性，找到当前列json配置中第一个比较项*/
      let temp = this.paramJson.filter((v) => {return v.nameCode == property})
      let comparison = temp.length > 0 ? temp[0].comparison : ''
      if (Object.prototype.toString.call(comparison) === '[object String]') {
        comparison = comparison.split(',')[0]
      } else {
        comparison = comparison[0]
      }
      return comparison
    },
    getSqlSeg (property) {
      /*通过列属性，找到当前列json配置中sqlSeg信息*/
      let temp = this.paramJson.filter((v) => {return v.nameCode == property})
      let sqlSeg = temp.length > 0 ? temp[0].sqlSeg : ''
      return sqlSeg
    },
    QJPersonalSetting (flag) {
      /*控制显示个性化设置的弹窗 isSetting 默认false*/

      this.isSetting = flag;
      console.log(this.isSetting,'QJPersonalSetting')
      !flag ? this.QJGetTemplate(true) : null
    },
    QJhandleSearch (column, value,index) {
      /*表格头部检索回调 获取当前列检索信息回显高级搜索组件
      * comparison 默认显示第一条比较项
      * column.property 列英文名称
      * value 检索值
      * sqlSeg 列sqlSeg信息*/
      var comparison = this.getComparison(column.property);
      var sqlSeg = this.getSqlSeg(column.property);
      this.retrieveCondition=[0, column.property, comparison, value, sqlSeg];
      this.defaultOpen=1;
      setTimeout(()=>{this.QJAdvanceSearch();},0)

      //this.$refs['retrieve-wapper'].insertRetrieveItem(0, column.property, comparison, value, sqlSeg)

    },
    QJGetMounted(){
      this.QJGetTemplate();
      /*处理默认展示的表格列*/
      this.QJDefaultShowAllCol();
      this.QJGetResultCondition();
    },
    QJEmptyCondition() {
      /*清空查询项*/
      console.log(this)
      this.$refs["retrieve-wapper"].search.conditions = [
        {
          nameCode: null,
          sqlSeg: null,
          comparison: null,
          value: null
        }
      ];
      this.$refs["retrieve-wapper"].defaultChange();
      setTimeout(()=>{this.QJAdvanceSearch();},0)
    },
    changeTextFont(name,formData){//上标下标换行斜体
      this.$store.state.myName = name;
      this.$store.state.form = formData;
    },
  }
}
