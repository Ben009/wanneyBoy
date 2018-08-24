const header = [
  [
    {
      "cname": "序号",
      "name": "order",
      "width": 30,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "order",
      "required": false
    },
    {
      "cname": "器具名称",
      "name": "applianceName",
      "width": 120,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "advancedInput",
      "ajaxChangeUrl": "back/appliance/getApplianceInfoForAutoComplete",
      "parameter": {isBjd:1},
      "required": true,
      "isMsg":true,
      "msg":"器具名称需从计量器具库中调用，不支持直接输入",
      "nextValJson":{value:'applianceActualName',index:3}
    },
    {
      "cname": "器具实际名称",
      "name": "applianceActualName",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "isMsg":true,
      "msg":"器具名称必须从计量器具库中调用 ，实际名称可自行输入",
      "nextValJson":{value:'setNumber',index:3}
    },
    {
      "cname": "检测部门",
      "name": "departId",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "检测岗位",
      "name": "postId",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "套数",
      "name": "setNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "inputNumber",
      "isHandWriting": "1",
      "required": true,
      "nextValJson":{value:'remark',index:3}
    },
    {
      "cname": "件/套",
      "name": "pieceNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "inputNumber",
      "isHandWriting": "1",
      "required": true,
      "isMsg":true,
      "msg":"通常为1，但比如为砝码时，表示几个小砝码的数量"
    },
    {
      "cname": "证书数量",
      "name": "certificateNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "certificateNumber",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "检测期限",
      "name": "detectionDeadline",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "date",
      "dom": "date",
      "required": true
    },
    {
      "cname": "服务类型",
      "name": "certificateType",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "certificateType",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "是否加急",
      "name": "urgentDayPercent",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "urgentDays",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "分包区域",
      "name": "subcontractArea",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "subcontractAreas",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false,
      "isMsg":true,
      "msg":"选择分包区域后，系统自动将证书数量设为0"
    },
    {
      "cname": "是否强检",
      "name": "isCompulsoryVerify",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "checkbox",
      "required": false
    },
    {
      "cname": "操作",
      "name": "order13",
      "width": 30,
      "rowspan": 2,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "none",
      "required": false
    }
  ],
  [
    {
      "cname": "备注",
      "name": "remark",
      "width": 20,
      "rowspan": 1,
      "colspan": 2,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'model',index:3}
    },
    {
      "cname": "型号规格",
      "name": "model",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'factoryNo',index:3}
    },
    {
      "cname": "出厂编号",
      "name": "factoryNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'equipmentNo',index:3}
    },
    {
      "cname": "设备编号",
      "name": "equipmentNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'manufacturer',index:3}
    },
    {
      "cname": "制造厂商",
      "name": "manufacturer",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'detectionParameter',index:3}
    },
    {
      "cname": "检测参数",
      "name": "detectionParameter",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'accessory',index:3}
    },
    {
      "cname": "器具附件",
      "name": "accessory",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'appearance',index:3}
    },
    {
      "cname": "器具外观",
      "name": "appearance",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'companyName',index:4}
    },
    {
      "cname": "是否双编号",
      "name": "isDoubleNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "checkbox",
      "isHandWriting": "1",
      "required": false,
      "isMsg":true,
      "msg":"表示该登记号需出具出厂编号与设备编号两个编号"
    },
    {
      "cname": "是否调修",
      "name": "isRepair",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "isRepair",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "电源类型",
      "name": "powerTypes",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "powerTypes",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "器具用途",
      "name": "applianceUse",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "applianceUse",
      "type": "text",
      "dom": "select",
      "required": false
    }
  ]
];

const headerCallback = [
  [
    {
      "cname": "登记号",
      "name": "registrationNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "advancedChecbox",
      "required": false,

    },
    {
      "cname": "器具名称",
      "name": "applianceName",
      "width": 120,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "span",
      "parameter": {},
      "required": true,
      "isMsg":true,
      "msg":"器具名称需从计量器具库中调用，不支持直接输入",
      "nextValJson":{value:'applianceActualName',index:3}
    },
    {
      "cname": "器具实际名称",
      "name": "applianceActualName",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "isMsg":true,
      "msg":"器具名称必须从计量器具库中调用 ，实际名称可自行输入",
      "nextValJson":{value:'setNumber',index:3}
    },
    {
      "cname": "检测部门",
      "name": "departId",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "检测岗位",
      "name": "postId",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "套数",
      "name": "setNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "inputNumber",
      "isHandWriting": "1",
      "required": true,
      "nextValJson":{value:'remark',index:3}
    },
    {
      "cname": "件/套",
      "name": "pieceNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "inputNumber",
      "isHandWriting": "1",
      "required": true,
      "isMsg":true,
      "msg":"通常为1，但比如为砝码时，表示几个小砝码的数量"
    },
    {
      "cname": "证书数量",
      "name": "certificateNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "span",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "检测期限",
      "name": "detectionDeadline",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "date",
      "dom": "date",
      "required": true
    },
    {
      "cname": "服务类型",
      "name": "certificateType",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "certificateType",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "是否加急",
      "name": "urgentDayPercent",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "urgentDays",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "分包区域",
      "name": "subcontractArea",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "subcontractAreas",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false,
      "isMsg":true,
      "msg":"选择分包区域后，系统自动将证书数量设为0"
    },
    {
      "cname": "是否强检",
      "name": "isCompulsoryVerify",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "checkbox",
      "required": false
    },
  ],
  [
    {
      "cname": "备注",
      "name": "remark",
      "width": 20,
      "rowspan": 1,
      "colspan": 2,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'model',index:3}
    },
    {
      "cname": "型号规格",
      "name": "model",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'factoryNo',index:3}
    },
    {
      "cname": "出厂编号",
      "name": "factoryNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'equipmentNo',index:3}
    },
    {
      "cname": "设备编号",
      "name": "equipmentNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'manufacturer',index:3}
    },
    {
      "cname": "制造厂商",
      "name": "manufacturer",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'detectionParameter',index:3}
    },
    {
      "cname": "检测参数",
      "name": "detectionParameter",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'accessory',index:3}
    },
    {
      "cname": "器具附件",
      "name": "accessory",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'appearance',index:3}
    },
    {
      "cname": "器具外观",
      "name": "appearance",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'companyName',index:4}
    },
    {
      "cname": "是否双编号",
      "name": "isDoubleNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "checkbox",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "是否调修",
      "name": "isRepair",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "isRepair",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "电源类型",
      "name": "powerTypes",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "powerTypes",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "器具用途",
      "name": "applianceUse",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "applianceUse",
      "type": "text",
      "dom": "select",
      "required": false
    }
  ]
];
const headerSelfCheck = [
  [
    {
      "cname": "序号",
      "name": "order",
      "width": 30,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "order",
      "required": false
    },
    {
      "cname": "器具名称",
      "name": "applianceName",
      "width": 120,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "advancedInput",
      "ajaxChangeUrl": "back/appliance/getApplianceInfoForAutoComplete",
      "parameter": {isBjd:1},
      "required": true,
      "isMsg":true,
      "msg":"器具名称需从计量器具库中调用，不支持直接输入",
      "nextValJson":{value:'applianceActualName',index:3}
    },
    {
      "cname": "器具实际名称",
      "name": "applianceActualName",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "isMsg":true,
      "msg":"器具名称必须从计量器具库中调用 ，实际名称可自行输入",
      "nextValJson":{value:'setNumber',index:3}
    },
    {
      "cname": "检测部门",
      "name": "departId",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "检测岗位",
      "name": "postId",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "套数",
      "name": "setNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "inputNumber",
      "isHandWriting": "1",
      "required": true,
      "nextValJson":{value:'remark',index:3}
    },
    {
      "cname": "件/套",
      "name": "pieceNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "inputNumber",
      "isHandWriting": "1",
      "required": true,
      "isMsg":true,
      "msg":"通常为1，但比如为砝码时，表示几个小砝码的数量"
    },
    {
      "cname": "证书数量",
      "name": "certificateNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "certificateNumber",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "证书日期",
      "name": "certificatePrintTime",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "date",
      "dom": "date",
      "required": false,
      "isMsg":true,
      "msg":"客户要求出具证书的校检日期"
    },
    {
      "cname": "检测期限",
      "name": "detectionDeadline",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "date",
      "dom": "date",
      "required": true
    },
    {
      "cname": "服务类型",
      "name": "certificateType",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "certificateType",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "是否加急",
      "name": "urgentDayPercent",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "urgentDays",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "分包区域",
      "name": "subcontractArea",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "subcontractAreas",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false,
      "isMsg":true,
      "msg":"选择分包区域后，系统自动将证书数量设为0"
    },
    {
      "cname": "是否强检",
      "name": "isCompulsoryVerify",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "checkbox",
      "required": false
    },
    {
      "cname": "操作",
      "name": "order13",
      "width": 30,
      "rowspan": 2,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "none",
      "required": false
    }
  ],
  [
    {
      "cname": "备注",
      "name": "remark",
      "width": 20,
      "rowspan": 1,
      "colspan": 2,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'model',index:3}
    },
    {
      "cname": "型号规格",
      "name": "model",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'factoryNo',index:3}
    },
    {
      "cname": "出厂编号",
      "name": "factoryNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'equipmentNo',index:3}
    },
    {
      "cname": "设备编号",
      "name": "equipmentNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'manufacturer',index:3}
    },
    {
      "cname": "制造厂商",
      "name": "manufacturer",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'detectionParameter',index:3}
    },
    {
      "cname": "检测参数",
      "name": "detectionParameter",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'accessory',index:3}
    },
    {
      "cname": "器具附件",
      "name": "accessory",
      "width": 80,
      "rowspan": 1,
      "colspan": 2,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'appearance',index:3}
    },
    {
      "cname": "器具外观",
      "name": "appearance",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'companyName',index:4}
    },
    {
      "cname": "是否双编号",
      "name": "isDoubleNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "checkbox",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "是否调修",
      "name": "isRepair",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "isRepair",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "电源类型",
      "name": "powerTypes",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "powerTypes",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "器具用途",
      "name": "applianceUse",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "applianceUse",
      "type": "text",
      "dom": "select",
      "required": false
    }
  ]
];
const headerSelfCheckCallback = [
  [
    {
      "cname": "登记号",
      "name": "registrationNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "span",
      "required": false
    },
    {
      "cname": "器具名称",
      "name": "applianceName",
      "width": 120,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "span",
      "parameter": {},
      "required": true,
      "isMsg":true,
      "msg":"器具名称需从计量器具库中调用，不支持直接输入",
      "nextValJson":{value:'applianceActualName',index:3}
    },
    {
      "cname": "器具实际名称",
      "name": "applianceActualName",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "isMsg":true,
      "msg":"器具名称必须从计量器具库中调用 ，实际名称可自行输入",
      "nextValJson":{value:'setNumber',index:3}
    },
    {
      "cname": "检测部门",
      "name": "departId",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "检测岗位",
      "name": "postId",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "套数",
      "name": "setNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "inputNumber",
      "isHandWriting": "1",
      "required": true,
      "nextValJson":{value:'remark',index:3}
    },
    {
      "cname": "件/套",
      "name": "pieceNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "inputNumber",
      "isHandWriting": "1",
      "required": true,
      "isMsg":true,
      "msg":"通常为1，但比如为砝码时，表示几个小砝码的数量"
    },
    {
      "cname": "证书数量",
      "name": "certificateNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "number",
      "dom": "span",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "证书日期",
      "name": "certificatePrintTime",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "date",
      "dom": "date",
      "required": false
    },
    {
      "cname": "检测期限",
      "name": "detectionDeadline",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "date",
      "dom": "date",
      "required": true
    },
    {
      "cname": "服务类型",
      "name": "certificateType",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "certificateType",
      "type": "text",
      "dom": "select",
      "required": true
    },
    {
      "cname": "是否加急",
      "name": "urgentDayPercent",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "urgentDays",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "分包区域",
      "name": "subcontractArea",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "subcontractAreas",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false,
      "isMsg":true,
      "msg":"选择分包区域后，系统自动将证书数量设为0"
    },
    {
      "cname": "是否强检",
      "name": "isCompulsoryVerify",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "checkbox",
      "required": false
    },
  ],
  [
    {
      "cname": "备注",
      "name": "remark",
      "width": 20,
      "rowspan": 1,
      "colspan": 2,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'model',index:3}
    },
    {
      "cname": "型号规格",
      "name": "model",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'factoryNo',index:3}
    },
    {
      "cname": "出厂编号",
      "name": "factoryNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'equipmentNo',index:3}
    },
    {
      "cname": "设备编号",
      "name": "equipmentNo",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'manufacturer',index:3}
    },
    {
      "cname": "制造厂商",
      "name": "manufacturer",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'detectionParameter',index:3}
    },
    {
      "cname": "检测参数",
      "name": "detectionParameter",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "required": false,
      "nextValJson":{value:'accessory',index:3}
    },
    {
      "cname": "器具附件",
      "name": "accessory",
      "width": 80,
      "rowspan": 1,
      "colspan": 2,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'appearance',index:3}
    },
    {
      "cname": "器具外观",
      "name": "appearance",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "input",
      "isHandWriting": "1",
      "required": false,
      "nextValJson":{value:'companyName',index:4}
    },
    {
      "cname": "是否双编号",
      "name": "isDoubleNumber",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "",
      "type": "text",
      "dom": "checkbox",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "是否调修",
      "name": "isRepair",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "isRepair",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "电源类型",
      "name": "powerTypes",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "powerTypes",
      "type": "text",
      "dom": "select",
      "isHandWriting": "1",
      "required": false
    },
    {
      "cname": "器具用途",
      "name": "applianceUse",
      "width": 80,
      "rowspan": 1,
      "colspan": 1,
      "code": "applianceUse",
      "type": "text",
      "dom": "select",
      "required": false
    }
  ]
];

const defaultList = [
  {
    setNumber: 1,
    pieceNumber: 1,
    certificateNumber: 1,
    certificateType: "检定",
    urgentDayPercent: "0@@0",
    subcontractArea: "0",
    isRepair: "0",
    powerTypes: "0"
  }
];


/* batchInfo 批量设置的信息
/* nameCode: 表格对应返回字段名
* title: 字段显示名称
* component: select下拉框 input输入框
* code: 下拉框字段的数据字典的code值
* */
const batchInfo = [
  {nameCode: 'certificateType', title: '服务类型', component: 'select', code: 'certificateType'},
  {nameCode: 'applianceUse', title: '器具用途', component: 'select', code: 'applianceUse'},
  {nameCode: 'remark', title: '备注', component: 'input'},
];

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

export {header, headerCallback,headerSelfCheck,headerSelfCheckCallback, defaultList, batchInfo, columnsInfo}