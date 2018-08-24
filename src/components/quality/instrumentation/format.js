import Vue from 'vue'
import $ from 'jquery'
import htmlFormat from './recordTab/htmlFormat.vue'
import {
  ajaxRequest,
  ajaxProxyRequest
} from "../../util/base.js";
export default {
  components: {
    htmlFormat
  },
  data() {
    return {
      departlist: [], //部门列表
      keeperlist: [], //保管人列表
      confirmedWays: [], //确认方式的列表
      deviceStatus: [], //设备状态
      traceWays: [], //溯源方式
      deviceType: [], //设备类别
      modeltype: [], //设备类型
      isOption: ['否', '是'], //是否类型判断依据
    }
  },
  mounted() {
    this.formatInitData();
  },
  methods: {
    formatInitData() {
      console.log('===============================')
      // 获取depart的初始数据
      ajaxRequest("get", "back/depart/list/", {
        isDelete: 0
      }, res => {
        this.departlist = res.rows;
      });
      //获取保管人的初始数据
      ajaxRequest("get", "back/user/retrieve", {}, res => {
        this.keeperlist = res.rows;
      });
      //获取确认方式、设备状态、溯源方式、设备类别、设备类型的数据
      ajaxProxyRequest("get", "/njmind/findParams/confirmedWay$instrumentationStatus$instrumentationtraceWay$instrumentationtype$instrumentationmodelType", {}, res => {
        this.confirmedWays = res.confirmedWay.list;
        this.deviceStatus = res.instrumentationStatus.list;
        this.traceWays = res.instrumentationtraceWay.list;
        this.deviceType = res.instrumentationtype.list;
        this.modeltype = res.instrumentationmodelType.list;
      });
    },
    /**table数据格式化 */
    // table日期格式化
    dateFormat(row, column, cellValue) {
      if (cellValue) {
        return new Date(cellValue).format("YYYY-MM-DD");
      }
    },
    // 确认方式格式化
    wayFormat(row, column, cellValue) {
      if (cellValue + '') {
        let msg = ''
        this.confirmedWays.forEach((v, i) => {
          if (cellValue == v.code) {
            return msg = v.remark
          }
        })
        return msg;
      }
    },
    // 设备状态格式化-
    statusFormat(row, column, cellValue) {
      if (cellValue + '') {
        let msg = ''
        this.deviceStatus.forEach((v, i) => {
          if (cellValue == v.code) {
            return msg = v.remark
          }
        })
        return msg
      }
    },
    //溯源方式格式化
    traceWayFormat(row, column, cellValue) {
      if (cellValue + '') {
        let msg = ''
        this.traceWays.forEach((v, i) => {
          if (cellValue == v.code) {
            return msg = v.remark;
          }
        })
        return msg;
      }
    },
    // 设备类别格式化-
    typeFormat(row, column, cellValue) {
      if (cellValue + '') {
        let msg = ''
        this.deviceType.forEach((v, i) => {
          if (cellValue == v.code) {
            return msg = v.remark
          }
        })
        return msg;
      }
    },
    // 设备类型格式化
    modelTypeFormat(row, column, value) {
      if (value + '') {
        let msg = ''
        this.modeltype.forEach((v) => {
          if (value == v.code) {
            return msg = v.remark
          }
        })
        return msg;
      }
    },
    // 是否类型格式化-
    isFormat(row, column, cellValue) {
      return this.isOption[+cellValue];
    },
    // 将文本内容变为html格式
    htmlFormat(row,column,cellValue){
        return (<html-format html-content={cellValue?cellValue:undefined}></html-format>)
    },
    /**table格式化end*/

  }
}
