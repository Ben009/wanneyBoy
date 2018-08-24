import { ajaxRequest } from '@/components/util/base';
import Cookies from 'js-cookie';
import router from '@/router'; // 路由控制
import Vue from 'vue';
/**
 * TODO 案例 VUEX  注意  全局变量创建时 const 名称不要和其他的vuex存储对象一样
 * 因为最终全局调用，都需要在  store/index.js 进行申明
 */
//菜单性能优化
const URLS = {
  "500": { "component": () => import("@/components/certificate/certificate/certificateAdd/certificateAdd.vue"), "url": "http://certificate.html?url=certificate/certificate/certificateAdd/certificateAdd", "name": "/证书/记录/证书添加/证书添加" },
  "711": { "component": () => import("@/components/certificate/originalLog/originalLogAdd/originalLogAdd.vue"), "url": "http://certificate.html?url=certificate/originalLog/originalLogAdd/originalLogAdd.vue", "name": "/证书/记录/记录添加/记录添加" },
  "721": { "component": () => import("@/components/certificate/originalLog/originalLogAuditJdy/originalLogAuditJdy.vue"), "url": "http://certificate.html?url=certificate/originalLog/originalLogAuditJdy/originalLogAuditJdy.vue", "name": "/证书/记录/记录审核/记录检定" },
  "722": { "component": () => import("@/components/certificate/originalLog/originalLogAuditHyy/originalLogAuditHyy.vue"), "url": "http://certificate.html?url=certificate/originalLog/originalLogAuditHyy/originalLogAuditHyy.vue", "name": "/证书/记录/记录审核/记录核验" },
  "726": { "component": () => import("@/components/certificate/originalLog/originalLogUploadCertificate/originalLogUploadCertificate.vue"), "url": "http://certificate.html?url=certificate/originalLog/originalLogUploadCertificate/originalLogUploadCertificate.vue", "name": "/证书/记录/记录审核/记录核验" },
  "411": { "component": () => import("@/components/Level3Router.vue"), "url": "Level3Router", "name": "/业务管理/流程/流程查询" },
  "541": { "component": () => import("@/components/Level3Router.vue"), "url": "Level3Router", "name": "/业务管理/流程/异常审核" },
  "439": { "component": () => import("@/components/Level3Router.vue"), "url": "Level3Router", "name": "/基础数据/其它参数/强检目录" },
  "657": { "component": () => import("@/components/OA/notification/messageGroup.vue"), "url": "OA/notification/messageGroup", "name": "/基础数据/其它参数/用户分组" },
  "581": { "component": () => import("@/components/OA/notification/messageGroup.vue"), "url": "OA/notification/messageGroup", "name": "/OA系统/通知通告/收件组" },
  "577": { "component": () => import("@/components/OA/notification/notificationEdit.vue"), "url": "OA/notification/notificationEdit", "name": "/OA系统/通知通告/起草" },
  "578": { "component": () => import("@/components/OA/notification/notificationSearch.vue"), "url": "OA/notification/notificationSearch", "name": "/OA系统/通知通告/查询" },
  "443": { "component": () => import("@/components/Table/html_demo.vue"), "url": "Table/html_demo", "name": "/系统管理/案例模块/html_demo" },
  "168": { "component": () => import("@/components/Table/tableDemo.vue"), "url": "Table/tableDemo", "name": "/系统管理/案例模块/扩展表格" },
  "162": { "component": () => import("@/components/Table/uploadDemo.vue"), "url": "Table/uploadDemo", "name": "/系统管理/案例模块/上传附件" },
  "143": { "component": () => import("@/components/base/account/accountList.vue"), "url": "base/account/accountList", "name": "/基础数据/其它参数/账号维护" },
  "444": { "component": () => import("@/components/base/appliance/applianceForm.vue"), "url": "base/appliance/applianceForm", "name": "/基础数据/计量器具/新增" },
  "64": { "component": () => import("@/components/base/appliance/applianceList.vue"), "url": "base/appliance/applianceList", "name": "/基础数据/计量器具/查询" },
  "458": { "component": () => import("@/components/base/appliance/applianceStopList.vue"), "url": "base/appliance/applianceStopList", "name": "/基础数据/计量器具/暂停器具查询" },
  "102": { "component": () => import("@/components/base/appliance/categoryList.vue"), "url": "base/appliance/categoryList", "name": "/基础数据/计量器具/器具类别" },
  "61": { "component": () => import("@/components/base/company/businessGroupList.vue"), "url": "base/company/businessGroupList", "name": "/基础数据/委托单位/业务组" },
  "65": { "component": () => import("@/components/base/company/businessStaffList.vue"), "url": "base/company/businessStaffList", "name": "/基础数据/委托单位/业务员" },
  "151": { "component": () => import("@/components/base/company/companyAuditList.vue"), "url": "base/company/companyAuditList", "name": "/基础数据/委托单位/已审核单位查询" },
  "469": { "component": () => import("@/components/base/company/companyContent.vue"), "url": "base/company/companyContent", "name": "/基础数据/委托单位/新增" },
  "50": { "component": () => import("@/components/base/company/companyList.vue"), "url": "base/company/companyList", "name": "/基础数据/委托单位/查询" },
  "487": { "component": () => import("@/components/base/company/companyUnaudit.vue"), "url": "base/company/companyUnaudit", "name": "/基础数据/委托单位/单位审核" },
  "152": { "component": () => import("@/components/base/company/companyUnusedList.vue"), "url": "base/company/companyUnusedList", "name": "/基础数据/委托单位/未使用单位查询" },
  "136": { "component": () => import("@/components/base/company/companyVisitList.vue"), "url": "base/company/companyVisitList", "name": "/基础数据/委托单位/回访/拜访查询" },
  "150": { "component": () => import("@/components/base/company/priceAuditList.vue"), "url": "base/company/priceAuditList", "name": "/基础数据/委托单位/特殊价格查询" },
  "142": { "component": () => import("@/components/base/conclusion/conclusionList.vue"), "url": "base/conclusion/conclusionList", "name": "/基础数据/其它参数/结论用语" },
  "101": { "component": () => import("@/components/base/departPost/DepartTable.vue"), "url": "base/departPost/DepartTable", "name": "/基础数据/部门岗位" },
  "46": { "component": () => import("@/components/base/dict/DictTreeTable.vue"), "url": "base/dict/DictTreeTable", "name": "/基础数据/数据字典" },
  "219": { "component": () => import("@/components/base/division/divisionList.vue"), "url": "base/division/divisionList", "name": "/基础数据/委托单位/行政区划" },
  "430": { "component": () => import("@/components/base/forceCatalog/ForceCatalogItemList.vue"), "url": "base/forceCatalog/ForceCatalogItemList", "name": "/基础数据/其它参数/强检目录/项别维护" },
  "431": { "component": () => import("@/components/base/forceCatalog/ForceCatalogKindList.vue"), "url": "base/forceCatalog/ForceCatalogKindList", "name": "/基础数据/其它参数/强检目录/种别维护" },
  "201": { "component": () => import("@/components/base/module/ModuleTable.vue"), "url": "base/module/ModuleTable", "name": "/系统管理/菜单管理" },
  "122": { "component": () => import("@/components/base/parameter/parameterTable.vue"), "url": "base/parameter/parameterTable", "name": "/系统管理/系统参数" },
  "120": { "component": () => import("@/components/base/role/RoleTable.vue"), "url": "base/role/RoleTable", "name": "/基础数据/角色管理" },
  "44": { "component": () => import("@/components/base/user/UserTable.vue"), "url": "base/user/UserTable", "name": "/基础数据/用户管理" },
  "485": { "component": () => import("@/components/business/charge/chargeBatchUpdate.vue"), "url": "business/charge/chargeBatchUpdate", "name": "/财务管理/费用/费用批量修改" },
  "166": { "component": () => import("@/components/business/charge/chargeList.vue"), "url": "business/charge/chargeList", "name": "/财务管理/费用/费用查询" },
  "165": { "component": () => import("@/components/business/charge/toChargeAdd.vue"), "url": "business/charge/toChargeAdd", "name": "/财务管理/费用/费用录入" },
  "377": { "component": () => import("@/components/business/contract/ContractAudit.vue"), "url": "business/contract/ContractAudit", "name": "/市场管理/合同管理/合同审核" },
  "372": { "component": () => import("@/components/business/contract/ContractList.vue"), "url": "business/contract/ContractList", "name": "/市场管理/合同管理/查询" },
  "266": { "component": () => import("@/components/business/entrust/EntrustQuery.vue"), "url": "business/entrust/EntrustQuery", "name": "/业务管理/委托/受理查询" },
  "169": { "component": () => import("@/components/business/entrust/EntrustWtdForm.vue"), "url": "business/entrust/EntrustWtdForm", "name": "/业务管理/委托/业务受理" },
  "401": { "component": () => import("@/components/business/entrust/EntrustXcDh.vue"), "url": "business/entrust/EntrustXcDh", "name": "/业务管理/委托/带回配号" },
  "399": { "component": () => import("@/components/business/entrust/EntrustXcYh.vue"), "url": "business/entrust/EntrustXcYh", "name": "/业务管理/委托/现场要号" },
  "402": { "component": () => import("@/components/business/entrust/EntrustZj.vue"), "url": "business/entrust/EntrustZj", "name": "/业务管理/委托/自检要号" },
  "413": { "component": () => import("@/components/business/entrust/operatingLayer.vue"), "url": "business/entrust/operatingLayer", "name": "/业务管理/委托/操作痕迹" },
  "145": { "component": () => import("@/components/business/plan/PlanArrange.vue"), "url": "business/plan/PlanArrange", "name": "/业务管理/现场任务/任务安排" },
  "140": { "component": () => import("@/components/business/plan/PlanTable.vue"), "url": "business/plan/PlanTable", "name": "/业务管理/现场任务/录入" },
  "318": { "component": () => import("@/components/business/plan/abnormalTask.vue"), "url": "business/plan/abnormalTask", "name": "/业务管理/现场任务/异常任务" },
  "365": { "component": () => import("@/components/business/plan/businessStaffPlan.vue"), "url": "business/plan/businessStaffPlan", "name": "/业务管理/现场任务/现场任务（业务员）" },
  "148": { "component": () => import("@/components/business/plan/inspectionTableList.vue"), "url": "business/plan/inspectionTableList", "name": "/业务管理/现场任务/送检查询" },
  "351": { "component": () => import("@/components/business/plan/inspectorPlan.vue"), "url": "business/plan/inspectorPlan", "name": "/业务管理/现场任务/现场任务（工程师）" },
  "362": { "component": () => import("@/components/business/plan/leaderPlan.vue"), "url": "business/plan/leaderPlan", "name": "/业务管理/现场任务/现场任务（带队人）" },
  "144": { "component": () => import("@/components/business/plan/planArrangeDis.vue"), "url": "business/plan/planArrangeDis", "name": "/业务管理/现场任务/任务分配" },
  "147": { "component": () => import("@/components/business/plan/planOverview.vue"), "url": "business/plan/planOverview", "name": "/业务管理/现场任务/任务总览" },
  "146": { "component": () => import("@/components/business/plan/planTableList.vue"), "url": "business/plan/planTableList", "name": "/业务管理/现场任务/查询" },
  "484": { "component": () => import("@/components/business/plan/staffWhereabouts.vue"), "url": "business/plan/staffWhereabouts", "name": "/业务管理/现场任务/人员去向" },
  "410": { "component": () => import("@/components/business/procedure/abnormalList/abnormalAduitList.vue"), "url": "business/procedure/abnormalList/abnormalAduitList", "name": "/业务管理/流程/异常一、二审" },
  "542": { "component": () => import("@/components/business/procedure/abnormalList/abnormalAduitListOne.vue"), "url": "business/procedure/abnormalList/abnormalAduitListOne", "name": "/业务管理/流程/异常审核/异常一审" },
  "622": { "component": () => import("@/components/business/procedure/abnormalList/abnormalAduitListOne.vue"), "url": "business/procedure/abnormalList/abnormalAduitListOne", "name": "/业务管理/流程/异常一审" },
  "623": { "component": () => import("@/components/business/procedure/abnormalList/abnormalAduitListTwo.vue"), "url": "business/procedure/abnormalList/abnormalAduitListTwo", "name": "/业务管理/流程/异常二审" },
  "543": { "component": () => import("@/components/business/procedure/abnormalList/abnormalAduitListTwo.vue"), "url": "business/procedure/abnormalList/abnormalAduitListTwo", "name": "/业务管理/流程/异常审核/异常二审" },
  "409": { "component": () => import("@/components/business/procedure/abnormalList/abnormalList.vue"), "url": "business/procedure/abnormalList/abnormalList", "name": "/业务管理/流程/异常流程查询" },
  "625": { "component": () => import("@/components/business/procedure/apply/applyDelayLayout.vue"), "url": "business/procedure/apply/applyDelayLayout", "name": "/业务管理/流程/异常申请" },
  "407": { "component": () => import("@/components/business/procedure/apply/applyDelayLayout.vue"), "url": "business/procedure/apply/applyDelayLayout", "name": "/业务管理/流程/异常申请" },
  "408": { "component": () => import("@/components/business/procedure/apply/applyDelayLayout.vue"), "url": "business/procedure/apply/applyDelayLayout", "name": "/业务管理/流程/延期申请" },
  "621": { "component": () => import("@/components/business/procedure/apply/applyDelayLayout.vue"), "url": "business/procedure/apply/applyDelayLayout", "name": "/业务管理/流程/异常申请" },
  "514": { "component": () => import("@/components/business/procedure/apply/applyDelayLayout.vue"), "url": "business/procedure/apply/applyDelayLayout", "name": "/业务管理/流程/异常申请/延期申请" },
  "499": { "component": () => import("@/components/business/procedure/apply/applyRefundLayout.vue"), "url": "business/procedure/apply/applyRefundLayout", "name": "/业务管理/流程/异常申请/退件申请" },
  "448": { "component": () => import("@/components/business/procedure/apply/applyRefundLayout.vue"), "url": "business/procedure/apply/applyRefundLayout", "name": "/业务管理/流程/流程查询/三级路由测试2" },
  "447": { "component": () => import("@/components/business/procedure/apply/applyRefundLayout.vue"), "url": "business/procedure/apply/applyRefundLayout", "name": "/业务管理/流程/流程查询/三级路由测试1" },
  "217": { "component": () => import("@/components/business/quotation/QuotationAudit.vue"), "url": "business/quotation/QuotationAudit", "name": "/市场管理/报价系统/报价审核" },
  "462": { "component": () => import("@/components/business/quotation/QuotationBackList.vue"), "url": "business/quotation/QuotationBackList", "name": "/市场管理/报价系统/异常报价" },
  "72": { "component": () => import("@/components/business/quotation/QuotationList.vue"), "url": "business/quotation/QuotationList", "name": "/市场管理/报价系统/报价查询" },
  "163": { "component": () => import("@/components/business/quotation/QuotationTab.vue"), "url": "business/quotation/QuotationTab", "name": "/市场管理/报价系统/新增报价" },
  "352": { "component": () => import("@/components/business/quotation/QuotationToPlan.vue"), "url": "business/quotation/QuotationToPlan", "name": "/市场管理/报价系统/转任务" },
  "336": { "component": () => import("@/components/business/quotation/auditDiscount.vue"), "url": "business/quotation/auditDiscount", "name": "/市场管理/报价系统/折扣审核" },
  "346": { "component": () => import("@/components/business/quotation/discountHistory.vue"), "url": "business/quotation/discountHistory", "name": "/市场管理/报价系统/折扣审核记录" },
  "457": { "component": () => import("@/components/business/quotation/quotationSetStatus.vue"), "url": "business/quotation/quotationSetStatus", "name": "/市场管理/报价系统/设置状态" },
  "567": { "component": () => import("@/components/business/sample/circulationQuery.vue"), "url": "business/sample/circulationQuery", "name": "/业务管理/样品/流转查询" },
  "568": { "component": () => import("@/components/business/sample/circulationQueryDetail.vue"), "url": "business/sample/circulationQueryDetail", "name": "/业务管理/库房/流转查询详情" },
  "565": { "component": () => import("@/components/business/sample/departmentRoomMaintain.vue"), "url": "business/sample/departmentRoomMaintain", "name": "/业务管理/样品/部门房间号维护" },
  "564": { "component": () => import("@/components/business/sample/roomPrint.vue"), "url": "business/sample/roomPrint", "name": "/业务管理/样品/房间条码打印" },
  "566": { "component": () => import("@/components/business/sample/sampleCirculation.vue"), "url": "business/sample/sampleCirculation", "name": "/业务管理/样品/样品流转" },
  "748": { "component": () => import("@/components/business/sample/sampleCirculationDetail.vue"), "url": "business/sample/sampleCirculationDetail", "name": "/业务管理/样品/样品流转详情" },
  "397": { "component": () => import("@/components/business/secondAllot/allotList.vue"), "url": "business/secondAllot/allotList", "name": "/业务管理/送检任务/人员任务分配" },
  "624": { "component": () => import("@/components/business/secondAllot/conductPost.vue"), "url": "business/secondAllot/conductPost", "name": "/首页/我的工作/进行中的任务(岗位)" },
  "423": { "component": () => import("@/components/business/secondAllot/ongoingTasks.vue"), "url": "business/secondAllot/ongoingTasks", "name": "/首页/我的工作/进行中的任务(人员)" },
  "417": { "component": () => import("@/components/business/secondAllot/userSjdQuery.vue"), "url": "business/secondAllot/userSjdQuery", "name": "/业务管理/送检任务/人员任务查看" },
  "340": { "component": () => import("@/components/business/storage/certificateStore.vue"), "url": "business/storage/certificateStore", "name": "/业务管理/库房/证书入库" },
  "520": { "component": () => import("@/components/business/storage/certificateStoreDetail.vue"), "url": "business/storage/certificateStoreDetail", "name": "/业务管理/库房/证书入库详情" },
  "680": { "component": () => import("@/components/business/storage/comprehensiveOut.vue"), "url": "business/storage/comprehensiveOut", "name": "/业务管理/库房/综合出库" },
  "517": { "component": () => import("@/components/business/storage/comprehensiveStore.vue"), "url": "business/storage/comprehensiveStore", "name": "/业务管理/库房/综合入库" },
  "743": { "component": () => import("@/components/business/storage/guaranteeEntry.vue"), "url": "business/storage/guaranteeEntry", "name": "/业务管理/担保/担保录入" },
  "493": { "component": () => import("@/components/business/storage/guaranteeEntry.vue"), "url": "business/storage/guaranteeEntry", "name": "/业务管理/库房/担保录入" },
  "745": { "component": () => import("@/components/business/storage/guaranteeQuery.vue"), "url": "business/storage/guaranteeQuery", "name": "/业务管理/担保/担保查询" },
  "494": { "component": () => import("@/components/business/storage/guaranteeQuery.vue"), "url": "business/storage/guaranteeQuery", "name": "/业务管理/库房/担保查询" },
  "492": { "component": () => import("@/components/business/storage/originalRecordHand.vue"), "url": "business/storage/originalRecordHand", "name": "/业务管理/库房/原始记录交接" },
  "550": { "component": () => import("@/components/business/storage/outQuery.vue"), "url": "business/storage/outQuery", "name": "/业务管理/库房/出库记录查询" },
  "549": { "component": () => import("@/components/business/storage/sendSample.vue"), "url": "business/storage/sendSample", "name": "/业务管理/库房/样管员送样" },
  "763": { "component": () => import("@/components/business/storage/sendSamplePrint.vue"), "url": "business/storage/sendSamplePrint", "name": "/业务管理/库房/快递单打印" },
  "544": { "component": () => import("@/components/business/storage/storeQuery.vue"), "url": "business/storage/storeQuery", "name": "/业务管理/库房/库房查询" },
  "395": { "component": () => import("@/components/business/subpackage/SubcontractQuery.vue"), "url": "business/subpackage/SubcontractQuery", "name": "/业务管理/分包/分包查询" },
  "403": { "component": () => import("@/components/business/subpackage/SubcontractReturn.vue"), "url": "business/subpackage/SubcontractReturn", "name": "/业务管理/分包/分包返库" },
  "383": { "component": () => import("@/components/business/subpackage/UnSubpackage.vue"), "url": "business/subpackage/UnSubpackage", "name": "/业务管理/分包/待分包查询" },
  "384": { "component": () => import("@/components/business/subpackage/UnSubpackage.vue"), "url": "business/subpackage/UnSubpackage", "name": "/业务管理/分包/待分包查询" },
  "504": { "component": () => import("@/components/certificate/certificate/certificateAuditHyy/certificateAuditHyy.vue"), "url": "certificate/certificate/certificateAuditHyy/certificateAuditHyy", "name": "/证书/记录/证书审核/证书核验" },
  "503": { "component": () => import("@/components/certificate/certificate/certificateAuditJdy/certificateAuditJdy.vue"), "url": "certificate/certificate/certificateAuditJdy/certificateAuditJdy", "name": "/证书/记录/证书审核/证书检定" },
  "505": { "component": () => import("@/components/certificate/certificate/certificateAuditPzr/certificateAuditPzr.vue"), "url": "certificate/certificate/certificateAuditPzr/certificateAuditPzr", "name": "/证书/记录/证书审核/证书主管" },
  "511": { "component": () => import("@/components/certificate/certificate/certificateBddyQuery/certificateBddyQuery.vue"), "url": "certificate/certificate/certificateBddyQuery/certificateBddyQuery", "name": "/证书/记录/证书打印/补打打印" },
  "501": { "component": () => import("@/components/certificate/certificate/certificateEidtBeforePz/certificateEidtBeforePz.vue"), "url": "certificate/certificate/certificateEidtBeforePz/certificateEidtBeforePz", "name": "/证书/记录/证书修改/批准前修改" },
  "508": { "component": () => import("@/components/certificate/certificate/certificateFsdyQuery/certificateFsdyQuery.vue"), "url": "certificate/certificate/certificateFsdyQuery/certificateFsdyQuery", "name": "/证书/记录/证书打印/分散打印" },
  "509": { "component": () => import("@/components/certificate/certificate/certificateJzdyQuery/certificateJzdyQuery.vue"), "url": "certificate/certificate/certificateJzdyQuery/certificateJzdyQuery", "name": "/证书/记录/证书打印/集中打印" },
  "73": { "component": () => import("@/components/certificate/certificate/certificateMainTemp/certificateMainTempMain.vue"), "url": "certificate/certificate/certificateMainTemp/certificateMainTempMain", "name": "/证书/记录/证书模板/证书主模板" },
  "512": { "component": () => import("@/components/certificate/certificate/certificateQuery/certificateQueryList.vue"), "url": "certificate/certificate/certificateQuery/certificateQueryList", "name": "/证书/记录/证书查询/证书查询" },
  "54": { "component": () => import("@/components/certificate/certificate/certificateTemp/certificateTempMain.vue"), "url": "certificate/certificate/certificateTemp/certificateTempMain", "name": "/证书/记录/证书模板/证书模板" },
  "314": { "component": () => import("@/components/certificate/certificate/certificateTemplateFirstAudit/certificateTempMainFirstAudit.vue"), "url": "certificate/certificate/certificateTemplateFirstAudit/certificateTempMainFirstAudit", "name": "/证书/记录/证书模板/模板一级审核" },
  "349": { "component": () => import("@/components/certificate/certificate/certificateTemplateTwoAudit/certificateTempMainTwoAudit.vue"), "url": "certificate/certificate/certificateTemplateTwoAudit/certificateTempMainTwoAudit", "name": "/证书/记录/证书模板/模板二级审核" },
  "701": { "component": () => import("@/components/certificate/originalLog/originalLogMainTempMain/originalLogMainTempMain.vue"), "url": "certificate/originalLog/originalLogMainTempMain/originalLogMainTempMain", "name": "/证书/记录/记录模板/记录主模板" },
  "702": { "component": () => import("@/components/certificate/originalLog/originalLogTempMain/originalLogTempMain.vue"), "url": "http://certificate.html?url=certificate/originalLog/originalLogTempMain/originalLogTempMain", "name": "/证书/记录/记录模板/记录模板" },
  "703": { "component": () => import("@/components/certificate/originalLog/originalLogTemplateFirstAudit/originalLogTempMainFirstAudit.vue"), "url": "http://certificate.html?url=certificate/originalLog/originalLogTemplateFirstAudit/originalLogTempMainFirstAudit", "name": "/证书/记录/记录模板/模板一级审核" },
  "704": { "component": () => import("@/components/certificate/originalLog/originalLogTemplateTwoAudit/originalLogTempMainTwoAudit.vue"), "url": "http://certificate.html?url=certificate/originalLog/originalLogTemplateTwoAudit/originalLogTempMainTwoAudit", "name": "/证书/记录/记录模板/模板二级审核" },
  "506": { "component": () => import("@/components/certificate/certificate/certificatePdf/certificatePdfQueryList.vue"), "url": "certificate/certificate/certificatePdf/certificatePdfQueryList", "name": "/证书/记录/证书PDF/PDF生成" },
  "507": { "component": () => import("@/components/certificate/certificate/certificatePdf/certificatePdfDownList.vue"), "url": "certificate/certificate/certificatePdf/certificatePdfDownList", "name": "/证书/记录/证书PDF/PDF查看" },
  "375": { "component": () => import("@/components/finance/account/accountRecordClaimList.vue"), "url": "finance/account/accountRecordClaimList", "name": "/财务管理/到款管理/到款认领" },
  "370": { "component": () => import("@/components/finance/account/accountRecordList.vue"), "url": "finance/account/accountRecordList", "name": "/财务管理/到款管理/到款查询" },
  "382": { "component": () => import("@/components/finance/account/claimHistoryList.vue"), "url": "finance/account/claimHistoryList", "name": "/财务管理/到款管理/认领记录查询" },
  "627": { "component": () => import("@/components/finance/bill/billFormSjd.vue"), "url": "finance/bill/billFormSjd", "name": "/财务管理/缴费单/新增" },
  "322": { "component": () => import("@/components/finance/bill/billList.vue"), "url": "finance/bill/billList", "name": "/财务管理/缴费单/查询" },
  "414": { "component": () => import("@/components/finance/checkout/billCheckout.vue"), "url": "finance/checkout/billCheckout", "name": "/财务管理/结账/缴费单结账" },
  "404": { "component": () => import("@/components/finance/checkout/checkoutList.vue"), "url": "finance/checkout/checkoutList", "name": "/财务管理/结账/结账查询记录" },
  "412": { "component": () => import("@/components/finance/checkout/confirmCheckout.vue"), "url": "finance/checkout/confirmCheckout", "name": "/财务管理/结账/挂账结账" },
  "332": { "component": () => import("@/components/finance/checkout/otherCheckout.vue"), "url": "finance/checkout/otherCheckout", "name": "/财务管理/结账/其他条件结账" },
  "421": { "component": () => import("@/components/finance/checkout/ticketCheckout.vue"), "url": "finance/checkout/ticketCheckout", "name": "/财务管理/结账/预开票结账" },
  "313": { "component": () => import("@/components/finance/discount/discountVerifyList.vue"), "url": "finance/discount/discountVerifyList", "name": "/财务管理/折扣审核/折扣审核" },
  "378": { "component": () => import("@/components/finance/ticketApply/financeBill.vue"), "url": "finance/ticketApply/financeBill", "name": "/财务管理/预开票/预开发票" },
  "393": { "component": () => import("@/components/finance/ticketApply/financeBillList.vue"), "url": "finance/ticketApply/financeBillList", "name": "/财务管理/预开票/预开票记录" },
  "327": { "component": () => import("@/components/finance/ticketApply/ticketApplyList.vue"), "url": "finance/ticketApply/ticketApplyList", "name": "/财务管理/预开票/预开票申请" },
  "348": { "component": () => import("@/components/finance/ticketApply/ticketExamine.vue"), "url": "finance/ticketApply/ticketExamine", "name": "/财务管理/预开票/预开票审核" },
  "376": { "component": () => import("@/components/finance/ticketApply/ticketList.vue"), "url": "finance/ticketApply/ticketList", "name": "/财务管理/预开票/挂账查询" },
  "781": { "component": () => import("@/components/finance/history/historyCheckEntrustQuery.vue"), "url": "finance/history/historyCheckEntrustQuery", "name": "/财务管理/历史数据/历史数据处理" },
  "600": { "component": () => import("@/components/indexModule/index.vue"), "url": "indexModule/index", "name": "/首页/首页" },
  "611": { "component": () => import("@/components/indexModule/indexSetting.vue"), "url": "indexModule/indexSetting", "name": "/首页/首页设定" },
  "601": { "component": () => import("@/components/indexModule/processNavigation.vue"), "url": "indexModule/processNavigation", "name": "/首页/流程导航" },
  "602": { "component": () => import("@/components/indexModule/setMyMenu.vue"), "url": "indexModule/setMyMenu", "name": "/首页/设置快捷" },
  "563": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/业务管理/样品" },
  "232": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/基础数据" },
  "1": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/首页" },
  "249": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/统计报表" },
  "250": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/OA系统" },
  "333": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/业务管理/库房" },
  "381": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/业务管理/分包" },
  "396": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/业务管理/送检任务" },
  "275": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/证书打印" },
  "274": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/证书PDF" },
  "273": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/证书审核" },
  "272": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/证书修改" },
  "271": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/证书添加" },
  "276": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/证书查询" },
  "291": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/记录添加" },
  "292": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/记录修改" },
  "293": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/记录审核" },
  "294": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/证书上传" },
  "295": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/记录查询" },
  "290": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/记录模板" },
  "164": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/财务管理/费用" },
  "167": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/业务管理/委托" },
  "270": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录/证书模板" },
  "39": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/系统管理" },
  "123": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/业务管理" },
  "43": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/系统管理/日志管理" },
  "48": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/基础数据/委托单位" },
  "53": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/证书/记录" },
  "55": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/财务管理" },
  "56": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/服务平台" },
  "62": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/基础数据/计量器具" },
  "139": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/业务管理/现场任务" },
  "70": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/市场管理" },
  "71": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/市场管理/报价系统" },
  "742": { "component": () => import("@/components/log/LogTable.vue"), "url": "log/LogTable", "name": "/业务管理/担保" },
  "47": { "component": () => import("@/components/monitor/Monitor.vue"), "url": "monitor/Monitor", "name": "/系统管理/SQL监控" },
  "131": { "component": () => import("@/components/outerNet/customerSearch/customerList.vue"), "url": "outerNet/customerSearch/customerList", "name": "/服务平台/企业查询" },
  "391": { "component": () => import("@/components/outerNet/equipmentAudit/equipmentAuditList.vue"), "url": "outerNet/equipmentAudit/equipmentAuditList", "name": "/服务平台/强检平台/备案审核" },
  "471": { "component": () => import("@/components/outerNet/equipmentAudit/etalonAuditList.vue"), "url": "outerNet/equipmentAudit/etalonAuditList", "name": "/服务平台/强检平台/主标准器备案审核" },
  "453": { "component": () => import("@/components/outerNet/equipmentChangeAudit/equipmentChangeAuditList.vue"), "url": "outerNet/equipmentChangeAudit/equipmentChangeAuditList", "name": "/服务平台/强检平台/变更审核" },
  "465": { "component": () => import("@/components/outerNet/equipmentChangeAudit/etalonChangeAuditList.vue"), "url": "outerNet/equipmentChangeAudit/etalonChangeAuditList", "name": "/服务平台/强检平台/主标准器变更审核" },
  "434": { "component": () => import("@/components/outerNet/equipmentQuery/equipmentQueryList.vue"), "url": "outerNet/equipmentQuery/equipmentQueryList", "name": "/服务平台/强检平台/备案查询" },
  "473": { "component": () => import("@/components/outerNet/equipmentQuery/etalonQueryList.vue"), "url": "outerNet/equipmentQuery/etalonQueryList", "name": "/服务平台/强检平台/主标准器备案查询" },
  "498": { "component": () => import("@/components/outerNet/equipmentQuery/overTimeList.vue"), "url": "outerNet/equipmentQuery/overTimeList", "name": "/服务平台/强检平台/超期查询" },
  "497": { "component": () => import("@/components/outerNet/equipmentQuery/overTimeWarningList.vue"), "url": "outerNet/equipmentQuery/overTimeWarningList", "name": "/服务平台/强检平台/超期预警" },
  "356": { "component": () => import("@/components/outerNet/instruments/customerList.vue"), "url": "outerNet/instruments/customerList", "name": "/服务平台/托管器具查询" },
  "380": { "component": () => import("@/components/outerNet/olBooking/delivery/deliveryList.vue"), "url": "outerNet/olBooking/delivery/deliveryList", "name": "/服务平台/网上预约/预约送检" },
  "416": { "component": () => import("@/components/outerNet/olBooking/inquiry/inquiryList.vue"), "url": "outerNet/olBooking/inquiry/inquiryList", "name": "/服务平台/网上预约/询价" },
  "425": { "component": () => import("@/components/outerNet/olBooking/qj_delivery/qj_deliveryList.vue"), "url": "outerNet/olBooking/qj_delivery/qj_deliveryList", "name": "/服务平台/强检预约/预约送检" },
  "426": { "component": () => import("@/components/outerNet/olBooking/qj_site/qj_siteList.vue"), "url": "outerNet/olBooking/qj_site/qj_siteList", "name": "/服务平台/强检预约/预约现场" },
  "415": { "component": () => import("@/components/outerNet/olBooking/site/siteList.vue"), "url": "outerNet/olBooking/site/siteList", "name": "/服务平台/网上预约/预约现场" },
  "467": { "component": () => import("@/components/outerNet/polreg/polregList.vue"), "url": "outerNet/polreg/polregList", "name": "/服务平台/政策法规" },
  "58": { "component": () => import("@/components/outerNet/register/registerList.vue"), "url": "outerNet/register/registerList", "name": "/服务平台/注册审核" },
  "483": { "component": () => import("@/components/outerNet/suggest/designatedReplyList.vue"), "url": "outerNet/suggest/designatedReplyList", "name": "/服务平台/咨询建议/指定回复" },
  "482": { "component": () => import("@/components/outerNet/suggest/suggestList.vue"), "url": "outerNet/suggest/suggestList", "name": "/服务平台/咨询建议/咨询建议" },
  "451": { "component": () => import("@/components/quality/approval/FileApproval.vue"), "url": "quality/approval/FileApproval", "name": "/质量控制/文件审批/文件审批" },
  "450": { "component": () => import("@/components/quality/approval/FileApprovalList.vue"), "url": "quality/approval/FileApprovalList", "name": "/质量控制/文件审批/新增文件" },
  "452": { "component": () => import("@/components/quality/approval/FileApprovalQuery.vue"), "url": "quality/approval/FileApprovalQuery", "name": "/质量控制/文件审批/查询" },
  "361": { "component": () => import("@/components/quality/cnas/CnasList.vue"), "url": "quality/cnas/CnasList", "name": "/质量控制/CNAS管理/查询" },
  "360": { "component": () => import("@/components/quality/cnas/CnasTab.vue"), "url": "quality/cnas/CnasTab", "name": "/质量控制/CNAS管理/新增" },
  "761": { "component": () => import("@/components/quality/instrumentation/differentModel/traceabilityConfirm.vue"), "url": "quality/instrumentation/differentModel/traceabilityConfirm", "name": "/质量控制/仪器设备/溯源确认" },
  "762": { "component": () => import("@/components/quality/instrumentation/differentModel/traceabilityRecord.vue"), "url": "quality/instrumentation/differentModel/traceabilityRecord", "name": "/质量控制/仪器设备/溯源记录" },
  "258": { "component": () => import("@/components/quality/instrumentation/instrumentationTab.vue"), "url": "quality/instrumentation/instrumentationTab", "name": "/质量控制/仪器设备/新增" },
  "746": { "component": () => import("@/components/quality/instrumentation/planManage.vue"), "url": "quality/instrumentation/planManage", "name": "/质量控制/仪器设备/计划管理" },
  "343": { "component": () => import("@/components/quality/instrumentation/queryIns.vue"), "url": "quality/instrumentation/queryIns", "name": "/质量控制/仪器设备/查询" },
  "760": { "component": () => import("@/components/quality/instrumentation/weeklyCheckTask.vue"), "url": "quality/instrumentation/weeklyCheckTask", "name": "/质量控制/仪器设备/周检任务" },
  "749": { "component": () => import("@/components/quality/instrumentation/weeklyPlan.vue"), "url": "quality/instrumentation/weeklyPlan", "name": "/质量控制/仪器设备/周检计划" },
  "366": { "component": () => import("@/components/quality/meaStandard/CertificateAudit.vue"), "url": "quality/meaStandard/CertificateAudit", "name": "/质量控制/计量标准/证书审核" },
  "367": { "component": () => import("@/components/quality/meaStandard/CertificateAuditResult.vue"), "url": "quality/meaStandard/CertificateAuditResult", "name": "/质量控制/计量标准/证书审核结果" },
  "247": { "component": () => import("@/components/quality/meaStandard/MStandardForm.vue"), "url": "quality/meaStandard/MStandardForm", "name": "/质量控制/计量标准/新增" },
  "248": { "component": () => import("@/components/quality/meaStandard/MStandardList.vue"), "url": "quality/meaStandard/MStandardList", "name": "/质量控制/计量标准/查询" },
  "368": { "component": () => import("@/components/quality/meaStandard/SoutRecord.vue"), "url": "quality/meaStandard/SoutRecord", "name": "/质量控制/计量标准/使用记录" },
  "263": { "component": () => import("@/components/quality/personQufication/BaseDataTab.vue"), "url": "quality/personQufication/BaseDataTab", "name": "/质量控制/人员资质/基础数据维护" },
  "363": { "component": () => import("@/components/quality/personQufication/QuficationForm.vue"), "url": "quality/personQufication/QuficationForm", "name": "/质量控制/人员资质/资质录入" },
  "364": { "component": () => import("@/components/quality/personQufication/QuficationList.vue"), "url": "quality/personQufication/QuficationList", "name": "/质量控制/人员资质/资质查询" },
  "325": { "component": () => import("@/components/quality/personQufication/QuficationProjectList.vue"), "url": "quality/personQufication/QuficationProjectList", "name": "/质量控制/人员资质/资质项目维护" },
  "329": { "component": () => import("@/components/quality/personQufication/QuficationProjectList.vue"), "url": "quality/personQufication/QuficationProjectList", "name": "/质量控制/人员资质/项目维护" },
  "437": { "component": () => import("@/components/quality/systemFile/systemFileList.vue"), "url": "quality/systemFile/systemFileList", "name": "/质量控制/体系文件/浏览" },
  "428": { "component": () => import("@/components/quality/systemFile/systemFileManage.vue"), "url": "quality/systemFile/systemFileManage", "name": "/质量控制/体系文件/管理" },
  "68": { "component": () => import("@/components/quality/tecBas/TecBasForm.vue"), "url": "quality/tecBas/TecBasForm", "name": "/质量控制/技术依据/新增" },
  "69": { "component": () => import("@/components/quality/tecBas/TecBasList.vue"), "url": "quality/tecBas/TecBasList", "name": "/质量控制/技术依据/查询" },
  "634": { "component": () => import("@/components/statistics/administration/certificationQuery.vue"), "url": "statistics/administration/certificationQuery", "name": "/统计报表/行政统计/强检证书查询" },
  "633": { "component": () => import("@/components/statistics/administration/curstomerQuery.vue"), "url": "statistics/administration/curstomerQuery", "name": "/统计报表/行政统计/强检客户查询" },
  "631": { "component": () => import("@/components/statistics/administration/purposeStatistics.vue"), "url": "statistics/administration/purposeStatistics", "name": "/统计报表/行政统计/强检用途统计" },
  "632": { "component": () => import("@/components/statistics/administration/valueStatistics.vue"), "url": "statistics/administration/valueStatistics", "name": "/统计报表/行政统计/强检产值统计" },
  "640": { "component": () => import("@/components/statistics/business/certificationWarning.vue"), "url": "statistics/business/certificationWarning", "name": "/统计报表/业务统计/证书预警" },
  "639": { "component": () => import("@/components/statistics/business/offerStatistics.vue"), "url": "statistics/business/offerStatistics", "name": "/统计报表/业务统计/报价统计" },
  "638": { "component": () => import("@/components/statistics/business/outputValue.vue"), "url": "statistics/business/outputValue", "name": "/统计报表/业务统计/业务产值" },
  "635": { "component": () => import("@/components/statistics/category/applianceStatistics.vue"), "url": "statistics/category/applianceStatistics", "name": "/统计报表/类别统计/计量器具统计" },
  "637": { "component": () => import("@/components/statistics/category/division.vue"), "url": "statistics/category/division", "name": "/统计报表/类别统计/行政区划统计" },
  "636": { "component": () => import("@/components/statistics/category/industryStatistics.vue"), "url": "statistics/category/industryStatistics", "name": "/统计报表/类别统计/行业统计" },
  "648": { "component": () => import("@/components/statistics/department/applianceWarning.vue"), "url": "statistics/department/applianceWarning", "name": "/统计报表/部门统计/标准器预警" },
  "647": { "component": () => import("@/components/statistics/department/backRemind.vue"), "url": "statistics/department/backRemind", "name": "/统计报表/部门统计/返样提醒" },
  "643": { "component": () => import("@/components/statistics/department/businessWarning.vue"), "url": "statistics/department/businessWarning", "name": "/统计报表/部门统计/业务预警" },
  "652": { "component": () => import("@/components/statistics/department/certificatesStatistics.vue"), "url": "statistics/department/certificatesStatistics", "name": "/统计报表/部门统计/证件统计" },
  "650": { "component": () => import("@/components/statistics/department/cnasWarning.vue"), "url": "statistics/department/cnasWarning", "name": "/统计报表/部门统计/CNAS预警" },
  "641": { "component": () => import("@/components/statistics/department/outputStatistics.vue"), "url": "statistics/department/outputStatistics", "name": "/统计报表/部门统计/产值统计" },
  "644": { "component": () => import("@/components/statistics/department/overdueStatistics.vue"), "url": "statistics/department/overdueStatistics", "name": "/统计报表/部门统计/超期统计" },
  "653": { "component": () => import("@/components/statistics/department/projectStatistics.vue"), "url": "statistics/department/projectStatistics", "name": "/统计报表/部门统计/项目统计" },
  "651": { "component": () => import("@/components/statistics/department/projectWarning.vue"), "url": "statistics/department/projectWarning", "name": "/统计报表/部门统计/持证项目预警" },
  "646": { "component": () => import("@/components/statistics/department/sampleRemind.vue"), "url": "statistics/department/sampleRemind", "name": "/统计报表/部门统计/取样提醒" },
  "645": { "component": () => import("@/components/statistics/department/sceneStatistics.vue"), "url": "statistics/department/sceneStatistics", "name": "/统计报表/部门统计/现场统计" },
  "649": { "component": () => import("@/components/statistics/department/standardWarning.vue"), "url": "statistics/department/standardWarning", "name": "/统计报表/部门统计/计量标准预警" },
  "642": { "component": () => import("@/components/statistics/department/ticketStatistics.vue"), "url": "statistics/department/ticketStatistics", "name": "/统计报表/部门统计/预开票统计" },
  "373": { "component": () => import("@/components/business/contract/ContractTab.vue"), "url": "business/contract/ContractTab", "name": "/市场管理/合同管理/添加" },
  "267": { "component": () => import("@/components/business/entrust/EntrustWtdDetail.vue"), "url": "business/entrust/EntrustWtdDetail", "name": "/业务管理/委托/业务受理查询详细页面" },
  "460": { "component": () => import("@/components/business/entrust/EntrustWtdForm.vue"), "url": "business/entrust/EntrustWtdForm", "name": "/服务平台/网上预约/业务受理" },
  "461": { "component": () => import("@/components/business/plan/PlanTable.vue"), "url": "business/plan/PlanTable", "name": "/服务平台/网上预约/现场任务" },
  "213": { "component": () => import("@/components/business/plan/planDetail.vue"), "url": "business/plan/planDetail", "name": "/业务管理/现场任务/查询详细信息" },
  "252": { "component": () => import("@/components/business/quotation/QuotationEditTab.vue"), "url": "business/quotation/QuotationEditTab", "name": "/市场管理/报价系统/详细信息" },
  "459": { "component": () => import("@/components/business/quotation/QuotationTab.vue"), "url": "business/quotation/QuotationTab", "name": "/服务平台/网上预约/新增报价" },
  "347": { "component": () => import("@/components/business/quotation/commonQuotation.vue"), "url": "business/quotation/commonQuotation", "name": "/市场管理/报价系统/折扣明细" },
  "570": { "component": () => import("@/components/business/sample/circulationQueryDetail.vue"), "url": "business/sample/circulationQueryDetail", "name": "/业务管理/样品/流转查询详情" },
  "571": { "component": () => import("@/components/business/sample/costHistoricalOperation.vue"), "url": "business/sample/costHistoricalOperation", "name": "/业务管理/样品/费用历史操作" },
  "580": { "component": () => import("@/components/business/sample/roomPrintDetail.vue"), "url": "business/sample/roomPrintDetail", "name": "/业务管理/样品/房间条码打印详情" },
  "548": { "component": () => import("@/components/business/storage/certificateOut.vue"), "url": "business/storage/certificateOut", "name": "/业务管理/库房/证书出库" },
  "560": { "component": () => import("@/components/business/storage/certificateStoreDetail.vue"), "url": "business/storage/certificateStoreDetail", "name": "/业务管理/库房/证书入库详情" },
  "681": { "component": () => import("@/components/business/storage/comprehensiveOutDetail.vue"), "url": "business/storage/comprehensiveOutDetail", "name": "/业务管理/库房/综合出库详情" },
  "521": { "component": () => import("@/components/business/storage/comprehensiveStoreDetail.vue"), "url": "business/storage/comprehensiveStoreDetail", "name": "/业务管理/库房/综合入库详情" },
  "744": { "component": () => import("@/components/business/storage/guaranteeEntryDetail.vue"), "url": "business/storage/guaranteeEntryDetail", "name": "/业务管理/担保/担保录入详情" },
  "495": { "component": () => import("@/components/business/storage/guaranteeEntryDetail.vue"), "url": "business/storage/guaranteeEntryDetail", "name": "/业务管理/库房/担保录入详情" },
  "496": { "component": () => import("@/components/business/storage/originalRecordDetail.vue"), "url": "business/storage/originalRecordDetail", "name": "/业务管理/库房/原始记录详情" },
  "561": { "component": () => import("@/components/business/storage/outQueryPrint.vue"), "url": "business/storage/outQueryPrint", "name": "/业务管理/库房/出库单补打" },
  "551": { "component": () => import("@/components/business/storage/sampleOrCertificateOutDetail.vue"), "url": "business/storage/sampleOrCertificateOutDetail", "name": "/业务管理/库房/样品或证书出库详情" },
  "547": { "component": () => import("@/components/business/storage/sampleOut.vue"), "url": "business/storage/sampleOut", "name": "/业务管理/库房/样品出库" },
  "337": { "component": () => import("@/components/business/storage/sampleStore.vue"), "url": "business/storage/sampleStore", "name": "/业务管理/库房/样品入库" },
  "519": { "component": () => import("@/components/business/storage/sampleStoreDetail.vue"), "url": "business/storage/sampleStoreDetail", "name": "/业务管理/库房/样品入库详情" },
  "562": { "component": () => import("@/components/business/storage/sendSamplePrint.vue"), "url": "business/storage/sendSamplePrint", "name": "/业务管理/库房/综合出库快递单打印" },
  "518": { "component": () => import("@/components/business/storage/storeRevert.vue"), "url": "business/storage/storeRevert", "name": "/业务管理/库房/入库撤销" },
  "522": { "component": () => import("@/components/business/storage/storeRevertDetail.vue"), "url": "business/storage/storeRevertDetail", "name": "/业务管理/库房/入库撤销详情" },
  "540": { "component": () => import("@/components/business/storage/storeStatistics.vue"), "url": "business/storage/storeStatistics", "name": "/业务管理/库房/库房统计" },
  "405": { "component": () => import("@/components/finance/checkout/checkoutDetail.vue"), "url": "finance/checkout/checkoutDetail", "name": "/财务管理/结账/结账详情" },
  "398": { "component": () => import("@/components/finance/ticketApply/financeBillDetail.vue"), "url": "finance/ticketApply/financeBillDetail", "name": "/财务管理/预开票/开票详细" },
  "614": { "component": () => import("@/components/indexModule/market/urgent/urgent.vue"), "url": "indexModule/market/urgent/urgent", "name": "/首页/首页市场类加急页面" },
  "612": { "component": () => import("@/components/indexModule/notice/notice.vue"), "url": "indexModule/notice/notice", "name": "/首页/首页通知公告详细" },
  "613": { "component": () => import("@/components/indexModule/notice/noticeMore.vue"), "url": "indexModule/notice/noticeMore", "name": "/首页/首页通知公告更多" },
  "604": { "component": () => import("@/components/indexModule/task/all/all.vue"), "url": "indexModule/task/all/all", "name": "/首页/所有未检类" },
  "608": { "component": () => import("@/components/indexModule/task/all/allDetail.vue"), "url": "indexModule/task/all/allDetail", "name": "/首页/所有未检详细" },
  "605": { "component": () => import("@/components/indexModule/task/overdue/overdue.vue"), "url": "indexModule/task/overdue/overdue", "name": "/首页/超期未检" },
  "609": { "component": () => import("@/components/indexModule/task/overdue/overdueDetail.vue"), "url": "indexModule/task/overdue/overdueDetail", "name": "/首页/超期未检任务详细" },
  "607": { "component": () => import("@/components/indexModule/task/receiveSample/receiveSample.vue"), "url": "indexModule/task/receiveSample/receiveSample", "name": "/首页/待领样" },
  "606": { "component": () => import("@/components/indexModule/task/urgent/urgent.vue"), "url": "indexModule/task/urgent/urgent", "name": "/首页/加急" },
  "610": { "component": () => import("@/components/indexModule/task/urgent/urgentDetail.vue"), "url": "indexModule/task/urgent/urgentDetail", "name": "/首页/加急任务详细" },
  "545": { "component": () => import("@/components/outerNet/customerSearch/customerForm.vue"), "url": "outerNet/customerSearch/customerForm", "name": "/服务平台/企业账号信息" },
  "546": { "component": () => import("@/components/outerNet/customerSearch/customerInfo.vue"), "url": "outerNet/customerSearch/customerInfo", "name": "/服务平台/企业基本信息" },
  "418": { "component": () => import("@/components/outerNet/equipmentAudit/equipmentAuditForm.vue"), "url": "outerNet/equipmentAudit/equipmentAuditForm", "name": "/服务平台/强检平台/备案审核详情" },
  "472": { "component": () => import("@/components/outerNet/equipmentAudit/etalonAuditForm.vue"), "url": "outerNet/equipmentAudit/etalonAuditForm", "name": "/服务平台/强检平台/主标准器备案审核详情" },
  "454": { "component": () => import("@/components/outerNet/equipmentChangeAudit/equipmentChangeAuditForm.vue"), "url": "outerNet/equipmentChangeAudit/equipmentChangeAuditForm", "name": "/服务平台/强检平台/变更审核详情" },
  "466": { "component": () => import("@/components/outerNet/equipmentChangeAudit/etalonChangeAuditForm.vue"), "url": "outerNet/equipmentChangeAudit/etalonChangeAuditForm", "name": "/服务平台/强检平台/主标准器变更审核详情" },
  "438": { "component": () => import("@/components/outerNet/equipmentQuery/equipmentDetail.vue"), "url": "outerNet/equipmentQuery/equipmentDetail", "name": "/服务平台/强检平台/强检器具详情" },
  "436": { "component": () => import("@/components/outerNet/equipmentQuery/equipmentQueryForm.vue"), "url": "outerNet/equipmentQuery/equipmentQueryForm", "name": "/服务平台/强检平台/备案详情" },
  "476": { "component": () => import("@/components/outerNet/equipmentQuery/etalonDetail.vue"), "url": "outerNet/equipmentQuery/etalonDetail", "name": "/服务平台/强检平台/主标准器器具详情" },
  "474": { "component": () => import("@/components/outerNet/equipmentQuery/etalonQueryForm.vue"), "url": "outerNet/equipmentQuery/etalonQueryForm", "name": "/服务平台/强检平台/主标准器备案详情" },
  "516": { "component": () => import("@/components/outerNet/equipmentQuery/overTimeQueryForm.vue"), "url": "outerNet/equipmentQuery/overTimeQueryForm", "name": "/服务平台/强检平台/超期查询企业详情" },
  "515": { "component": () => import("@/components/outerNet/equipmentQuery/overTimeWarningQueryForm.vue"), "url": "outerNet/equipmentQuery/overTimeWarningQueryForm", "name": "/服务平台/强检平台/超期预警企业详情" },
  "358": { "component": () => import("@/components/outerNet/instruments/instrumentsDetail.vue"), "url": "outerNet/instruments/instrumentsDetail", "name": "/服务平台/托管器具详情" },
  "357": { "component": () => import("@/components/outerNet/instruments/instrumentsList.vue"), "url": "outerNet/instruments/instrumentsList", "name": "/服务平台/企业托管器具查询" },
  "420": { "component": () => import("@/components/outerNet/olBooking/mergeForm.vue"), "url": "outerNet/olBooking/mergeForm", "name": "/服务平台/网上预约/器具合并" },
  "394": { "component": () => import("@/components/outerNet/olBooking/olBookingForm.vue"), "url": "outerNet/olBooking/olBookingForm", "name": "/服务平台/网上预约/预约详情" },
  "576": { "component": () => import("@/components/outerNet/olBooking/printForm.vue"), "url": "outerNet/olBooking/printForm", "name": "/服务平台/网上预约/预约单打印" },
  "475": { "component": () => import("@/components/outerNet/polreg/polregForm.vue"), "url": "outerNet/polreg/polregForm", "name": "/服务平台/政策法规详情" },
  "355": { "component": () => import("@/components/outerNet/register/registerForm.vue"), "url": "outerNet/register/registerForm", "name": "/服务平台/注册审核详情" },
  "488": { "component": () => import("@/components/outerNet/suggest/designatedReplyForm.vue"), "url": "outerNet/suggest/designatedReplyForm", "name": "/服务平台/咨询建议/指定回复" },
  "491": { "component": () => import("@/components/outerNet/suggest/designatedReplyInfo.vue"), "url": "outerNet/suggest/designatedReplyInfo", "name": "/服务平台/咨询建议/指定回复详情" },
  "486": { "component": () => import("@/components/outerNet/suggest/suggestForm.vue"), "url": "outerNet/suggest/suggestForm", "name": "/服务平台/咨询建议/咨询建议详情" },
  "455": { "component": () => import("@/components/quality/approval/FileApprovalForm.vue"), "url": "quality/approval/FileApprovalForm", "name": "/质量控制/文件审批/文件审批新增(详细)页面" },
  "456": { "component": () => import("@/components/quality/approval/FileApprovalForm.vue"), "url": "quality/approval/FileApprovalForm", "name": "/质量控制/文件审批/新增(详细)页面 " },
  "479": { "component": () => import("@/components/quality/cnas/CnasTab.vue"), "url": "quality/cnas/CnasTab", "name": "/质量控制/CNAS管理/修改" },
  "750": { "component": () => import("@/components/quality/personQufication/QuficationForm.vue"), "url": "quality/personQufication/QuficationForm", "name": "/质量控制/人员资质/资质编辑" },
  "480": { "component": () => import("@/components/quality/tecBas/TecBasForm.vue"), "url": "quality/tecBas/TecBasForm", "name": "/质量控制/技术依据/修改" },
  "786": { "component": () => import("@/components/quality/instrumentation/recordTab/inspectRecordTab.vue"), "url": "quality/instrumentation/recordTab/inspectRecordTab", "name": "/质量控制/仪器设备/核查记录" },
  "788": { "component": () => import("@/components/quality/instrumentation/recordTab/maintainRecordTab.vue"), "url": "quality/instrumentation/recordTab/maintainRecordTab", "name": "/质量控制/仪器设备/保养记录" },
  "790": { "component": () => import("@/components/quality/instrumentation/recordTab/repeatabilityRecordTab.vue"), "url": "quality/instrumentation/recordTab/repeatabilityRecordTab", "name": "/质量控制/仪器设备/重复性记录" },
  "789": { "component": () => import("@/components/quality/instrumentation/recordTab/stabilityRecordTab.vue"), "url": "quality/instrumentation/recordTab/stabilityRecordTab", "name": "/质量控制/仪器设备/稳定性记录" },
  "446": { "component": () => import("@/components/quality/instrumentation/useLog/InstUseLogList.vue"), "url": "quality/instrumentation/instrumentation/useLog/InstUseLogList.vue", "name": "/质量控制/仪器设备/使用记录" },
  //"/iframe专用跳转"
  "framework/Iframe": { "component": () => import("@/components/framework/Iframe.vue"), "name": "/iframe专用跳转" },
}


//通过数据库生成组件列表
//"/iframe专用跳转" 不同 数据库生成
//"framework/Iframe":{"component": () => import("@/components/framework/Iframe.vue"),"name":"/iframe专用跳转"} ,
function getComponent(id, component) {
  if (component == 'framework/Iframe') {
    return URLS[component]["component"]
  }
  if (URLS[id]) {
    return URLS[id]["component"];
  } else if (URLS[id.replace("S", "")]) {
    return URLS[id.replace("S", "")]["component"];
  } else if (URLS[component]) {
    return URLS[component]["component"]
  } else {
    return null;
  }
}

function getChildren(val) {
  let childList = [];
  if (val.component != null && val.component.indexOf("http") == 0) {
    Vue.set(val.meta, 'url', val.component)
    Vue.set(val, 'component', 'framework/Iframe')
  }
  if (val.children && val.children.length > 0) {
    val.children.forEach(temp => {
      if (temp.component != null && temp.component.indexOf("http") == 0) {
        Vue.set(temp.meta, 'url', temp.component)
        Vue.set(temp, 'component', 'framework/Iframe')
      }
      let handelcomponent = String(temp.component).replace('.vue', '')
      if (temp.children) {
        childList.push({
          path: `/admin/${temp.id}`, // 路径
          notFirst: true, // 判断从第二级开始如果只有一个children也出现下拉项
          hidden: temp.hidden === '1' ? true : false, // 是否在侧边栏显示
          name: temp.id, // 路由名称 ---暂时使用id
          meta: {
            'title': temp.meta.title, // 侧边栏名称
            'tabTitle': temp.meta.tab_name == 'null' ? temp.meta.title : temp.meta.tab_name,
            'icon': temp.meta.icon, // 侧边栏图标
            'url': temp.meta.url ? temp.meta.url : '', // iframe路径
            'id': temp.id,
            'hidden': temp.hidden === '1' ? true : false, // 判断是否是编辑页等
            'activeSlug': temp.hidden === '1' ? temp.pid : temp.id, // 侧边栏激活状态
            'compName': temp['vue_com_name']
          },
          component: getComponent(temp.id, handelcomponent),// () => import('@/components/'+ handelcomponent + '.vue'),
          children: getChildren(temp)
        })
      } else {
        childList.push({
          path: temp.id,
          notFirst: true,
          hidden: temp.hidden === '1' ? true : false,
          name: temp.id,
          meta: {
            'title': temp.meta.title,
            'tabTitle': temp.meta.tab_name == 'null' ? temp.meta.title : temp.meta.tab_name,
            'icon': temp.meta.icon,
            'url': temp.meta.url ? temp.meta.url : '',
            'id': temp.id,
            'hidden': temp.hidden === '1' ? true : false,
            'activeSlug': temp.hidden === '1' ? temp.pid : temp.id,
            'compName': temp['vue_com_name']
          },
          component: getComponent(temp.id, handelcomponent),//() => import('@/components/'+ handelcomponent + '.vue'),
        })
      }
    })
  } else {
    let handelcomponent = String(val.component).replace('.vue', '')
    childList.push({
      path: val.id,
      hidden: val.hidden === '1' ? true : false,
      name: val.id,
      meta: {
        'title': val.meta.title,
        'tabTitle': val.meta.tab_name == 'null' ? val.meta.title : val.meta.tab_name,
        'icon': val.meta.icon,
        'url': val.meta.url ? val.meta.url : '',
        'id': val.id,
        'hidden': val.hidden === '1' ? true : false,
        'activeSlug': val.hidden === '1' ? val.pid : val.id,
        'compName': val['vue_com_name']
      },
      component: getComponent(val.id, handelcomponent),//() => import('@/components/'+ handelcomponent + '.vue')
    })
  }
  return childList;
}
const admin = {
  state: {
    routers: [],
    titleArray: [],
    themeColor: '1d74b7',
    themeColors: ['409eff', 'ff4060', '1d74b7', 'black'],
    active: '',
    leftMenu: '',
    sidebarSlug: '',
    currentStatus: '',
    id: '',//存放应用单app存放的id值
    z_index: 2000,//用于同步  common-el/element-ui 的index
    window_innerHeight: window.innerHeight,
    window_innerWidth: window.innerWidth,
    isCertificatIframe: false,
    isLoad: false,
    topMenuIds: [],
  },
  /**
   * TODO 案例 VUEX mutations 主要用于 同步的提交参数使用
   * 类似数据库的 commit 提交  类似  java set方法赋值
   */
  mutations: {
    /** TODO 调用时 字符串式调用commit  例如： commit('SET_ROUTERS','参数')   */
    SET_ROUTERS: (state, obj) => {
      state.routers = obj.router
      // router.addRoutes(state.routers)
      // sessionStorage.setItem('routers-'+obj.id, JSON.stringify(obj.router))
      // console.log(JSON.stringify(obj.router),'JSON.stringify(obj.router)')
      state['routers-' + obj.id] = obj.router
    },
    ADD_ROUTERS: (state, obj) => {
      router.addRoutes(obj)
    },
    toggleTheme: (state, curColor) => {
      state.themeColor = curColor
    },
    SET_APP_ID: (state, id) => {
      state.id = id
    },
    SET_Z_INDEX: (state, id) => {
      state.z_index = id
    },
    SET_window_innerHeight: (state, id) => {
      state.window_innerHeight = id
    },
    SET_window_innerWidth: (state, id) => {
      state.window_innerWidth = id
    },
    SET_isCertificatIframe: (state, id) => {
      state.isCertificatIframe = id
    },
    SET_ACTIVE: (state, id) => {
      state.active = id
    },
    SET_LEFT_MENU: (state, leftMenu) => {
      //console.log(leftMenu,'leftMenu')
      state.leftMenu = leftMenu
    },
    TOGGLE_SIDEBAR: (state, slug) => {
      state.sidebarSlug = slug
    },
    SET_STATUS: (state, slug) => {
      state.currentStatus = slug
    },
    SET_LOAD_STATE: (state, slug) => {
      state.isLoad = slug
    },
    HANDLE_MENU_ID: (state, view) => {
      let topMenuIds = [];
      view.forEach(val => {
        topMenuIds.push(val.id)
      })
      sessionStorage.setItem('topMenuIds', JSON.stringify(topMenuIds))
    },
  },
  /**
   * TODO 案例 VUEX 主要是处理异步操作
   */
  actions: {
    /**
     * 调用方法见 src\components\integration\admin.vue
     *    this.$store.dispatch('handleRoutes',{mPid:id})
     */
    handleRoutes({ commit, state }, params) {
      return new Promise((resolve, rej) => {
        let leftMenu = [],
          allMenu = [],
          titleArrayObj = sessionStorage.getItem('titleArrayObj') ? JSON.parse(sessionStorage.getItem('titleArrayObj')) : {};
        let currentRouters = titleArrayObj[params.mPid] ? titleArrayObj[params.mPid] : [];
        let topMenuIds = sessionStorage.getItem('topMenuIds') ? JSON.parse(sessionStorage.getItem('topMenuIds')) : [];
        currentRouters.forEach(val => {
          Vue.set(val.meta, 'id', val.id)
          leftMenu.push({
            path: '/admin', // 模块的路径
            id: val.id,
            component: () => import('@/components/integration/admin.vue'),
            meta: val.meta,
            hidden: val.hidden === '1' ? true : false,
            children: getChildren(val)
          })
        })
        console.log(state.isLoad)
        if (!state.isLoad) {
          let allRouters = [];
          topMenuIds.forEach(val => {
            allRouters.push(titleArrayObj[val])
          })
          allRouters.forEach(temp => {
            temp.forEach(val => {
              Vue.set(val.meta, 'id', val.id)
              allMenu.push({
                path: '/admin', // 模块的路径
                id: val.id,
                component: () => import('@/components/integration/admin.vue'),
                meta: val.meta,
                hidden: val.hidden === '1' ? true : false,
                children: getChildren(val)
              })
            })
          })
          commit('SET_LOAD_STATE', true)
          commit('ADD_ROUTERS', allMenu)
        }
        commit('SET_ROUTERS', { id: params.mPid, router: leftMenu })
        resolve()
      })
    },
    setActive({ commit }, id) {
      commit('SET_ACTIVE', id)
    },
    setleftMenu({ commit }, leftMenu) {
      commit('SET_LEFT_MENU', leftMenu)
    },
    toggleSideBar({ commit }, slug) {
      commit('TOGGLE_SIDEBAR', slug)
    },
    getAllLoadMenu({ commit, state }, params) {
      return new Promise((resolve) => {
        console.log(new Date().format("yyyy-MM-dd HH:mm:ss"), '-----------------时间开始----------------------')
        ajaxRequest('post', 'back/sysMenu/loadMenus', {}, function (res) {
          console.log(new Date().format("yyyy-MM-dd HH:mm:ss"), '-----------------请求结束----------------------')
          let obj = {},
            nameTempArray = [],
            nameArray = [];
          res.forEach(val => {
            if (!obj[val.pid]) {
              obj[val.pid] = [val]
            } else {
              obj[val.pid].push(val)
            }
            nameTempArray.push(val.id)
          })
          params.tMenu.forEach(val => {
            nameTempArray.forEach(temp => {
              getName(obj[val.id], temp, val.id)
            })
          })
          function getName(tMenu, id, pid) {
            tMenu.forEach(val => {
              if (val.children && val.children.length) {
                getName(val.children, id, pid)
              } else {
                if (val.id == id) {
                  nameArray.push({ id: pid, name: id })
                }
              }
            })
          }
          obj['nameArray'] = nameArray
          sessionStorage.setItem('titleArrayObj', JSON.stringify(obj))
          console.log(new Date().format("yyyy-MM-dd HH:mm:ss"), '-----------------前端操作结束----------------------')
          resolve()
        })
      })
    }
  }
}

export default admin
