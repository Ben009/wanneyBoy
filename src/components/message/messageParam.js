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
  {sqlSeg:'addTime',name:'创建时间',nameCode:'addTime',component:'input',comparison:'0,1,4',isSpecial:0,purpose:0,isDefault:1,isSort:1,isSearchDefault:true},
  {sqlSeg:'c.updateTime',name:'更新时间',nameCode:'updateTime',component:'input',comparison:'0,1,4',isSpecial:0,purpose:2,isDefault:1,isSort:1},
  {sqlSeg:'c.status',name:'状态',nameCode:'status',component:'input',comparison:'0,1,4',isSpecial:0,purpose:1,isDefault:1,isSort:0},
  {sqlSeg:'c.title',name:'消息标题',nameCode:'title',component:'input',comparison:'0,1,4',isSpecial:0,purpose:2,isDefault:1,isSort:1},
  {sqlSeg:'c.content',name:'消息内容',nameCode:'content',component:'input',comparison:'0,1,4',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'c.category',name:'消息类型',nameCode:'category',component:'input',comparison:'0,1,4',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'c.bussiness',name:'所属业务',nameCode:'bussiness',component:'input',comparison:'0,1,4',isSpecial:0,purpose:1,isDefault:0,isSort:1},
  {sqlSeg:'c.sourceUserId',name:'消息发起者用户Id',nameCode:'sourceUserId',component:'input',comparison:'1,2,3,5,6',isSpecial:0,purpose:0,isDefault:0,isSort:1},
  {sqlSeg:'c.TargetUserId',name:'目标用户Id',nameCode:'TargetUserId',component:'input',comparison:'1,2,3,5,6',isSpecial:0,purpose:0,isDefault:1,isSort:1},

  {sqlSeg:'c.channel',name:'消息渠道',nameCode:'channel',component:'input',comparison:'0,1,4',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'c.targetAddress',name:'目标地址（邮箱地址，手机号等）',nameCode:'targetAddress',component:'input',comparison:'1,4',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'c.memo',name:'备注',nameCode:'memo',component:'input',comparison:'1',isSpecial:0,purpose:0,isDefault:1,isSort:0},

  {sqlSeg:'c.thirdId',name:'第三方渠道Id',nameCode:'thirdId',component:'input',comparison:'1,4',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'bgqx',name:'保管期限',nameCode:'bgqx',component:'select',comparison:'1,4',isSpecial:0,purpose:0,isDefault:0,isSort:0,ajaxUrl:'back/dictEntry/list?dictTypeId=3'},

];
export default paramJson
