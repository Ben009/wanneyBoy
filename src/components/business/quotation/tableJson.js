/*
* header 表格头部信息 分为两个数组
* cname:表格字段显示
* name: 表格对应的返回字段
* rowspan: 单元格占几行
* colspan: 单元格占几列
* width: 单元格宽度
* code: 若下拉框是数据字典维护，传code值
* type: 输入框类型 text文本 number数值
* dom: order 排序 advancedInput远程搜索 input输入框 select下拉框 checbox多选框
* ajaxChangeUrl 远程搜索的url
* parameter  远程搜索可另加参数 Object类型
*
*
* defaultList Array 默认数据
*
* */

const header = [
  [
    {
      'cname': '序号',
      'name': 'order',
      'width': 30,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'text',
      'dom': 'order',
      'required': false
    },
    {
      'cname': '器具名称',
      'name': 'applianceName',
      'width': 120,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'text',
      'dom': 'advancedInput',
      "ajaxChangeUrl": "back/appliance/getApplianceInfoForAutoComplete",
      'parameter': {},
      'required': true
    },
    {
      'cname': '器具实际名称',
      'name': 'applianceActualName',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'text',
      'dom': 'input',
      'required': false
    },
    {
      'cname': '服务类型',
      'name': 'certificateType',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': 'certificateType',
      'type': 'text',
      'dom': 'select',
      'required': true
    },
    {
      'cname': '套数',
      'name': 'setNumber',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'number',
      'dom': 'inputNumber',
      'required': true,
      'isHandWriting': '1'
    },
    {
      'cname': '件/套数',
      'name': 'pieceNumber',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'number',
      'dom': 'inputNumber',
      'required': true,
      'isHandWriting': '1'
    },
    {
      'cname': '证书数量',
      'name': 'certificateNumber',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'number',
      'dom': 'certificateNumber',
      'required': true,
      'isHandWriting': '1'
    },
    {
      'cname': '单价',
      'name': 'unitPrice',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'number',
      'dom': 'inputNumber',
      'required': true,
      'disabled': true
    },
    {
      'cname': '单位',
      'name': 'applianceUnit',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': 'applianceUnit',
      'type': 'text',
      'dom': 'input',
      'required': true,
      'isHandWriting': '1'
    },
    {
      'cname': '折后单价',
      'name': 'afterDiscountPrice',
      'width': 100,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'number',
      'dom': 'inputNumber',
      'required': true
    },
    {
      'cname': '检测费',
      'name': 'afterDiscountTotal',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'number',
      'dom': 'inputNumber',
      'required': true,
      'disabled': true
    },
    {
      'cname': '检测部门',
      'name': 'departId',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'text',
      'dom': 'select',
      'required': true
    },
    {
      'cname': '岗位',
      'name': 'postId',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'text',
      'dom': 'select',
      'required': true
    },
    {
      'cname': '操作',
      'name': 'order13',
      'width': 30,
      'rowspan': 2,
      'colspan': 1,
      'code': '',
      'type': 'text',
      'dom': 'none',
      'required': false
    }
  ],
  [
    {
      'cname': '规格型号',
      'name': 'model',
      'width': 80,
      'rowspan': 1,
      'colspan': 2,
      'code': '',
      'type': 'text',
      'dom': 'input',
      'required': false
    },
    {
      'cname': '测量范围',
      'name': 'measureRange',
      'width': 80,
      'rowspan': 1,
      'colspan': 2,
      'code': '',
      'type': 'text',
      'dom': 'input',
      'required': false
    },
    {
      'cname': '设备编号',
      'name': 'equipmentNo',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'text',
      'dom': 'input',
      'required': false
    },
    {
      'cname': '出厂编号',
      'name': 'factoryNo',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'text',
      'dom': 'input',
      'required': false
    },
    {
      'cname': '制造厂商',
      'name': 'manufacturer',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': '',
      'type': 'text',
      'dom': 'input',
      'required': false
    },
    {
      'cname': '检测参数',
      'name': 'detectionParameter',
      'width': 80,
      'rowspan': 1,
      'colspan': 2,
      'code': '',
      'type': 'text',
      'dom': 'input',
      'required': false
    },
    {
      'cname': '备注',
      'name': 'remark',
      'width': 80,
      'rowspan': 1,
      'colspan': 2,
      'code': '',
      'type': 'text',
      'dom': 'input',
      'required': false
    },
    {
      'cname': '分包区域',
      'name': 'subcontractArea',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': 'subcontractAreas',
      'type': 'text',
      'dom': 'select',
      "isHandWriting": "1",
      'required': false
    },
    {
      'cname': '检测方式',
      'name': 'detectionMethod',
      'width': 80,
      'rowspan': 1,
      'colspan': 1,
      'code': 'detectionMethod',
      'type': 'text',
      'dom': 'select',
      'required': true
    }
  ]
]

const defaultList = [
  {
    setNumber: 1,
    pieceNumber: 1,
    certificateNumber: 1,
    applianceUnit: '件' ,
    subcontractArea: '0' ,
    certificateType: "现场",
    detectionMethod: "0",
  }
]
/* batchInfo 批量设置的信息
/* nameCode: 表格对应返回字段名
* title: 字段显示名称
* component: select下拉框 input输入框
* code: 下拉框字段的数据字典的code值
* */
const batchInfo = [
  {nameCode: 'certificateType', title: '服务类型', component: 'select', code: 'certificateType'},
  {nameCode: 'remark', title: '备注', component: 'input'}
]

/* columnsInfo
/* moreInfo: Array 更多的弹窗表格信息
*  nameCode: 表格对应返回字段名
*  title: 字段显示名称
*  head:头信息
* */
const columnsInfo = {
  moreInfo: [
    {nameCode: 'applianceName', title: '器具名称', head: 'A:',width: 200},
    {nameCode: 'detectionFee', title: '收费标准', head: 'J:',width: 50},
    {nameCode: 'departName', title: '检测部门', head: 'B:',width: 150},
    {nameCode: 'certificateType', title: '服务类型', head: 'F:',width: 100},
    {nameCode: 'model', title: '型号规格', head: 'X:',width: 150},
    {nameCode: 'measureRange', title: '测量范围', head: 'C:',width: 150},
  ]
};
export { header, defaultList, batchInfo, columnsInfo}
