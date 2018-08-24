import { ajaxRequest,ajaxProxyRequest,ajaxSyncProxyRequest,arrayToMap,transToType,transTokey} from '@/components/util/base';
import Vue from 'vue';
import　$ from 'jquery'

let defSearch={
  conditions: [{ //检索条件
    w_id: null,          //条件组件
    logicalValue: null,  //逻辑值
    sqlSeg: null,        //检索项  --不建议在前端显示
    nameCode: null,      //字段英文名称
    aliases: null,       //字段别名 在列头显示检索项必须要有值且保持相同
    comparison: null,   //检索条件
    value: null,         //检索值
    temp_compare: [],    //检索类型可以选项
    temp_data: [],       //可选检索值
    temp_format: null,   //显示格式
    value: null,
  }],
  sortBy: null, // 查询结果排序字段
  order: null, // 排序类型 asc升序  desc降序
  collectionType: null,//选中显示的收藏条件
}

let defaultState = {
  isload: false,   // 是已经加载
  firstLoad: false,
  cols: [],        // 所有字段信息 datagrid 列头信息
  sortcols: [],    // 允许排序字段 data列中允许排序列
  personset: {},   // 个性化设置的模板信息
  dataType: [],    // 所有 wheres条件
  filtersearch:[], // 个性化过滤 wheres
  search: defSearch, // 当前查询条件
};

let conditionDef={//检索条件
  w_id:null,          //条件组件
  logicalValue:0,  //逻辑值
  sqlSeg:null,        //检索项  --不建议在前端显示
  nameCode:null,      //字段英文名称
  aliases:null,       //字段别名 在列头显示检索项必须要有值且保持相同
  comparison:null,    //检索条件
  value:null,         //检索值
  temp_compare:[],    //检索类型可以选项
  temp_data:[],       //可选检索值
  temp_format:null,   //显示格式
}


//vux 仓库对象
const retrieveTableApi = {
  state: {},
  mutations: {
    SET_ISLOAD(state,view){
      let opcode = view.opcode
      if(view.res==true){
        Vue.set(state[opcode],'isload',true)
      }else{
        Vue.set(state[opcode],'isload',false)
      }
    },
    SET_FIRSTLOAD(state,view){
      let opcode = view.opcode;
      Vue.set(state[opcode],'firstLoad',true)
    },
    SETCOLS(state,view){
      let opcode = view.opcode
      $.each(view,function(i,row){
        if(row['sortable']){
          row['sortable']="custom";
        }
      });
      Vue.set(state[opcode],'cols',view.res)
      //排序字段
      state[opcode].sortcols=[];
      view.res.forEach((v)=>{
        if(v.sortable){
          state[opcode].sortcols.push(v);
        }
      });
      //console.log('sortcols',JSON.stringify(state[opcode].sortcols));
    },
    SETPERSONSET(state,view){
      let temp = view.res;
      let opcode = view.opcode;
      if(temp && typeof temp == 'object'){
        temp['content'] = temp['content'] ? JSON.parse(temp['content']):[];
        temp['defOrder'] = temp['defOrder'] ? JSON.parse(temp['defOrder']):{order:'',sort:''};
        temp['findWhere'] = temp['findWhere'] ? JSON.parse(temp['findWhere']):[];
        temp['searchCondition'] = temp['searchCondition'] ? JSON.parse(temp['searchCondition']):[];
        temp['searchCondition'].forEach((v,i)=>{
          if(v.value.sqlWhere){
            v.value['sendConditions']=JSON.parse(v.value.sqlWhere);
          }else{
            v.value['sendConditions']=[];
          }
        });
        temp['isOpen'] = temp['isOpen'] == '0' ? false : true;
      }
      Vue.set(state[opcode],'personset',temp)
    },
    //检索收藏设置
    SET_SEARCH_CONDITION(state,view){
      let opcode = view.opcode;
      Vue.set(state[opcode]['personset'],'searchCondition',view.res)
    },
    SETDATETYPE(state,view,code){
      let opcode = view.opcode;
      Vue.set(state[opcode],'dataType',view.res)
    },
    // 更新search 选中的检索条件名
    UPDATE_SEARCH_COLLECTION_TYPE(state,view){
      let opcode = view.opcode;
      Vue.set(state[opcode]['search'],'collectionType',view.res)
    },
    // 更新search的检索条件
    UPDATESEARCH(state,view){
      let opcode = view.opcode;
      Vue.set(state[opcode],'search',view.res)
    },
    // 更新filtersearch的可选检索条件
    UPDATE_FILTER_SEARCH(state,view){
      let opcode = view.opcode;
      Vue.set(state[opcode],'filtersearch',view.res)
    },
    // 新增search的检索条件
    ADDSEARCH(state,view){
      let opcode = view.opcode;
      if(view.res){
        if(view.index || view.index == 0){
          state[opcode]['search']['conditions'].splice(view.index,1,view.res)
        }else{
          state[opcode]['search']['conditions'].push(view.res)
        }
      }
    },
    // 删除serach的检索条件
    DELETESEARCH(state,view){
      let opcode = view.opcode;
      if(state[opcode]['search'].conditions.length == 1){
        let tempData = $.extend(true,{},defaultState);
        Vue.set(state[opcode]['search'],'conditions',tempData.search.conditions)
      }else{
        state[opcode]['search'].conditions.splice(view.index,1);
      }
    },
    SETDEFAULT(state,opcode){
      if(state[opcode.opcode]){
        return;
      }
      let tempData = $.extend(true,{},defaultState);
      Vue.set(state,opcode.opcode,tempData);
    },
    CLEARDATA(state,opcode){
      Vue.delete( state, opcode.opcode )
    }
  },
  actions: {
    /** 获取个性化设置保存的值 */
    findPersonalSet({ commit },params){
      commit('SETDEFAULT',{opcode:params.opcode});
      return new Promise((resolve,reject) => {
        let _this=this;
        let opObj=this.state["retrieveTableApi"][params.opcode]
        if(opObj && opObj['isload']){
          return resolve()
        }
        ajaxSyncProxyRequest('post','/njmind/findPersonalSet/'+params.opcode,params.res,(data)=>{
          //取个人设置
          if(data){
            commit('SET_ISLOAD',{res:true,opcode:params.opcode})
            let res = data['personalSet'];
            commit('SETPERSONSET',{res:res,opcode:params.opcode})
            //取显示列
            res = data['cols'];
            commit('SETCOLS',{res:res,opcode:params.opcode})

            //取where条件
            let find=0,back=0; // 当find和back相同时则resolve 即请求全部通过之后resolve
            res = data['wheres'];
            res.forEach((item,i)=>{
              if(item.data_source.url){
                find++;
              }
            });
            res.forEach((item,i)=>{
              if(item.data_source.url){
                let url=item.data_source.url;//资源url
                let toRex=item.data_source['toRex']?item.data_source['toRex']:null;//字段转换
                let toRexType=item.data_source['toRexType']?item.data_source['toRexType']:null;//类型转换
                ajaxProxyRequest("get",url,null,(result)=>{
                  back++;
                  let tmp =result;
                  if(result['code']=='200'){
                    tmp=result["rows"];
                  }
                  if(toRexType){
                    transToType(tmp,toRexType)
                  }
                  if(toRex){
                    transTokey(tmp,toRex)
                  }
                  item.data_source['data']=tmp;
                  if(find==back){
                    commit('SETDATETYPE',{res:res,opcode:params.opcode});
                    commit('SET_FIRSTLOAD',{res:true,opcode:params.opcode})
                    _this._actions.setDefaultSearch[0](params.opcode);
                    resolve(res)
                  }
                });
              }
            });
            if(find == 0 && find==back){
              commit('SETDATETYPE',{res:res,opcode:params.opcode})
              commit('SET_FIRSTLOAD',{res:true,opcode:params.opcode})
              _this._actions.setDefaultSearch[0](params.opcode);
              resolve(res)
            }
          }else{
            reject('请求错误！')
          }
        });
      })
    },
    /**
      * 设置初始化进入页面时搜索条件的默认值
      */
    setDefaultSearch({commit},opCode){
      let opObj=this.state["retrieveTableApi"][opCode]
      let columns = opObj['dataType'];
      let filtersearch = [];
      if(opObj['personset']['moduleType']){
        filtersearch = filterShow(columns,'w_id',opObj['personset']['findWhere'])
      }else{
        filtersearch = filterDefShow(columns,opObj['cols'])
      }
      commit('UPDATE_FILTER_SEARCH',{res:filtersearch,opcode:opCode});
      // 暂时没有默认值 先取第一个
      let tempColumns = [],tempSearch = {};
      if(filtersearch.length>0){
        tempColumns = filtersearch[0]
      }else if(columns.length>0){
        tempColumns = columns[0]
      }
      tempSearch = {
        conditions: [{
                  'w_id':tempColumns['w_id'],
                  'nameCode':tempColumns['name_cn'],
                  'aliases':tempColumns['aliases'],
                  'component':tempColumns['component'],
                  'temp_compare':tempColumns['data_source']['comparis'],
                  'temp_data':tempColumns['data_source']['data'],
                  'temp_format':!tempColumns['data_source']['format']?'yyyy-MM-dd hh:mm:ss':tempColumns['data_source']['format'],
                  'value':null,
                  'logicalValue':0,
                  'comparison':tempColumns['data_source']['comparis'][0]['code'],
        }],
        sortBy: opObj['personset'].defOrder && opObj['personset'].defOrder.sort,
        order: opObj['personset'].defOrder && opObj['personset'].defOrder.order,
        collectionType:null
      }
      commit('UPDATESEARCH',{res:tempSearch,opcode:opCode});
      // this._actions.insertRetrieveItem[0](opCode);
    },
    /** 初始化表格标题检索项 */
    insertRetrieveItem({commit},opCode){
      let opObj=this.state["retrieveTableApi"][opCode];
      let searchCondition = opObj['personset']['searchCondition']
      if(searchCondition && searchCondition.length){
        opObj.search.collectionType=searchCondition[0].name;
        if(searchCondition[0].value.sendConditions.length){
          searchCondition[0].value.sendConditions.forEach((val,index) => {
            this._actions.changeRetrieveItems[0]({opCode:opCode,item:val,index:index,isload:true})
          })
          opObj.search.sortBy = searchCondition[0].value.sort
          opObj.search.order = searchCondition[0].value.order
        }
      }
    },
    /** 检索过滤 */
    changeRetrieveItems({commit},param){
      let opCode=param['opCode'];
      let item=param['item'];
      let index=param['index'];
      let isload=param['isload'];
      let opObj=this.state["retrieveTableApi"][opCode];
      /*检索项change时,更改conditions当前index属性值*/
      let wId = item['w_id'] ;
      let value = item['value']   ;
      let logicalValue = item['logicalValue'] ;
      let comparison = item['comparison'] ;
      for(let p =0 ;p< opObj.filtersearch.length;p++){
        let j=opObj.filtersearch[p];
        if(wId == j['w_id']){
          if(!(opObj.search.conditions[index] && opObj.search.conditions[index]['w_id'])){
          Vue.set(opObj.search.conditions,index,$.extend({}, conditionDef));
          }
          //if(j['component']=="input"){
          //  isload=true; //相同控件件切换值不变
          //}
          opObj.search.conditions[index]['w_id']=j['w_id'];
          opObj.search.conditions[index]['nameCode']=j['name_cn'];
          opObj.search.conditions[index]['aliases']=j['aliases'];
          opObj.search.conditions[index]['component']=j['component'];
          opObj.search.conditions[index]['temp_compare']=j['data_source']['comparis'];
          opObj.search.conditions[index]['temp_data']=j['data_source']['data'];
          opObj.search.conditions[index]['temp_format']=!j['data_source']['format']?'yyyy-MM-dd hh:mm:ss':j['data_source']['format'];
          if(isload){
            opObj.search.conditions[index]['value']=value;
            opObj.search.conditions[index]['logicalValue']= (logicalValue==null)?0:logicalValue;
            opObj.search.conditions[index]['comparison']= (comparison==null)?j['data_source']['comparis'][0]['code']:comparison;
          }else{
            opObj.search.conditions[index]['value']=null;
            opObj.search.conditions[index]['logicalValue']= 0;
            opObj.search.conditions[index]['comparison']= j['data_source']['comparis'][0]['code'];
          }
        }
      }
    },
    /** 获取个性化设置保存的值
    findPersonalSet({ commit },params){
      return new Promise((resolve,reject) => {
        ajaxProxyRequest('get','/njmind/findRows/findPersonalSet',params.res,(res)=>{
          if(res){
            commit('SETPERSONSET',{res:res,opcode:params.opcode})
            resolve(res)
          }else{
            reject(new Error('请求错误'))
          }
        })
      })
    },
    */

    /** 获取表头所有列的的数据信息
    findCols({ commit },params){
      return new Promise((resolve,reject) => {
        commit('SETDEFAULT',{opcode:params.opcode});
        ajaxProxyRequest('get','/njmind/findCols/'+params.opCode,{},(res)=>{
          if(res){
            commit('SETCOLS',{res:res,opcode:params.opCode})
            resolve()
          }else{
            reject(new Error('请求错误'))
          }
        })
      })
    },
    */

    /** 获取所有的字段是什么类型（select? data? input?）
    findWheres({ commit },params){
      return new Promise((resolve,reject) => {
        commit('SETDEFAULT',{opcode:params.opcode});
        ajaxProxyRequest('get','/njmind/findWheres/'+params.opCode,null,(res)=>{
          if(res && res.length>0){
            let find=0,back=0; // 当find和back相同时则resolve 即请求全部通过之后resolve
            res.forEach((item,i)=>{
              if(item.data_source.url){
                find++;
              }
            });
            res.forEach((item,i)=>{
              if(item.data_source.url){
                let url=item.data_source.url;//资源url
                let toRex=item.data_source['toRex']?item.data_source['toRex']:null;//字段转换
                let toRexType=item.data_source['toRexType']?item.data_source['toRexType']:null;//类型转换
                ajaxProxyRequest("get",url,null,(result)=>{
                  back++;
                  let tmp =result;
                  if(result['code']=='200'){
                    tmp=result["rows"];
                  }
                  if(toRexType){
                    transToType(tmp,toRexType)
                  }
                  if(toRex){
                    transTokey(tmp,toRex)
                  }
                  item.data_source['data']=tmp;
                  if(find==back){
                    commit('SETDATETYPE',{res:res,opcode:params.opCode})
                    resolve(res)
                  }
                });
              }
            });
            if(find == 0 && find==back){
              commit('SETDATETYPE',{res:res,opcode:params.opCode})
              resolve(res)
            }
          }else{
            reject(new Error('请求错误或者返回空数组！'))
          }
        })
      })
    }*/
  }
};



/** 用户设定条件值过滤 */
function filterShow(soe,key,filter){
  let out=[];
  if(filter && filter.length>0){
      let tmp={};
    for(let i=0;i<soe.length;i++){
      tmp[soe[i][key]]=soe[i];
    }
    for(let i=0;i<filter.length;i++){
      if(tmp[filter[i]]) out.push(tmp[filter[i]]);
    }
  }else{
    // for(let i=0;i<soe.length;i++){
    //   out.push(soe[i]);
    // }
  }
  return out;
}

function filterDefShow(soe){
  let out = [];
  soe.forEach((val) => {
    if(val['def_show'] == 1){
      out.push(val)
    }
  })
  return out
}


export default retrieveTableApi
