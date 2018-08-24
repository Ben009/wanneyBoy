import { ajaxRequest, ajaxProxyRequest} from '@/components/util/base';
let defaultState = {
  registration:'',
}
const  Procedure = {
  state: Object.assign({},defaultState),
  mutations: {
    SET_REGISTRATION: (state, view) => {
      state.registration = view
    },
  },
  actions: {
    // 重置所有的状态值
    reset({ commit }){
      commit('RESET_STATE',defaultState)
    },

    /************************************************************ 操作痕迹接口  start***************************************************/
    // 获取登记号下面的详情信息
    getOperatingList({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('post', 'back/entrustSjd/queryOperateHistory', params, (res) => {
          if(res.code===200){
            resolve(res.rows)
          }else{
            reject()
          }
        })
      })
    },
    /************************************************************ 异常申请接口  end***************************************************/
  }
}

export default Procedure