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
let options=[{"code":"1","remark":"是"},{"code":"0","remark":"否"},{"code":"","remark":"全部"}];

let paramJson = [
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比应收检测费',nameCode:'qysjjc',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比应收修理费',nameCode:'qysxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比应收服务费',nameCode:'qysfwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比应收其他费',nameCode:'qysqtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比工作量',nameCode:'qysgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比强检工作量',nameCode:'qssqjgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比套数',nameCode:'qts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比套数（退）',nameCode:'qtts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比证书数量',nameCode:'qcertificateNumber',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比应收合计',nameCode:'qyshj',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比检测费',nameCode:'qjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比修理费',nameCode:'qxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比服务费',nameCode:'qfwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比其他费',nameCode:'qqts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月，同比上年

  {sqlSeg:'a.APPLIANCE_NAME',name:'应收检测费差值',nameCode:'czysjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'应收修理费差值',nameCode:'czysxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'应收服务费差值',nameCode:'czysfwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'应收其他费差值',nameCode:'czysqtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'工作量差值',nameCode:'czysgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'强检工作量差值',nameCode:'czssqjgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'套数差值',nameCode:'czts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'套数（退）差值',nameCode:'cztts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'证书数量差值',nameCode:'czcertificateNumber',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'应收合计差值',nameCode:'czyshj',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'检测费差值',nameCode:'czjjf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'修理费差值',nameCode:'czxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'服务费差值',nameCode:'czfwl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'其他费差值',nameCode:'czqtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值

  {sqlSeg:'w.detection_method',name:'是否现场',nameCode:'isScene',component:'select',options:options,comparison:'1',isQueryCondition:1},//查询条件
  {sqlSeg:'s.is_urgent',name:'是否加急',nameCode:'isUrgent',component:'select',options:options,comparison:'1',isQueryCondition:1},//查询条件
  {sqlSeg:'s.is_compulsory_verify',name:'是否强检',nameCode:'isStrongInspection',component:'select',options:options,comparison:'1',isQueryCondition:1},//查询条件
  {sqlSeg:'s.fee_status',name:'是否录费',nameCode:'sflf',component:'select',options:options,comparison:'1',isQueryCondition:1},//查询条件
  {sqlSeg:'s.is_settle_account',name:'是否结账',nameCode:'sfjz',component:'select',options:options,comparison:'1',isQueryCondition:1},//查询条件
  {sqlSeg:'c.business_group',name:'业务组',nameCode:'ywz',component:'select',comparison:'1,4',ajaxUrl:'/back/businessStaff/getBusinessGroupName',isQueryCondition:1,toRex:{code:'businessGroup',remark:'businessGroupName'}},//查询条件
  {sqlSeg:'c.business_staff',name:'业务员',nameCode:'ywy',component:'input',comparison:'0,1',isQueryCondition:1,isTableDefault:1},//查询条件
  {sqlSeg:'c.company_name',name:'客户名称',nameCode:'companyName',component:'input',comparison:'0,1',isQueryCondition:1},//查询条件
  {sqlSeg:'c.province_id',name:'行政区划',nameCode:'province',component:'select',comparison:'1,4',ajaxUrl:'/back/company/getRegion?type=0',isQueryCondition:1,toRex:{code:'provinceIds',remark:'provinceName'}},//查询条件
  {sqlSeg:'s.depart_id',name:'检测部门',nameCode:'departId',component:'select',comparison:'1,4',ajaxUrl:'/back/statistics/getDepartList',toRex:{code:'departId',remark:'departName'},isQueryCondition:1},//查询条件
];
export default paramJson


