import Vue from 'vue'
import Vuex from 'vuex'
import admin from './modules/admin/admin'
import tagViews from './modules/tagViews/tagViews'
import dialogView from './modules/dialog/dialogView'
import Mstandard from './modules/Mstandard/Mstandard'
import finance from './modules/finance/finance'
import Procedure from './modules/business/procedure/procedure'
import OperatingLayer from './modules/business/entrust/operatingLayer'
import retrieveTableApi from './modules/retrieveTableApi/retrieveTableApi'
import getters from './getter'
import Notification from './modules/OA/notification/notification'
Vue.use(Vuex)

/**
 * TODO 案例 VUEX 项目的总 Store 申明入口
 * 根据业务需求，也可以单独建立一个，单业务用vuex 全局存储变量
 * 例如：tagViews
 *
 * 全局 store 已经在  src\admin.js 中全局引入
 * 其他子对象调用无需二次引入
 *
 */
const store = new Vuex.Store({
  modules: {
    admin,//申明
    tagViews,
    Mstandard,
    dialogView,
    finance,
    Procedure,
    OperatingLayer,
    Notification,
    retrieveTableApi
  },
  getters
})

export default store
