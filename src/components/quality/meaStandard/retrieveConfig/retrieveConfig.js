/*json数据
* sqlSeg      数据库sql查询结果字段
* name        字段中文名称
* nameCode    字段英文名称
* component   组件类型 input输入框 date日期选择框  select下拉框
* comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
*                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is null", "为空"],9  ["is not null", "不为空"]
* dateFormat  component为date类型时的日期格式
* ajaxUrl     component为select类型时的数据来源
* isQueryCondition 是否查询条件 1是 0否   （可不配置此字段，默认为否）
* isQueryResult  是否查询结果  1是 0否  （可不配置此字段，默认为否）
* isSort      是否排序字段 1是 0否    （可不配置此字段，默认为否）
*
* isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
* isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
* isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
* isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）
* */


let paramJson = [{
      sqlSeg:'m.CODE',
      name:'代码',
      nameCode:'code',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isSort:1,
   },{
      sqlSeg:'m.STANDARD_NAME',
      name:'计量标准名称',
      nameCode:'standardName',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryConditionDefault:1,
      
      isSort:1,
   },{
      sqlSeg:'m.STANDARD_CER_NO',
      name:'计量标准证书号',
      nameCode:'standardCerNo',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      
   },{
      sqlSeg:'m.SOC_CER_NO',
      name:'社会公用证书号',
      nameCode:'socCerNo',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.STANDARD_PROP',
      name:'标准性质',
      nameCode:'standardProp',
      component:'select',
      options:[{'remark':'高标','code':'0'},{'remark':'次标','code':'1'}],
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'trunc(m.STANDARD_RELEASE_DATE)',
      name:'计量标准发证日期',
      nameCode:'standardReleaseDate',
      dateFormat:'yyyy-MM-dd',
      component:'date',
      comparison:'1,2,3,4,5,6,8,9',
      isQueryCondition:1,

      
      isSort:1,
   },{
      sqlSeg:'trunc(m.STANDARD_VALID_DATE)',
      name:'计量标准有效期',
      nameCode:'standardValidDate',
      dateFormat:'yyyy-MM-dd',
      component:'date',
      comparison:'1,2,3,4,5,6,8,9',
      isQueryCondition:1,

      
      isSort:1,
      isSortDefault:1,
   },{
      sqlSeg:'trunc(m.SOC_RELEASE_DATE)',
      name:'社会公用证书发证日期',
      nameCode:'socReleaseDate',
      dateFormat:'yyyy-MM-dd',
      component:'date',
      comparison:'1,2,3,4,5,6,8,9',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'trunc(m.SOC_VALID_DATE)',
      name:'社会公用证书有效日期',
      nameCode:'socValidDate',
      component:'date',
      dateFormat:'yyyy-MM-dd',
      comparison:'1,2,3,4,5,6,8,9',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.REMARK',
      name:'备注',
      nameCode:'remark',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.DEPARTMENT',
      name:'维护部门',
      nameCode:'departmentName',
      component:'select',
      comparison:'0,1,4',
      ajaxUrl:'/njmind/findParam/departmentList',
      isQueryCondition:1,

      
      isSort:1,
   },{
      sqlSeg:'u3.USER_NAME',
      name:'负责人',
      nameCode:'responsibleUser',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,

   },{
      sqlSeg:'m.TELEPHONE',
      name:'负责人电话',
      nameCode:'telephone',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.CHIEF_EXAMINER',
      name:'主持考核单位',
      nameCode:'chiefExaminer',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.TAKE_EXAMINER',
      name:'承担考核单位',
      nameCode:'takeExaminer',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.IS_SAFEKEEPING',
      name:'是否封存',
      nameCode:'isSafekeeping',
      component:'select',
      options:[{'remark':'是','code':'1'},{'remark':'否','code':'0'}],
      comparison:'1,4',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.AUDITING_RESULT',
      name:'审核状态',
      nameCode:'auditingResult',
      component:'select',
      comparison:'1,4',
      options:[{'remark':'未审核','code':'0'},{'remark':'通过','code':'1'},{'remark':'未通过','code':'2'}],
      isQueryCondition:1,

      
   },{
      sqlSeg:'m.IS_VERB',
      name:'是否撤销',
      nameCode:'isVerb',
      component:'select',
      comparison:'1,4',
      options:[{'remark':'是','code':'1'},{'remark':'否','code':'0'}],
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.STANDARD_NAME_E',
      name:'计量标准名称（英文）',
      nameCode:'standardNameE',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.APPROVAL_AUTH',
      name:'批准机关',
      nameCode:'approvalAuth',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.TOTAL_VAL',
      name:'总价值',
      nameCode:'totalVal',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.CLASS_ACCURACY',
      name:'准确度等级',
      nameCode:'classAccuracy',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.CLASS_ACCURACY_E',
      name:'准确度等级（英文）',
      nameCode:'classAccuracyE',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.MEASURING_RANGE',
      name:'测量范围',
      nameCode:'measuringRange',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'m.MEASURING_RANGE_E',
      name:'测量范围（英文）',
      nameCode:'measuringRangeE',
      component:'input',
      comparison:'0,1',
      isQueryCondition:1,
      isQueryResult:1,
   },{
      sqlSeg:'ITEM_NAME',
      name:'开展项目',
      nameCode:'itemName',
      component:'input',
      comparison:'0',
      isQueryCondition:1,
      isSpecial:1,
}
];

export default paramJson