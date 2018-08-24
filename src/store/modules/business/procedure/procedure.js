import { ajaxRequest, ajaxProxyRequest} from '@/components/util/base';
let defaultState = {
  registrationInfo:'', // 登记号进入申请时携带的标志位：(type：退件为 refund  延期为 delay )，(registrationNo：登记号)
  abnormalInfo:'', // 异常流程查询的时候标记位：(review：查询列表 aduit:审核列表),(id:异常列表id)

}
const  Procedure = {
  state: Object.assign({},defaultState),
  mutations: {
    RESET_STATE: (state, view) => {
      for(let key in defaultState){
        state[key] = defaultState[key]
      }
    },
    SET_REGISTRATION_INFO: (state, view) => {
      state.registrationInfo = view
    },
    SET_ABNORMAL_INFO: (state, view) => {
      state.abnormalInfo = view
    },
  },
  actions: {
    // 重置所有的状态值
    reset({ commit }){
      commit('RESET_STATE',defaultState)
    },

    /************************************************************ 异常申请接口  start***************************************************/
    // 验证登记号是否允许退件和延期
    validateRegistration({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/process/judgeRegistrationNo', params, (res) => {
          if(res.code===200){
            resolve(res.msg)
          }else{
            reject()
          }
        })
      })
    },
    // 获取登记号下面的详情信息
    getRegistrationDetail({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/process/getDeatail', params, (res) => {
          if(res.code===200){
            resolve(res.map)
          }else{
            reject()
          }
        })
      })
    },
    // 申请退件和延期的表单提交操作
    submitApplyForm({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('post', 'back/process/', params, (res) => {
          if(res.code===200){
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    /************************************************************ 异常申请接口  end***************************************************/

    /************************************************************ 异常查询审核接口 start****************************************************/
    // 获取异常列表
    getAbnormalList({commit},params){
      console.log(params,'params')
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/process/retrieve', params, (res) => {
          if(res.code===200){
            resolve(res)
          }else{
            reject(res && res.msg)
          }
        })
      })
    },
    // 获取异常详情
    getAbnormalDetail({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/process/'+params.id,{}, (res) => {
          if(res.code===200){
            resolve(res.daoResult)
          }else{
            reject()
          }
        })
      })
    },
    // 一级审核
    bmShAction({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('put', 'back/process/firstAuditing',params, (res) => {
          if(res.code===200){
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    // 批量一级审核
    batchDepartAduit({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('put', 'back/process/batchFirstAuditing',params, (res) => {
          if(res.code===200){
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    // 二审操作
    shAction({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('put', 'back/process/SecondAuditing',params, (res) => {
          if(res.code===200){
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    // 批量二审操作
    batchAduit({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('put', 'back/process/batchSecondAuditing',params, (res) => {
          if(res.code===200){
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    // 批量拒绝操作
    batchRefused({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('put', 'back/process/batchRefuseAuditing',params, (res) => {
          if(res.code===200){
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    // 撤回操作
    handleRecall({commit},params){
      return new Promise((resolve,reject) => {
        ajaxRequest('put', 'back/process/returnAuditing',params, (res) => {
          if(res.code===200){
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    getInfoReason({commit},param){
      return new Promise((resolve,reject)=>{
        if(param.type == "refund"){
          ajaxProxyRequest('get','/njmind/findParam/returnReason',{},res=>{
              resolve(res)
          })
        }else{
          ajaxProxyRequest('get','/njmind/findParam/delayReason',{},res=>{
              resolve(res)
          })
        }
      })
    }
    /************************************************************ 异常查询审核接口 end****************************************************/
  }
}

export default Procedure