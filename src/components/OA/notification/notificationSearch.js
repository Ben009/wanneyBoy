
/*json数据
* sqlSeg      数据库sql查询结果字段
* name        字段中文名称
* nameCode    字段英文名称
* component   组件类型 input输入框 date日期选择框  select下拉框
* comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
*                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is null", "为空"],9  ["is not null", "不为空"]
* dateFormat  component为date类型时的日期格式
* ajaxUrl     component为select类型时的数据来源
* ajaxUrl:'/back/businessStaff/getBusinessGroupName' toRex:{code:'businessGroup',remark:'businessGroupName'}
* option      component为select类型时使用的数据
* isQueryCondition 是否查询条件 1是 0否   （可不配置此字段，默认为否）
* isQueryResult  是否查询结果（在模板中进行设置）  1是 0否  （可不配置此字段，默认为否）
* isSort      是否排序字段 1是 0否    （可不配置此字段，默认为否）
*
* isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
* isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
* isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
* isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）
* isTableDefault 是否在页面上显示
* purpose
* trunc 返还时间格式
* */
/**
 * 标题     NOTICE_TITLE    noticeTitle
 * 录入人   CREATE_PERSON   createPersonName
 * 录入日期 CREATE_TIME     createTime
 * 是否发布 IS_SHOW         isShow
 * 发布范围 TYPE            type
 * 发布日期 SHOW_TIME       showTime
 * 发布人   SHOW_PERSON
 * 是否置顶 IS_TOP
 */

let paramJson = [
    {sqlSeg:'n.NOTICE_TITLE',name:'标题',nameCode:'noticeTitle',component:'input',comparison:'0,1',purpose:0,isDefault:1,isQueryCondition:1,isQueryConditionDefault:1,isSort:1,isSortDefault:1,},
    {sqlSeg:'u1.user_name',name:'录入人',nameCode:'createPersonName',component:'input',comparison:'0,1',purpose:0,isQueryCondition:1,isSort:1,},
    {sqlSeg:'trunc(n.CREATE_TIME)',name:'录入日期',nameCode:'createTime',component:'date',comparison:'1,2,3', dateFormat:'yyyy-MM-dd',purpose:0,isQueryCondition:1,isSort:1,},
    {sqlSeg:'n.IS_SHOW',name:'是否发布',nameCode:'isShow',component:'select',comparison:'1',options:[{remark:'已发布',code:1},{remark:'未发布',code:0}],purpose:0,isQueryCondition:1,isSort:1,},
    {sqlSeg:'n.TYPE',name:'发布范围',nameCode:'type',component:'select',comparison:'1',options:[{remark:'指定',code:1},{remark:'全体',code:0}],purpose:0,isQueryCondition:1,isSort:1,},
    {sqlSeg:'n.SHOW_TIME',name:'发布日期',nameCode:'showTime',component:'date',comparison:'1,2,3', dateFormat:'yyyy-MM-dd',purpose:0,isQueryCondition:1,isSort:1,isTableDefault:0,},
    {sqlSeg:'u2.user_name',name:'发布人',nameCode:'showPersonName',component:'input',comparison:'0,1',purpose:0,isQueryCondition:1,isSort:1,},
    {sqlSeg:'n.AUDITING_STATUS',name:'是否审核',nameCode:'auditingStatus',component:'select',comparison:'1',options:[{remark:'未审核',code:0},{remark:'已通过',code:1},{remark:'已退回',code:2}],isQueryCondition:1,isTableDefault:1,isSort:1},
    // {sqlSeg:'n.IS_TOP',name:'是否置顶',nameCode:'createPersonName',component:'input',comparison:'0,1',purpose:0,isQueryCondition:1,isSort:1,},
  ];
  export default paramJson
