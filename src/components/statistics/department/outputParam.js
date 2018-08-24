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
  {sqlSeg:'f.jdf',name:'应收检测费',nameCode:'ysjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期
  {sqlSeg:'f.xlf',name:'应收修理费',nameCode:'ysxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期
  {sqlSeg:'f.fwf',name:'应收服务费',nameCode:'ysfwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期
  {sqlSeg:'f.qtf',name:'应收其他费',nameCode:'ysqtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期
  {sqlSeg:'f.workload',name:'工作量',nameCode:'ssgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期
  {sqlSeg:'f.intensive_workload',name:'强检工作量',nameCode:'ysqjgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期
  {sqlSeg:'f.jdf_actual',name:'检测费',nameCode:'ssjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期
  {sqlSeg:'f.xlf_actual',name:'修理费',nameCode:'ssxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期
  {sqlSeg:'f.fwf_actual',name:'服务费',nameCode:'ssfwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期
  {sqlSeg:'f.qtf_actual',name:'其他费',nameCode:'ssqtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//当期

  {sqlSeg:'f.jdf',name:'对比应收检测费',nameCode:'qysjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'f.xlf',name:'对比应收修理费',nameCode:'qysxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'f.fwf',name:'对比应收服务费',nameCode:'qysfwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'f.qtf',name:'对比应收其他费',nameCode:'qysqtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'f.workload',name:'对比工作量',nameCode:'qssgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'f.intensive_workload',name:'对比强检工作量',nameCode:'qysqjgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'s.set_number',name:'对比套数',nameCode:'qsszts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'s.return_number',name:'对比套数（退）',nameCode:'qsstts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'f.jdf_actual',name:'对比检测费',nameCode:'qssjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'f.xlf_actual',name:'对比修理费',nameCode:'qssxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'f.fwf_actual',name:'对比服务费',nameCode:'qssfwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年
  {sqlSeg:'f.qtf_actual',name:'对比其他费',nameCode:'qssqtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//环比上月,同比上年

  {sqlSeg:'f.jdf',name:'应收检测费差值',nameCode:'czysjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'f.xlf',name:'应收修理费差值',nameCode:'czysxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'f.fwf',name:'应收服务费差值',nameCode:'czysfwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'f.qtf',name:'应收其他费差值',nameCode:'czysqtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'s.set_number',name:'套数差值',nameCode:'czsszts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'s.return_number',name:'套数（退）差值',nameCode:'czsstts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'f.jdf_actual',name:'检测费差值',nameCode:'czssjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'f.fwf_actual',name:'修理费差值',nameCode:'czssqtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'f.fwf_actual',name:'服务费差值',nameCode:'czssfwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'f.qtf_actual',name:'其他费差值',nameCode:'czssxlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值


];
export default paramJson


