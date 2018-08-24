/**
 * TODO 20180516
 * 右侧主工作区使用 tab 切换
 *
 * TODO 案例 VUEX  注意  全局变量创建时 const 名称不要和其他的vuex存储对象一样
 * 因为最终全局调用，都需要在  store/index.js 进行申明
 */
import $ from 'jquery'
const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: [],
    tabHeight:600,//表格高度
    refrenceTagComp:true,
  },
  mutations: {
    REFRENCETAG: (state, view) => {
      state.refrenceTagComp = view;
    },
    DELETE_CACHEDVIEWS: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },
    ADD_CACHEDVIEWS: (state, view) => {
      state.cachedViews.push(view.name)
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({
        name: view.name,
        compName: view.meta.compName,
        path: view.path,
        id: view.meta.id,
        title: view.meta.tabTitle || 'no-name'
      })
      state.cachedViews.push(view.meta.compName)
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      let tempName = ''
      for (const i of state.cachedViews) {
        if (i === view.name) {
          tempName = view.name
        }
      }
      if(tempName){
        state.cachedViews=[tempName]
      }else{
        state.cachedViews=[]
      }
    },
    SET_TAG_HEIGHT:(state,height) => {
      state.tabHeight = height;
    },
    CLEARVIEWS:(state) => {
      state.cachedViews=[],
      state.visitedViews=[]
    }
  },
  actions: {
    addVisitedViews({ commit,state }, view) {
      return new Promise((resolve)=>{
        commit('ADD_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delVisitedViews({ commit,state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    setTagHeight({commit}) {
      return new Promise((resolve)=>{
        commit('SET_TAG_HEIGHT')
      })
    }
  }
}

export default tagsView
