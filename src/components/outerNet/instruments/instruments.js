/* json数据
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
* */

let paramJson;
paramJson = [

    {
        sqlSeg: 'a.sbmc',
        name: '器具名称',
        nameCode: 'sbmc',
        component: 'input',
        comparison: '0,1,4,7',
        isQueryCondition: 1,
        isQueryResult: 1,
        isSort: 1,
        isQueryConditionDefault: 1,
        isSortDefault: 0,
        isTableDefault: 1,
        isSpecial: 0
    },
    {
        sqlSeg: 'a.xhgg',
        name: '型号规格',
        nameCode: 'xhgg',
        component: 'input',
        comparison: '0,1,4,7',
        isQueryCondition: 1,
        isQueryResult: 1,
        isSort: 1,
        isQueryConditionDefault: 0,
        isSortDefault: 0,
        isTableDefault: 1,
        isSpecial: 0
    },
    {
        sqlSeg: 'a.ccbh',
        name: '出厂编号',
        nameCode: 'ccbh',
        component: 'input',
        comparison: '0,1,4,7',
        isQueryCondition: 1,
        isQueryResult: 1,
        isSort: 1,
        isQueryConditionDefault: 0,
        isSortDefault: 0,
        isTableDefault: 1,
        isSpecial: 0
    },
    {
        sqlSeg: 'a.grrq',
        name: '购入日期',
        nameCode: 'grrq',
        component: 'date',
        dateFormat: 'yyyy-MM-dd',
        comparison: '1,2,3,4,5,6',
        isQueryCondition: 1,
        isQueryResult: 1,
        isSort: 1,
        isQueryConditionDefault: 0,
        isSortDefault: 0,
        isTableDefault: 1,
        isSpecial: 0
    },
    {
        sqlSeg: 'a.cqdw',
        name: '产权单位',
        nameCode: 'cqdw',
        component: 'input',
        comparison: '0,1,4,7',
        isQueryCondition: 1,
        isQueryResult: 1,
        isSort: 1,
        isQueryConditionDefault: 0,
        isSortDefault: 0,
        isTableDefault: 1,
        isSpecial: 0
    },
    {
        sqlSeg: 'a.fzlb',
        name: '管理类别',
        nameCode: 'fzlb',
        component: 'select',
        comparison: '1',
        options: [{code: '1', remark: '非强检'}, {code: '0', remark: '强检'}],
        isQueryCondition: 1,
        isQueryResult: 1,
        isSort: 1,
        isQueryConditionDefault: 0,
        isSortDefault: 0,
        isTableDefault: 1,
        isSpecial: 0
    },
    {
        sqlSeg: 'a.jdrq',
        name: '校检日期',
        nameCode: 'jdrq',
        component: 'date',
        dateFormat: 'yyyy-MM-dd',
        comparison: '1,2,3,4,5,6',
        isQueryCondition: 1,
        isQueryResult: 1,
        isSort: 1,
        isQueryConditionDefault: 0,
        isSortDefault: 0,
        isTableDefault: 1,
        isSpecial: 0
    },
    {
        sqlSeg: 'a.jdjl',
        name: '检定结论',
        nameCode: 'jdjl',
        component: 'select',
        comparison: '1',
        options: [{code: '合格', remark: '合格'}, {code: '不合格', remark: '不合格'}],
        isQueryCondition: 1,
        isQueryResult: 1,
        isSort: 1,
        isQueryConditionDefault: 0,
        isSortDefault: 0,
        isTableDefault: 1,
        isSpecial: 0
    }
];
export default paramJson
