import { ajaxRequest, ajaxProxyRequest} from '@/components/util/base';
let defaultState = {
  retrieveTemplate : [],
  departlist : [],
  personlist : [],
  standardlist: [],
  standardaduitlist:[],
  instrumentDialog: false,
  tecbasDialog:false,
  instrumentMainList: [{}],
  instrumentSecondList: [{}],
  currentIndex:0,
  currentStandardId:0,
  projectTableList:[],
  baseList:{},
  approvalAuth:[],
  aduitId:0,
}
const  MStandard = {
  state: Object.assign({},defaultState),
  mutations: {
    SET_TEMPLATE: (state, view) => {
      state.retrieveTemplate = view;
    },
    SET_DEPART_LIST: (state, view) => {
      state.departlist = view;
    },
    SET_PERSON_LIST: (state, view) => {
      state.personlist = view;
    },
    SET_STANDARD_LIST: (state, view) => {
      state.standardlist = view;
    },
    SET_STANDARDADUIT_LIST: (state, view) => {
      state.standardaduitlist = view;
    },
    INSTRUMENT_DIALOG: (state, view) => {
      state.instrumentDialog = view;
    },
    TECBAS_DIALOG: (state, view) => {
      state.tecbasDialog = view;
    },
    CURRENT_INDEX: (state, view) => {
      state.currentIndex = view;
    },
    REPLACE_MAININFO: (state, view) => {
      state.instrumentMainList.splice(state.currentIndex,1,view)
    },
    REPLACE_SECONDINFO: (state, view) => {
      state.instrumentSecondList.splice(state.currentIndex,1,view)
    },
    CURRENT_STANDARD_ID: (state, view) => {
      state.currentStandardId = view
    },
    PROJECT_TABLE_LIST: (state, view) => {
      state.projectTableList = view
    },
    EXPERIENCE_TABLE_LIST: (state, view) => {
      let tempInstrumentMainList = []
      if(view.Mainlist && view.Mainlist.length){
        view.Mainlist.forEach(val => {
          tempInstrumentMainList.push(val)
        })
      }
      if(tempInstrumentMainList.length){
        state.instrumentMainList = tempInstrumentMainList
      }
      let tempInstrumentSecondList = []
      if(view.Minorlist && view.Minorlist.length){
        view.Minorlist.forEach(val => {
          tempInstrumentSecondList.push(val)
        })
      }
      if(tempInstrumentSecondList.length){
        state.instrumentSecondList = tempInstrumentSecondList
      }
    },
    GET_BASE_LIST: (state, view) => {
      state.baseList = view
    },
    RESET_STATE: (state, view) => {
      for(let key in defaultState){
        state[key] = defaultState[key]
      }
    },
    SET_CERTIFICATE_ADUIT: (state, view) => {
      localStorage.setItem("aduitSlug", view);
    },
    SET_APPROVAL_AUTH: (state, view) => {
      state.approvalAuth = view
    },
    SET_ADUIT_ID: (state, view) => {
      localStorage.setItem("aduitId", view);
    },
  },
  actions: {
    reset({ commit }){
      commit('RESET_STATE',defaultState)
    },
    getDefaultSelect({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/settingTemplate/list', params, (res) => {
          if(res.code===200){
            resolve(res.rows)
          }else{
            reject()
          }
        })
      })
    },
    getDepartList({ commit }){
      return new Promise((resolve,reject) => {
        ajaxRequest('get','back/depart/list',{
          isDelete: 0
        },(val) => {
          if (val.code === 200) {
            commit('SET_DEPART_LIST',val.rows)
            resolve(val.rows)
          }else{
            reject()
          }
        })
      })
    },
    getPersonList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/user/listUserByDeptId/'+params.departId, null, (res) => {
          if(res.code===200){
            commit('SET_PERSON_LIST',res.rows)
            resolve(res.rows)
          }else{
            reject()
          }
        })
      })
    },
    submitForm({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest(params.Method, 'back/mStandard/', params.data, (res) => {
          if (res.code == 200) {
            resolve(res.daoResult)
          }else{
            reject()
          }
        })
      })
    },
    getRetrieveStandardList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/mStandard/retrieve', params, (res) => {
          if (res.code == 200) {
            commit('SET_STANDARD_LIST',res.rows)
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    getStandardList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/mStandard/list', params, (res) => {
          if (res.code == 200) {
            commit('SET_STANDARD_LIST',res.rows)
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    getStandardAduitList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/mstandardAud/retrieve', params, (res) => {
          if (res.code == 200) {
            commit('SET_STANDARDADUIT_LIST',res.rows)
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    submitMitemForm({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest(params.Method, params.AjaxUrl, params.Data, (res) => {
          if (res.code == 200) {
            resolve()
          }else{
            reject()
          }
        })
      })
    },
    submitInstrumentForm({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('post', 'back/mStandard/insertBatchTqMinst', params, (res) => {
          resolve(res)
        })
      })
    },
    getPorjectList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/mStandard/getTecByMstandardId', params, (res) => {
          commit('PROJECT_TABLE_LIST',res)
          resolve(res)
        })
      })
    },
    getExperienceTable({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/mStandard/getTqMinstByMstandardId', params, (res) => {
          commit('EXPERIENCE_TABLE_LIST',res)
          resolve(res)
        })
      })
    },
    getBaseDetailById({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/mStandard/', params, (res) => {
          if (res.code == 200) {
            commit('GET_BASE_LIST',res.daoResult)
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    updataStandardList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('put', 'back/mStandard/', params, (res) => {
          if (res.code == 200) {
            resolve()
          }else{
            reject()
          }
        })
      })
    },
    updataStandardAduit({ commit }, params){
      return new Promise((resolve,reject) => {
        console.log()
        ajaxRequest(params.Method, 'back/mstandardAud/', params.Params, (res) => {
          if (res.code == 200) {
            resolve()
          }else{
            reject()
          }
        })
      })
    },
    getApprovalAuth({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxProxyRequest("get", "/njmind/findParam/approvalAuth", params, (res) => {
          commit('SET_APPROVAL_AUTH',res.list)
          resolve()
        })
      })
    },
    getRetrieveRecordList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/mStandard/retrieveStandardRecond', params, (res) => {
          if (res.code == 200) {
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    getRecordList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/mStandard/listStandardRecond', params, (res) => {
          if (res.code == 200) {
            resolve(res)
          }else{
            reject()
          }
        })
      })  
    },
    getCompanyRetrieveRecordList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/instrumentation/retrieveRecords', params, (res) => {
          if (res.code == 200) {
            resolve(res)
          }else{
            reject()
          }
        })
      })
    },
    getCompanyRecordList({ commit }, params){
      return new Promise((resolve,reject) => {
        ajaxRequest('get', 'back/instrumentation/listRecords', params, (res) => {
          if (res.code == 200) {
            resolve(res)
          }else{
            reject()
          }
        })
      })
    }
  }
}

export default MStandard
