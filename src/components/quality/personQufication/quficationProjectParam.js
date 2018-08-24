/*json数据
* sqlSeg      数据库依据查询语句
* name        字段中文名称
* nameCode    字段英文名称
* component   组件类型 input输入框 date日期选择框  select下拉框
* comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
*                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is null", "为空"],9  ["is not null", "不为空"]
* isSpecial   是否为特殊字段标识
* dateFormat  component为date类型时的日期格式
* ajaxUrl     component为select类型时的数据来源
* purpose     用途 0既是检索项也是查询结果 1仅用作检索项 2仅用作查询结果
* isDefault   未设置模板时表格默认显示的字段 1是 0否
* isSort      排序字段 1是 0否
* isSearchDefault  检索条件的默认值     boolean   默认false      判断检索项的初始化默认值 （只能设置一个默认值,如果设置多个默认取第一个）
* */

let paramJson = [
{sqlSeg:'c.PROJECT_NAME',name:'项目名称',nameCode:'projectName',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
{sqlSeg:'c.PROJECT_TYPE',name:'项目类别',nameCode:'projectType',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
{sqlSeg:'u.USER_NAME',name:'添加人',nameCode:'userName',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
{sqlSeg:'c.REMARK',name:'备注',nameCode:'remark',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.ADD_TIME',name:'添加日期',nameCode:'addTime',component: 'date', dateFormat: 'yyyy-MM-dd',comparison:'1,3',isQueryCondition:1},

];
export default paramJson

