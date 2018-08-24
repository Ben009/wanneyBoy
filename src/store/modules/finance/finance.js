import { ajaxRequest,ajaxProxyRequest } from '@/components/util/base';
let defaultState = {
  ticketType:[],//票种
  checkWay:[],//付款方式
  selectedDjhList:[],//勾选中登记号
  realChargeTotal:0,//实收费合计
  ticketCompany:'',//开票单位
  selectedList:[],//勾选中的信息
  radioIndex:-1,
}
/**
 * TODO 案例 VUEX  注意  全局变量创建时 const 名称不要和其他的vuex存储对象一样
 * 因为最终全局调用，都需要在  store/index.js 进行申明
 */
const finance = {
  state: Object.assign({},defaultState),
  /**
   * TODO 案例 VUEX mutations 主要用于 同步的提交参数使用
   * 类似数据库的 commit 提交  类似  java set方法赋值
   */
  mutations: {
    /** TODO 调用时 字符串式调用commit  例如： commit('SET_ROUTERS','参数')   */
    SET_TICKET_TYPE: (state, view) => {
      state.ticketType = view;
    },
    SET_CHECK_WAY: (state, view) => {
      state.checkWay = view;
    },
    SELECTED_DJH_LIST: (state, view) => {
      state.selectedDjhList= view;
    },
    REAL_CHARGE_TOTAL:(state,view)=>{
      state.realChargeTotal = view;
    },
    TICKET_COMPANY:(state,view)=>{
      state.ticketCompany = view;
    },
    SELECTED_LIST:(state,view)=>{
      state.selectedList = view;
    },
    RADIO_INDEX:(state,view)=>{
      state.radioIndex = view;
    },
    RESET_FINANCE_STATE: (state, view) => {
      for(let key in defaultState){
        state[key] = defaultState[key]
      }
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
    reset({ commit }){
      commit('RESET_FINANCE_STATE',defaultState)
    },
    getTicketType({ commit }){
      return new Promise((resolve,reject) => {
        ajaxProxyRequest('get','/njmind/findParam/ticketType',{cache:"false",isDelete:0
        },(val) => {
            commit('SET_TICKET_TYPE',val.list);
            resolve(val.list)
        })
      })
    },
    getCheckWay({ commit }){
      return new Promise((resolve,reject) => {
        ajaxProxyRequest('get','/njmind/findParam/checkWay',{cache:"false",isDelete:0
        },(val) => {
          commit('SET_CHECK_WAY',val.list);
          resolve(val.list)
        })
      })
    },
  }
};

export default finance
